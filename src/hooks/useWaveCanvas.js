import { useRef, useEffect, useCallback } from 'react';
import { evalEq } from '../audio/waveform';
import { engine } from '../audio/engine';

/**
 * Manages the waveform canvas: sizing via ResizeObserver, static draw, and RAF loop.
 * Returns { canvasRef, startRAF, stopRAF, drawCanvas }.
 */
export function useWaveCanvas({ compiledRef, stepRef, stateRef, playingRef }) {
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

    // Equation waveform (static preview)
    if (compiled) {
      ctx.strokeStyle = '#7F77DD99';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = (x / W) * 4 * Math.PI * s.tSpeed;
        const v = evalEq(compiled, t);
        const y = ((1 - v) / 2) * H;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Live analyser overlay (only while playing)
    const analyser = engine.analyser;
    if (analyser && playingRef.current) {
      const data = analyser.getValue();
      ctx.strokeStyle = '#1D9E75';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * W;
        const v = Number(data[i]);
        const y = ((1 - (isFinite(v) ? Math.max(-1, Math.min(1, v)) : 0)) / 2) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Playhead
    if (playingRef.current) {
      const xPos = (stepRef.current / 16) * W;
      ctx.strokeStyle = '#EF9F2766';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(xPos, 0);
      ctx.lineTo(xPos, H);
      ctx.stroke();
    }
  }, [compiledRef, stateRef, playingRef, stepRef]);

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
