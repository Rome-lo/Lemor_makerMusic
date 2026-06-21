import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import * as math from 'mathjs';
import * as Tone from 'tone';

import { reducer }      from './reducer';
import initialState     from './initialState';
import { engine }       from '../audio/engine';
import { exportLoop }   from '../audio/export';
import { evalEq }       from '../audio/waveform';
import { downloadBlob } from '../audio/wav';
import { SCALES }       from '../constants/scales';

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Refs that persist across renders without triggering them ──────────────
  const stateRef      = useRef(state);
  const compiledRef   = useRef(null);
  const playingRef    = useRef(false);
  const stepRef       = useRef(0);
  const stepTimeRef   = useRef(0);   // performance.now() when last step fired
  const canvasRef     = useRef(null);
  const rafRef        = useRef(null);

  // Keep stateRef in sync with every render
  useEffect(() => { stateRef.current = state; }, [state]);

  // ── Sync engine mutable bag whenever relevant state changes ──────────────
  useEffect(() => { engine.tracks   = state.tracks;   }, [state.tracks]);
  useEffect(() => { engine.tSpeed   = state.tSpeed;   }, [state.tSpeed]);
  useEffect(() => { engine.amp      = state.amp;      }, [state.amp]);
  useEffect(() => { engine.scale    = state.scale;    }, [state.scale]);
  useEffect(() => { engine.rootNote = state.rootNote; }, [state.rootNote]);

  useEffect(() => {
    if (engine.initialized) {
      engine.filter?.frequency?.rampTo(state.fil, 0.1);
    }
  }, [state.fil]);

  useEffect(() => {
    if (engine.initialized) {
      engine.reverb?.wet?.rampTo(state.rev, 0.1);
    }
  }, [state.rev]);

  useEffect(() => {
    if (engine.initialized) {
      engine.delay?.wet?.rampTo(state.del, 0.1);
    }
  }, [state.del]);

  useEffect(() => {
    if (engine.initialized) {
      engine.updateEnvelope(state.adsr);
    }
  }, [state.adsr]);

  // ── Sync drum types to engine ─────────────────────────────────────────────
  useEffect(() => {
    if (!engine.initialized) return;
    engine.buildKick(state.drumTypes.kick);
  }, [state.drumTypes.kick]);

  useEffect(() => {
    if (!engine.initialized) return;
    engine.buildSnare(state.drumTypes.snare);
  }, [state.drumTypes.snare]);

  useEffect(() => {
    if (!engine.initialized) return;
    engine.buildHat(state.drumTypes.hat);
  }, [state.drumTypes.hat]);

  useEffect(() => {
    if (!engine.initialized) return;
    engine.buildBass(state.drumTypes.bass);
  }, [state.drumTypes.bass]);

  // ── Equation compilation ──────────────────────────────────────────────────
  const handleEqChange = useCallback((eq) => {
    dispatch({ type: 'SET_EQ', payload: eq });
    try {
      const compiled = math.compile(eq);
      // Quick validation
      compiled.evaluate({ t: 0, pi: Math.PI, E: Math.E });
      compiledRef.current  = compiled;
      engine.compiledEq    = compiled;
      dispatch({ type: 'SET_EQ_ERROR', payload: null });
    } catch (e) {
      compiledRef.current = null;
      engine.compiledEq   = null;
      dispatch({ type: 'SET_EQ_ERROR', payload: e.message });
    }
  }, []);

  // Compile initial equation on mount
  useEffect(() => {
    handleEqChange(state.equation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Canvas drawing ────────────────────────────────────────────────────────
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, W, H);

    // Centre line
    ctx.strokeStyle = '#2a2a40';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    const compiled = compiledRef.current;
    const s = stateRef.current;

    // ── Equation waveform (dimmer while playing so the dot stands out) ──
    if (compiled) {
      ctx.strokeStyle = playingRef.current ? '#7F77DD55' : '#7F77DD88';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = (x / W) * 4 * Math.PI * s.tSpeed;
        const v = evalEq(compiled, t);
        const y = ((1 - v) / 2) * H;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // ── Live analyser overlay ──
    const analyser = engine.analyser;
    if (analyser && playingRef.current) {
      const data = analyser.getValue();
      ctx.strokeStyle = '#1D9E7588';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * W;
        const y = ((1 - data[i]) / 2) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // ── Waveform position indicator ──
    if (playingRef.current && compiled) {
      const bpmVal    = s.bpm;
      const stepDurMs = (60 / (bpmVal * 4)) * 1000;           // 16n in ms
      const elapsed   = performance.now() - stepTimeRef.current;
      const subProg   = Math.min(Math.max(elapsed / stepDurMs, 0), 1);
      const curStep   = stepRef.current;

      // Static trigger point — where this step actually fires on the equation
      const dotFrac = curStep / 16;
      const dotX    = dotFrac * W;
      const dotT    = dotFrac * 4 * Math.PI * s.tSpeed;
      const dotV    = evalEq(compiled, dotT);
      const dotY    = ((1 - dotV) / 2) * H;

      // Animated playhead — glides smoothly to next step along the curve
      const animFrac = ((curStep + subProg) % 16) / 16;
      const animX    = animFrac * W;
      const animT    = animFrac * 4 * Math.PI * s.tSpeed;
      const animV    = evalEq(compiled, animT);
      const animY    = ((1 - animV) / 2) * H;

      // Dashed crosshair at the trigger point
      ctx.save();
      ctx.strokeStyle = '#EF9F2738';
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(0, dotY);   ctx.lineTo(W, dotY);   // horizontal — pitch level
      ctx.moveTo(dotX, 0);   ctx.lineTo(dotX, H);   // vertical — time position
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Animated ghost dot (smaller, trails ahead along the waveform)
      ctx.save();
      ctx.shadowColor = '#EF9F27';
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = '#EF9F2777';
      ctx.beginPath();
      ctx.arc(animX, animY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Main glowing dot at trigger position
      ctx.save();
      ctx.shadowColor = '#EF9F27';
      ctx.shadowBlur  = 22;
      ctx.fillStyle   = '#EF9F27';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      // White ring
      ctx.shadowBlur    = 4;
      ctx.strokeStyle   = '#ffffff99';
      ctx.lineWidth     = 1.5;
      ctx.stroke();
      ctx.restore();

      // Labels: t-value and amplitude
      const tStr = dotT.toFixed(2);
      const aStr = (dotV >= 0 ? '+' : '') + dotV.toFixed(3);
      const lx   = dotX > W - 95 ? dotX - 96 : dotX + 9;
      const ly   = dotY < 18 ? dotY + 18 : dotY - 7;
      ctx.font      = `9px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.fillStyle = '#EF9F27cc';
      ctx.fillText(`t = ${tStr}`, lx, ly);
      ctx.fillText(`a = ${aStr}`, lx, ly + 11);
    }
  }, []);

  const startRAF = useCallback(() => {
    const loop = () => {
      drawCanvas();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [drawCanvas]);

  const stopRAF = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    drawCanvas(); // final static frame
    // Clear all step highlights
    document.querySelectorAll('.step-btn').forEach((b) => b.classList.remove('cur'));
  }, [drawCanvas]);

  // ── Transport ─────────────────────────────────────────────────────────────
  const play = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    if (!engine.initialized) {
      await engine.init();

      // Apply any instrument types already selected before first play
      const dt = stateRef.current.drumTypes;
      engine.buildKick(dt.kick);
      engine.buildSnare(dt.snare);
      engine.buildHat(dt.hat);
      engine.buildBass(dt.bass ?? 'sub');

      // Connect step-highlight callback
      engine.onStep = (idx) => {
        stepRef.current   = idx;
        stepTimeRef.current = performance.now();
        document.querySelectorAll('.step-btn').forEach((b) => b.classList.remove('cur'));
        document.querySelectorAll(`.step-btn[data-idx="${idx}"]`).forEach((b) => b.classList.add('cur'));
      };
      engine.tracks = stateRef.current.tracks;
    }

    Tone.Transport.bpm.value = stateRef.current.bpm;

    if (Tone.Transport.state === 'stopped') {
      engine.seq?.start(0);
      Tone.Transport.start();
    } else {
      Tone.Transport.start();
    }

    stepTimeRef.current = performance.now();
    playingRef.current  = true;
    dispatch({ type: 'SET_PLAYING', payload: true });
    dispatch({ type: 'SET_LOADING', payload: false });
    startRAF();
  }, [startRAF]);

  const pause = useCallback(() => {
    Tone.Transport.pause();
    playingRef.current = false;
    dispatch({ type: 'SET_PLAYING', payload: false });
    stopRAF();
  }, [stopRAF]);

  const stop = useCallback(() => {
    Tone.Transport.stop();
    engine.seq?.stop();
    stepRef.current = 0;
    playingRef.current = false;
    dispatch({ type: 'SET_PLAYING', payload: false });
    stopRAF();
  }, [stopRAF]);

  // ── BPM live update ───────────────────────────────────────────────────────
  useEffect(() => {
    if (engine.initialized) {
      Tone.Transport.bpm.rampTo(state.bpm, 0.1);
    }
  }, [state.bpm]);

  // ── Synth type change ─────────────────────────────────────────────────────
  const changeSynthType = useCallback((type) => {
    dispatch({ type: 'SET_SYNTH_TYPE', payload: type });
    if (engine.initialized) {
      engine.buildMelody(type, stateRef.current.adsr);
      engine.buildSequence();
      engine.onStep = (idx) => {
        stepRef.current     = idx;
        stepTimeRef.current = performance.now();
        document.querySelectorAll('.step-btn').forEach((b) => b.classList.remove('cur'));
        document.querySelectorAll(`.step-btn[data-idx="${idx}"]`).forEach((b) => b.classList.add('cur'));
      };
      if (stateRef.current.playing) {
        engine.seq?.start(0);
      }
    }
  }, []);

  // ── Apply equation waveform ───────────────────────────────────────────────
  const applyWave = useCallback(() => {
    if (!compiledRef.current) {
      dispatch({ type: 'SET_STATUS', payload: 'Ecuación inválida' });
      return;
    }
    if (engine.initialized) {
      const ok = engine.applyWave();
      dispatch({ type: 'SET_STATUS', payload: ok ? 'Forma de onda aplicada' : 'Tipo de sintetizador no soporta waveform custom' });
    } else {
      dispatch({ type: 'SET_SYNTH_TYPE', payload: 'custom' });
      dispatch({ type: 'SET_STATUS', payload: 'Waveform custom seleccionada (se aplica al play)' });
    }
  }, []);

  // ── Export WAV ────────────────────────────────────────────────────────────
  const doExportWAV = useCallback(async (duration) => {
    if (!compiledRef.current) {
      dispatch({ type: 'SET_STATUS', payload: 'Ecuación inválida' });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await exportLoop(duration, stateRef.current, compiledRef.current, (msg) => {
        dispatch({ type: 'SET_STATUS', payload: msg });
      });
    } catch (e) {
      dispatch({ type: 'SET_STATUS', payload: `Error: ${e.message}` });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ── Export / Import JSON ──────────────────────────────────────────────────
  const doExportJSON = useCallback(() => {
    const s = stateRef.current;
    const data = {
      equation: s.equation, tSpeed: s.tSpeed, amp: s.amp,
      scale: s.scale, rootNote: s.rootNote,
      synthType: s.synthType, preset: s.preset,
      adsr: s.adsr, fil: s.fil, rev: s.rev, del: s.del,
      bpm: s.bpm, tracks: s.tracks, drumTypes: s.drumTypes,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    downloadBlob(blob, 'lemor_preset.json');
    dispatch({ type: 'SET_STATUS', payload: 'Preset exportado' });
  }, []);

  const doImportJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        dispatch({ type: 'IMPORT_PRESET', payload: data });
        if (data.equation) handleEqChange(data.equation);
        dispatch({ type: 'SET_STATUS', payload: 'Preset importado' });
      } catch {
        dispatch({ type: 'SET_STATUS', payload: 'Error al importar preset' });
      }
    };
    reader.readAsText(file);
  }, [handleEqChange]);

  const value = {
    state,
    dispatch,
    // Refs exposed for canvas + step indicator
    stateRef,
    compiledRef,
    playingRef,
    stepRef,
    stepTimeRef,
    canvasRef,
    // Actions
    handleEqChange,
    changeSynthType,
    applyWave,
    play,
    pause,
    stop,
    doExportWAV,
    doExportJSON,
    doImportJSON,
    drawCanvas,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}
