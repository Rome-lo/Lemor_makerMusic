import React, { useEffect } from 'react';
import { useStudio } from '../../store/StudioContext';
import { useWaveCanvas } from '../../hooks/useWaveCanvas';

export default function WaveCanvas() {
  const { compiledRef, stateRef, playingRef, stepRef, stepTimeRef, state } = useStudio();

  const { canvasRef, drawCanvas, startRAF, stopRAF } = useWaveCanvas({
    compiledRef, stateRef, playingRef, stepRef, stepTimeRef,
  });

  // Start/stop the 60fps RAF loop based on transport state
  useEffect(() => {
    if (state.playing) {
      startRAF();
    } else {
      stopRAF();
    }
  }, [state.playing, startRAF, stopRAF]);

  // Redraw static frame on equation/param changes when not playing
  useEffect(() => {
    if (!state.playing) drawCanvas();
  });

  return (
    <canvas
      ref={canvasRef}
      className="wave-canvas"
      aria-label="Forma de onda"
    />
  );
}
