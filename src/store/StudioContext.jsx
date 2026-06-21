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

    // Equation waveform
    if (compiled) {
      ctx.strokeStyle = '#7F77DD88';
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

    // Live analyser overlay
    const analyser = engine.analyser;
    if (analyser && playingRef.current) {
      const data = analyser.getValue();
      ctx.strokeStyle = '#1D9E75';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * W;
        const y = ((1 - data[i]) / 2) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Step position indicator
    if (playingRef.current) {
      const xPos = (stepRef.current / 16) * W;
      ctx.strokeStyle = '#EF9F2766';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, H);
      ctx.stroke();
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
        stepRef.current = idx;
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

    playingRef.current = true;
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
        stepRef.current = idx;
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
