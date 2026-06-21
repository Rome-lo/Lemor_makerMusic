// atk/dec/sus/rel: ADSR · fil: filter Hz · rev: reverb 0-1 · del: delay 0-1
export const PRESETS = {
  // ── Clásicos electrónicos ──────────────────────────────────────────────
  synth:    { atk: 0.010, dec: 0.20, sus: 0.50, rel: 0.30, fil:  2000, rev: 0.20, del: 0.15 },
  bass:     { atk: 0.005, dec: 0.30, sus: 0.80, rel: 0.40, fil:   500, rev: 0.05, del: 0.05 },
  lead:     { atk: 0.005, dec: 0.10, sus: 0.70, rel: 0.15, fil:  4000, rev: 0.15, del: 0.20 },
  pad:      { atk: 0.300, dec: 0.50, sus: 0.90, rel: 1.50, fil:  1200, rev: 0.60, del: 0.25 },
  pluck:    { atk: 0.001, dec: 0.40, sus: 0.00, rel: 0.50, fil:  3000, rev: 0.25, del: 0.10 },
  organ:    { atk: 0.005, dec: 0.01, sus: 1.00, rel: 0.05, fil:  5000, rev: 0.30, del: 0.10 },

  // ── Cuerdas / viento ──────────────────────────────────────────────────
  violin:   { atk: 0.060, dec: 0.10, sus: 0.80, rel: 0.50, fil:  5500, rev: 0.35, del: 0.08 },
  cello:    { atk: 0.120, dec: 0.15, sus: 0.85, rel: 0.80, fil:  1800, rev: 0.40, del: 0.10 },
  flute:    { atk: 0.080, dec: 0.05, sus: 0.90, rel: 0.25, fil:  9000, rev: 0.35, del: 0.05 },
  oboe:     { atk: 0.030, dec: 0.08, sus: 0.75, rel: 0.20, fil:  6000, rev: 0.25, del: 0.06 },
  clarinet: { atk: 0.020, dec: 0.10, sus: 0.80, rel: 0.30, fil:  3500, rev: 0.20, del: 0.08 },
  brass:    { atk: 0.060, dec: 0.15, sus: 0.85, rel: 0.20, fil:  7000, rev: 0.22, del: 0.10 },
  trumpet:  { atk: 0.010, dec: 0.10, sus: 0.90, rel: 0.12, fil: 10000, rev: 0.18, del: 0.08 },
  strings:  { atk: 0.400, dec: 0.30, sus: 0.95, rel: 2.00, fil:  2500, rev: 0.55, del: 0.20 },

  // ── Tecla / percusión melódica ─────────────────────────────────────────
  piano:    { atk: 0.001, dec: 0.80, sus: 0.30, rel: 0.80, fil:  6000, rev: 0.25, del: 0.05 },
  epiano:   { atk: 0.003, dec: 0.60, sus: 0.40, rel: 1.00, fil:  4500, rev: 0.30, del: 0.15 },
  marimba:  { atk: 0.001, dec: 0.50, sus: 0.00, rel: 0.40, fil:  4000, rev: 0.30, del: 0.08 },
  vibes:    { atk: 0.002, dec: 1.20, sus: 0.05, rel: 1.50, fil:  8000, rev: 0.40, del: 0.20 },
  bell:     { atk: 0.001, dec: 1.50, sus: 0.10, rel: 2.20, fil: 12000, rev: 0.45, del: 0.30 },
  celesta:  { atk: 0.001, dec: 0.80, sus: 0.05, rel: 1.00, fil: 10000, rev: 0.35, del: 0.15 },

  // ── Bajos ─────────────────────────────────────────────────────────────
  bass808:  { atk: 0.005, dec: 0.60, sus: 0.70, rel: 1.20, fil:   300, rev: 0.04, del: 0.03 },
  subBass:  { atk: 0.010, dec: 0.40, sus: 0.90, rel: 0.60, fil:   200, rev: 0.02, del: 0.02 },
  acidBass: { atk: 0.005, dec: 0.15, sus: 0.60, rel: 0.20, fil:   800, rev: 0.10, del: 0.10 },

  // ── Electrónico / sintetizador ────────────────────────────────────────
  superSaw: { atk: 0.010, dec: 0.20, sus: 0.80, rel: 0.40, fil:  5000, rev: 0.30, del: 0.20 },
  wobble:   { atk: 0.005, dec: 0.25, sus: 0.70, rel: 0.30, fil:   600, rev: 0.10, del: 0.15 },
  reese:    { atk: 0.005, dec: 0.10, sus: 0.90, rel: 0.20, fil:   400, rev: 0.08, del: 0.12 },
  chiptune: { atk: 0.001, dec: 0.05, sus: 0.80, rel: 0.10, fil: 18000, rev: 0.10, del: 0.15 },
  ambient:  { atk: 0.800, dec: 1.00, sus: 0.80, rel: 3.00, fil:  1500, rev: 0.75, del: 0.40 },
  drone:    { atk: 1.500, dec: 0.50, sus: 1.00, rel: 4.00, fil:  1000, rev: 0.80, del: 0.50 },
};

