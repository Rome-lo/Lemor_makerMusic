/**
 * Evaluate a compiled mathjs expression at time `t`.
 * Returns a clamped value in [-1, 1].
 */
export function evalEq(compiled, t) {
  if (!compiled) return 0;
  try {
    const v = +compiled.evaluate({ t, pi: Math.PI, E: Math.E });
    return isFinite(v) ? Math.max(-1, Math.min(1, v)) : 0;
  } catch {
    return 0;
  }
}

/**
 * Build an array of Fourier partials from the equation, sampled over one period.
 * Used to create a Tone.js PeriodicWave (custom oscillator waveform).
 */
export function computePartials(compiled, tSpeed, N = 128, samps = 1024) {
  const arr = new Float32Array(samps);
  for (let i = 0; i < samps; i++) {
    arr[i] = evalEq(compiled, (i / samps) * 2 * Math.PI * tSpeed);
  }
  const partials = new Array(N);
  for (let k = 1; k <= N; k++) {
    let re = 0;
    for (let n = 0; n < samps; n++) {
      re += arr[n] * Math.cos((2 * Math.PI * k * n) / samps);
    }
    partials[k - 1] = (re / samps) * 2;
  }
  return partials;
}

/**
 * Map a sequencer step index to a musical frequency using the equation + scale.
 */
export function stepToFreq(idx, compiled, tSpeed, scale, rootNote, Frequency) {
  const v = evalEq(compiled, (idx / 16) * 4 * Math.PI * tSpeed);
  const range = scale.length * 2 - 1;
  const deg   = Math.round(((v + 1) / 2) * range);
  const oct   = Math.floor(deg / scale.length);
  const step  = deg % scale.length;
  const midi  = rootNote + scale[step] + oct * 12;
  return Frequency(Math.max(21, Math.min(108, midi)), 'midi').toFrequency();
}

/**
 * Like stepToFreq but mapped to a single octave one octave below rootNote.
 * Keeps bass notes in a proper low-register range.
 */
export function bassStepToFreq(idx, compiled, tSpeed, scale, rootNote, Frequency) {
  const v      = evalEq(compiled, (idx / 16) * 4 * Math.PI * tSpeed);
  const maxDeg = scale.length - 1;
  const deg    = Math.round(((v + 1) / 2) * maxDeg);
  const midi   = (rootNote - 12) + scale[Math.min(deg, maxDeg)];
  return Frequency(Math.max(21, Math.min(72, midi)), 'midi').toFrequency();
}
