import { useRef, useEffect, useCallback } from 'react';
import { evalEq } from '../audio/waveform';
import { engine } from '../audio/engine';

/**
 * Manages the waveform canvas: sizing via ResizeObserver, static draw, and RAF loop.
 * Returns { canvasRef, startRAF, stopRAF, drawCanvas }.
 */
export function useWaveCanvas({ compiledRef, stepRef, stepTimeRef, stateRef, playingRef }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  // Keep canvas pixel dimensions in sync with its CSS size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    // Initial size
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    return () => ro.disconnect();
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width  || canvas.offsetWidth;
    const H = canvas.height || canvas.offsetHeight;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, W, H);

    // Grid centre line
    ctx.strokeStyle = '#2a2a40';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    const compiled = compiledRef.current;
    const s        = stateRef.current;

    // Equation waveform — glows when audio is active
    if (compiled) {
      // Sample RMS from analyser to drive glow intensity
      let rms = 0;
      const analyser = engine.analyser;
      if (analyser && playingRef.current) {
        const data = analyser.getValue();
        let sum = 0;
        for (let i = 0; i < data.length; i++) { const v = Number(data[i]); sum += v * v; }
        rms = Math.sqrt(sum / data.length);
      }

      const glow = playingRef.current ? Math.min(rms * 28, 14) : 0;

      ctx.save();
      ctx.shadowColor = '#7F77DD';
      ctx.shadowBlur  = glow;
      ctx.strokeStyle = playingRef.current ? '#7F77DDcc' : '#7F77DD88';
      ctx.lineWidth   = playingRef.current ? 2 : 1.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = (x / W) * 4 * Math.PI * s.tSpeed;
        const v = evalEq(compiled, t);
        const y = ((1 - v) / 2) * H;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // ── Waveform position indicator ──────────────────────────────────────────
    if (playingRef.current && compiled) {
      const bpmVal    = s.bpm;
      const stepDurMs = (60 / (bpmVal * 4)) * 1000;
      const elapsed   = performance.now() - (stepTimeRef?.current ?? 0);
      const subProg   = Math.min(Math.max(elapsed / stepDurMs, 0), 1);
      const curStep   = stepRef.current;

      // Point on the equation where the current step fires
      const dotFrac = curStep / 16;
      const dotX    = dotFrac * W;
      const dotT    = dotFrac * 4 * Math.PI * s.tSpeed;
      const dotV    = evalEq(compiled, dotT);
      const dotY    = ((1 - dotV) / 2) * H;

      // Playhead gliding smoothly to the next step along the curve
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
      ctx.moveTo(0, dotY);  ctx.lineTo(W, dotY);  // horizontal — amplitude / pitch
      ctx.moveTo(dotX, 0);  ctx.lineTo(dotX, H);  // vertical   — time position
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Ghost dot gliding along the waveform
      ctx.save();
      ctx.shadowColor = '#EF9F27';
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = '#EF9F2777';
      ctx.beginPath();
      ctx.arc(animX, animY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Main glowing dot at the trigger position
      ctx.save();
      ctx.shadowColor = '#EF9F27';
      ctx.shadowBlur  = 22;
      ctx.fillStyle   = '#EF9F27';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur  = 4;
      ctx.strokeStyle = '#ffffff99';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      ctx.restore();

      // Labels: equation t-value and amplitude
      const tStr = dotT.toFixed(2);
      const aStr = (dotV >= 0 ? '+' : '') + dotV.toFixed(3);
      const lx   = dotX > W - 95 ? dotX - 96 : dotX + 9;
      const ly   = dotY < 18 ? dotY + 18 : dotY - 7;
      ctx.font      = `9px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.fillStyle = '#EF9F27cc';
      ctx.fillText(`t = ${tStr}`, lx, ly);
      ctx.fillText(`a = ${aStr}`, lx, ly + 11);
    }
  }, [compiledRef, stateRef, playingRef, stepRef, stepTimeRef]);

  const startRAF = useCallback(() => {
    if (rafRef.current) return;
    const loop = () => {
      drawCanvas();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [drawCanvas]);

  const stopRAF = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    drawCanvas();
    document.querySelectorAll('.step-btn').forEach((b) => b.classList.remove('cur'));
  }, [drawCanvas]);

  return { canvasRef, drawCanvas, startRAF, stopRAF };
}
