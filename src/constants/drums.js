// ── Configuraciones de bombos (MembraneSynth) ────────────────────────────────
// note: pitch de inicio · dur: duración del trigger · vol: multiplicador de volumen
export const KICK_TYPES = {
  classic: {
    label: 'Clásico', desc: 'Bombo estándar, equilibrado y versátil',
    pitchDecay: 0.08, octaves: 8,
    note: 'C1', dur: '8n', vol: 0.85,
    envelope: { attack: 0.001, decay: 0.40, sustain: 0,   release: 0.10 },
  },
  k808: {
    label: '808', desc: 'Sub-grave largo con sustain estilo trap/reggaeton',
    pitchDecay: 0.50, octaves: 10,
    note: 'C1', dur: '16n', vol: 0.90,
    envelope: { attack: 0.001, decay: 0.90, sustain: 0.4, release: 0.50 },
  },
  punchy: {
    label: 'Punchy', desc: 'Ataque rápido y corto, muy definido',
    pitchDecay: 0.03, octaves: 6,
    note: 'C2', dur: '16n', vol: 0.90,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0,   release: 0.05 },
  },
  deep: {
    label: 'Deep', desc: 'Sub-grave profundo y grave, ideal para house/techno',
    pitchDecay: 0.28, octaves: 12,
    note: 'A0', dur: '8n', vol: 0.85,
    envelope: { attack: 0.001, decay: 0.65, sustain: 0,   release: 0.20 },
  },
  techno: {
    label: 'Techno', desc: 'Click rápido estilo industrial/techno',
    pitchDecay: 0.02, octaves: 4,
    note: 'C2', dur: '16n', vol: 0.88,
    envelope: { attack: 0.001, decay: 0.22, sustain: 0,   release: 0.08 },
  },
  electro: {
    label: 'Electro', desc: 'Bombo electrónico con cuerpo medio',
    pitchDecay: 0.15, octaves: 7,
    note: 'B0', dur: '8n', vol: 0.82,
    envelope: { attack: 0.001, decay: 0.40, sustain: 0,   release: 0.12 },
  },
  taiko: {
    label: 'Taiko', desc: 'Tambor japonés, grave y resonante',
    pitchDecay: 0.12, octaves: 5,
    note: 'E1', dur: '8n', vol: 0.80,
    envelope: { attack: 0.010, decay: 0.55, sustain: 0,   release: 0.20 },
  },
  tight: {
    label: 'Tight', desc: 'Muy corto y seco, casi un clic',
    pitchDecay: 0.015, octaves: 4,
    note: 'D2', dur: '32n', vol: 0.90,
    envelope: { attack: 0.001, decay: 0.07, sustain: 0,   release: 0.02 },
  },
  vinyl: {
    label: 'Vinyl', desc: 'Bombo abierto estilo boom-bap, con cola cálida',
    pitchDecay: 0.10, octaves: 9,
    note: 'C1', dur: '8n', vol: 0.80,
    envelope: { attack: 0.001, decay: 0.55, sustain: 0.1, release: 0.30 },
  },
  gated: {
    label: 'Gated', desc: 'Bombo con gate estilo 80s',
    pitchDecay: 0.05, octaves: 7,
    note: 'C1', dur: '8n', vol: 0.85,
    envelope: { attack: 0.001, decay: 0.30, sustain: 0,   release: 0.02 },
  },
  dubstep: {
    label: 'Dubstep', desc: 'Bombo seco y devastador, impacto máximo sin cola',
    pitchDecay: 0.022, octaves: 9,
    note: 'C1', dur: '16n', vol: 0.98,
    envelope: { attack: 0.001, decay: 0.07, sustain: 0,   release: 0.02 },
  },
};

// ── Configuraciones de cajas (NoiseSynth + filtro HP) ────────────────────────
// noiseType: white/pink/brown · hpFreq: corte del filtro paso-altos en Hz
export const SNARE_TYPES = {
  classic: {
    label: 'Clásica', desc: 'Caja estándar de ruido blanco, cuerpo equilibrado',
    noiseType: 'white', hpFreq: 1000,
    dur: '8n', vol: 0.65,
    envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
  },
  rim: {
    label: 'Rimshot', desc: 'Golpe de aro, seco y muy agudo',
    noiseType: 'white', hpFreq: 2500,
    dur: '16n', vol: 0.70,
    envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.01 },
  },
  clap: {
    label: 'Clap', desc: 'Palmada electrónica con ligero ataque',
    noiseType: 'white', hpFreq: 800,
    dur: '8n', vol: 0.65,
    envelope: { attack: 0.005, decay: 0.28, sustain: 0, release: 0.10 },
  },
  snap: {
    label: 'Snap', desc: 'Chasquido agudo y cortísimo',
    noiseType: 'white', hpFreq: 3500,
    dur: '32n', vol: 0.75,
    envelope: { attack: 0.001, decay: 0.025, sustain: 0, release: 0.01 },
  },
  deep: {
    label: 'Deep', desc: 'Caja grave con ruido rosado, sonido vintage',
    noiseType: 'pink', hpFreq: 400,
    dur: '8n', vol: 0.70,
    envelope: { attack: 0.002, decay: 0.35, sustain: 0, release: 0.10 },
  },
  brush: {
    label: 'Escobilla', desc: 'Textura de escobilla suave, ruido marrón',
    noiseType: 'brown', hpFreq: 600,
    dur: '8n', vol: 0.60,
    envelope: { attack: 0.015, decay: 0.32, sustain: 0, release: 0.15 },
  },
  electronic: {
    label: 'Electrónica', desc: 'Caja sintetizada limpia y definida',
    noiseType: 'white', hpFreq: 1500,
    dur: '8n', vol: 0.65,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
  },
  tight: {
    label: 'Tight', desc: 'Muy ajustada y seca, decay mínimo',
    noiseType: 'white', hpFreq: 2000,
    dur: '16n', vol: 0.72,
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
  },
  fat: {
    label: 'Fat', desc: 'Caja gorda y caliente con ruido rosado',
    noiseType: 'pink', hpFreq: 250,
    dur: '8n', vol: 0.68,
    envelope: { attack: 0.003, decay: 0.40, sustain: 0, release: 0.12 },
  },
  trap: {
    label: 'Trap', desc: 'Caja trap crujiente, muy comprimida',
    noiseType: 'white', hpFreq: 1800,
    dur: '8n', vol: 0.70,
    envelope: { attack: 0.001, decay: 0.22, sustain: 0, release: 0.08 },
  },
  halfstep: {
    label: 'Halfstep', desc: 'Caja dubstep seca y agresiva, sin reverb, máxima densidad',
    noiseType: 'white', hpFreq: 2400,
    dur: '16n', vol: 0.85,
    envelope: { attack: 0.001, decay: 0.055, sustain: 0, release: 0.01 },
  },
};

