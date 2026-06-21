import React, { useEffect } from 'react';
import { useStudio } from '../../store/StudioContext';
import { useWaveCanvas } from '../../hooks/useWaveCanvas';

export default function WaveCanvas() {
  const { compiledRef, stateRef, playingRef, stepRef } = useStudio();

  const { canvasRef, drawCanvas } = useWaveCanvas({
    compiledRef, stateRef, playingRef, stepRef,
  });

  // Redraw static frame whenever equation changes
  useEffect(() => {
    drawCanvas();
  });

  return (
    <canvas
      ref={canvasRef}
      className="wave-canvas"
      aria-label="Forma de onda"
    />
  );
}