export const PRESET_OPTS = [
  // ── Electrónicos
  { v: 'synth',    l: 'Sintetizador',     g: 'Electrónico' },
  { v: 'lead',     l: 'Lead Melody',      g: 'Electrónico' },
  { v: 'pad',      l: 'Pad Atmosférico',  g: 'Electrónico' },
  { v: 'superSaw', l: 'Super Saw',        g: 'Electrónico' },
  { v: 'chiptune', l: 'Chiptune',         g: 'Electrónico' },
  { v: 'organ',    l: 'Órgano',           g: 'Electrónico' },
  { v: 'ambient',  l: 'Ambient',          g: 'Electrónico' },
  { v: 'drone',    l: 'Drone',            g: 'Electrónico' },
  // ── Bajos
  { v: 'bass',     l: 'Bajo Estándar',    g: 'Bajo' },
  { v: 'bass808',  l: 'Bajo 808',         g: 'Bajo' },
  { v: 'subBass',  l: 'Sub Bajo',         g: 'Bajo' },
  { v: 'acidBass', l: 'Acid Bass',        g: 'Bajo' },
  { v: 'wobble',   l: 'Wobble Bass',      g: 'Bajo' },
  { v: 'reese',    l: 'Reese Bass',       g: 'Bajo' },
  // ── Cuerdas / viento
  { v: 'strings',  l: 'Cuerdas',          g: 'Acústico' },
  { v: 'violin',   l: 'Violín',           g: 'Acústico' },
  { v: 'cello',    l: 'Chelo',            g: 'Acústico' },
  { v: 'flute',    l: 'Flauta',           g: 'Acústico' },
  { v: 'oboe',     l: 'Oboe',             g: 'Acústico' },
  { v: 'clarinet', l: 'Clarinete',        g: 'Acústico' },
  { v: 'brass',    l: 'Metal',            g: 'Acústico' },
  { v: 'trumpet',  l: 'Trompeta',         g: 'Acústico' },
  // ── Tecla / percusión melódica
  { v: 'piano',    l: 'Piano',            g: 'Teclado' },
  { v: 'epiano',   l: 'Piano Eléctrico',  g: 'Teclado' },
  { v: 'marimba',  l: 'Marimba',          g: 'Teclado' },
  { v: 'vibes',    l: 'Vibráfono',        g: 'Teclado' },
  { v: 'bell',     l: 'Campana',          g: 'Teclado' },
  { v: 'celesta',  l: 'Celesta',          g: 'Teclado' },
  // ── Percussion / plucked
  { v: 'pluck',    l: 'Pluck',            g: 'Percusión' },
];

export const SYNTH_TYPE_OPTS = [
  // ── Osciladores base
  { v: 'basic',    l: 'Sine',      desc: 'Onda sinusoidal pura — sonido suave sin armónicos' },
  { v: 'triangle', l: 'Triangle',  desc: 'Onda triangular — similar al sine pero con leves armónicos impares' },
  { v: 'saw',      l: 'Sawtooth',  desc: 'Sierra — rico en armónicos, clásico para leads y bajos' },
  { v: 'square',   l: 'Square',    desc: 'Cuadrada — armónicos impares únicamente, timbre hueco y brillante' },
  { v: 'fatsaw',   l: 'Fat Saw',   desc: '3 sierras detuneadas — Super Saw gordo estilo EDM' },
  // ── Síntesis compleja
  { v: 'fm',       l: 'FM Synth',  desc: 'Modulación de frecuencia — timbre metálico y complejo' },
  { v: 'am',       l: 'AM Synth',  desc: 'Modulación de amplitud — trémolo intrínseco' },
  { v: 'duo',      l: 'Duo Synth', desc: 'Dos osciladores detuneados — coro natural y grosor' },
  { v: 'pluck',    l: 'Pluck',     desc: 'Karplus-Strong — cuerda pulsada realista' },
  // ── Ecuación matemática
  { v: 'custom',   l: 'Custom Eq', desc: 'Aplica la ecuación f(t) directamente como forma de onda vía DFT' },
];