// ── Configuraciones de hi-hats (MetalSynth) ───────────────────────────────────
// note: tono del golpe · dur: duración del trigger · vol: multiplicador
export const HAT_TYPES = {
  closed: {
    label: 'Cerrado', desc: 'Hi-hat cerrado estándar, corto y definido',
    frequency: 400, harmonicity: 5.1, modulationIndex: 32,
    resonance: 4000, octaves: 1.5,
    note: 'C6', dur: '32n', vol: 0.28,
    envelope: { attack: 0.001, decay: 0.040, release: 0.01 },
  },
  open: {
    label: 'Abierto', desc: 'Hi-hat abierto, larga resonancia',
    frequency: 400, harmonicity: 5.1, modulationIndex: 32,
    resonance: 4000, octaves: 1.5,
    note: 'C6', dur: '4n', vol: 0.24,
    envelope: { attack: 0.001, decay: 0.50, release: 0.08 },
  },
  pedal: {
    label: 'Pedal', desc: 'Golpe de pedal, seco y muy corto',
    frequency: 600, harmonicity: 3.0, modulationIndex: 16,
    resonance: 5000, octaves: 1.0,
    note: 'D6', dur: '32n', vol: 0.22,
    envelope: { attack: 0.001, decay: 0.015, release: 0.01 },
  },
  crash: {
    label: 'Crash', desc: 'Platillo crash con larga reverberación',
    frequency: 300, harmonicity: 5.5, modulationIndex: 40,
    resonance: 3000, octaves: 2.0,
    note: 'A4', dur: '2n', vol: 0.20,
    envelope: { attack: 0.001, decay: 1.80, release: 0.25 },
  },
  ride: {
    label: 'Ride', desc: 'Platillo ride, ping definido y brillante',
    frequency: 500, harmonicity: 7.1, modulationIndex: 24,
    resonance: 5000, octaves: 1.2,
    note: 'F5', dur: '8n', vol: 0.22,
    envelope: { attack: 0.001, decay: 0.35, release: 0.10 },
  },
  shaker: {
    label: 'Shaker', desc: 'Shaker agudo y rítmico estilo latin',
    frequency: 1200, harmonicity: 2.0, modulationIndex: 8,
    resonance: 6000, octaves: 0.5,
    note: 'C7', dur: '16n', vol: 0.30,
    envelope: { attack: 0.005, decay: 0.055, release: 0.02 },
  },
  tambourine: {
    label: 'Pandero', desc: 'Sonido de pandero / tambourine',
    frequency: 800, harmonicity: 3.5, modulationIndex: 20,
    resonance: 3500, octaves: 0.8,
    note: 'A5', dur: '8n', vol: 0.28,
    envelope: { attack: 0.001, decay: 0.15, release: 0.05 },
  },
  crotales: {
    label: 'Crotales', desc: 'Platillos agudos de orquesta, cola larga',
    frequency: 1500, harmonicity: 9.0, modulationIndex: 28,
    resonance: 8000, octaves: 0.8,
    note: 'E6', dur: '4n', vol: 0.18,
    envelope: { attack: 0.001, decay: 1.00, release: 0.15 },
  },
  cowbell: {
    label: 'Cencerro', desc: 'Cencerro metálico estilo 808',
    frequency: 562, harmonicity: 5.1, modulationIndex: 16,
    resonance: 2000, octaves: 1.8,
    note: 'G5', dur: '8n', vol: 0.25,
    envelope: { attack: 0.001, decay: 0.60, release: 0.08 },
  },
  tick: {
    label: 'Tick', desc: 'Tick muy seco estilo electrónico minimalista',
    frequency: 800, harmonicity: 8.0, modulationIndex: 48,
    resonance: 7000, octaves: 0.4,
    note: 'B6', dur: '64n', vol: 0.32,
    envelope: { attack: 0.001, decay: 0.012, release: 0.01 },
  },
};

// Opciones para selects (orden: kick, snare, hat)
export const kickOpts  = Object.entries(KICK_TYPES).map(([v, c]) => ({ v, label: c.label, desc: c.desc }));
export const snareOpts = Object.entries(SNARE_TYPES).map(([v, c]) => ({ v, label: c.label, desc: c.desc }));
export const hatOpts   = Object.entries(HAT_TYPES).map(([v, c]) => ({ v, label: c.label, desc: c.desc }));
