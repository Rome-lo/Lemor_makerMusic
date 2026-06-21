export const TRACK_DEFS = [
  { key: 'kick',   label: 'Bombo',   cls: 'kick'   },
  { key: 'snare',  label: 'Caja',    cls: 'snare'  },
  { key: 'hat',    label: 'Hi-Hat',  cls: 'hat'    },
  { key: 'bass',   label: 'Bajo',    cls: 'bass'   },
  { key: 'melody', label: 'Melodía', cls: 'melody' },
];

const b = (arr) => arr.map(Boolean);

export const DEFAULT_TRACKS = {
  kick:   { steps: b([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]), vol: 1,    muted: false },
  snare:  { steps: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]), vol: 1,    muted: false },
  hat:    { steps: b([0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]), vol: 1,    muted: false },
  bass:   { steps: b([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0]), vol: 0.85, muted: false },
  melody: { steps: b([1,0,0,0, 0,1,0,0, 1,0,0,0, 0,1,0,0]), vol: 1,    muted: false },
};

export const FILL_PATTERNS = {
  kick:  b([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
  snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
};

export const TRACK_DENSITY = { kick: 0.30, snare: 0.25, hat: 0.50, bass: 0.25, melody: 0.35 };

// ── Estilos de batería por género ────────────────────────────────────────────
// bpm: tempo sugerido · kick/snare/hat: patrón de 16 pasos
export const DRUM_STYLES = {
  // ── House
  'House — 4 en el suelo': {
    bpm: 128, desc: 'Bombo en cada pulso',
    kick:  b([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]),
    drumTypes: { kick: 'deep', snare: 'classic', hat: 'closed' },
  },
  'Tech House': {
    bpm: 132, desc: 'House con caja desplazada',
    kick:  b([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
    drumTypes: { kick: 'techno', snare: 'electronic', hat: 'closed' },
  },

  // ── Techno
  'Techno': {
    bpm: 138, desc: '4-on-floor industrial',
    kick:  b([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
    snare: b([0,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,1]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
    drumTypes: { kick: 'techno', snare: 'rim', hat: 'closed' },
  },

  // ── Hip-Hop / Rap
  'Hip-Hop — Básico': {
    bpm: 90, desc: 'Rap boom-bap clásico',
    kick:  b([1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
    drumTypes: { kick: 'vinyl', snare: 'deep', hat: 'closed' },
  },
  'Hip-Hop — Boom Bap': {
    bpm: 92, desc: 'Kick syncopado estilo East Coast',
    kick:  b([1,0,0,1, 0,0,0,0, 0,0,1,0, 0,1,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]),
    drumTypes: { kick: 'vinyl', snare: 'fat', hat: 'open' },
  },
  'Hip-Hop — Swing': {
    bpm: 88, desc: 'Patrón con swing y hi-hat abierto',
    kick:  b([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]),
    hat:   b([1,1,0,1, 1,0,1,1, 0,1,1,0, 1,0,1,1]),
    drumTypes: { kick: 'punchy', snare: 'brush', hat: 'open' },
  },

  // ── Trap
  'Trap — Básico': {
    bpm: 140, desc: 'Kick sparse, caja en 2 y 4',
    kick:  b([1,0,0,0, 0,0,0,0, 0,1,0,0, 0,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([1,1,1,0, 1,1,0,1, 1,1,1,0, 1,1,0,1]),
    drumTypes: { kick: 'k808', snare: 'clap', hat: 'closed' },
  },
  'Trap — Hi-hat 32nds': {
    bpm: 145, desc: 'Hats densísimos estilo ATL',
    kick:  b([1,0,0,0, 0,0,0,0, 0,0,0,0, 0,1,0,0]),
    snare: b([0,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0]),
    hat:   b([1,1,1,1, 0,1,1,1, 1,0,1,1, 0,1,1,1]),
    drumTypes: { kick: 'k808', snare: 'trap', hat: 'tick' },
  },

  // ── Reggaeton
  'Reggaeton — Dem Bow': {
    bpm: 96, desc: 'El patrón dem bow clásico',
    kick:  b([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
    snare: b([0,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
    drumTypes: { kick: 'electro', snare: 'rim', hat: 'closed' },
  },
  'Reggaeton — Pesado': {
    bpm: 100, desc: 'Dem bow con bombo reforzado',
    kick:  b([1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0]),
    snare: b([0,0,0,0, 0,0,1,0, 0,0,1,0, 1,0,0,0]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
  },
  'Reggaeton — Neo': {
    bpm: 94, desc: 'Variante moderna con more hats',
    kick:  b([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0]),
    snare: b([0,0,0,0, 0,0,1,0, 0,0,1,0, 0,1,0,0]),
    hat:   b([1,1,0,1, 1,0,1,1, 0,1,1,0, 1,0,1,0]),
  },

  // ── Moombahton
  'Moombahton — Clásico': {
    bpm: 108, desc: 'Dem bow a tempo medio con house',
    kick:  b([1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]),
  },
  'Moombahton — Dirty': {
    bpm: 110, desc: 'Variante más syncopada y pesada',
    kick:  b([1,0,0,0, 0,0,1,0, 1,0,0,0, 0,1,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0]),
    hat:   b([1,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,1,0]),
  },

  // ── Drum & Bass
  'Drum & Bass — Two-Step': {
    bpm: 174, desc: 'DnB clásico dos tiempos',
    kick:  b([1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]),
  },
  'Drum & Bass — Amen': {
    bpm: 180, desc: 'Break amen break simplificado',
    kick:  b([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,1]),
    snare: b([0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,0,0]),
    hat:   b([1,0,1,1, 0,1,1,0, 1,0,1,1, 0,1,0,1]),
  },
  'Liquid DnB': {
    bpm: 170, desc: 'DnB melódico y fluido',
    kick:  b([1,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]),
    hat:   b([1,0,1,0, 1,0,1,1, 0,1,1,0, 1,0,1,0]),
  },

  // ── Breakbeat
  'Breakbeat': {
    bpm: 130, desc: 'Break irregular estilo 90s',
    kick:  b([1,0,0,0, 0,0,0,1, 0,0,1,0, 0,0,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]),
    hat:   b([1,0,1,0, 0,1,0,1, 1,0,1,0, 0,1,0,1]),
  },

  // ── Funk / Soul
  'Funk': {
    bpm: 100, desc: 'Groove funk sincopado',
    kick:  b([1,0,0,1, 0,0,1,0, 0,0,1,0, 0,1,0,0]),
    snare: b([0,0,0,0, 1,0,0,0, 0,1,0,0, 1,0,0,0]),
    hat:   b([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]),
  },

  // ── Afrobeat
  'Afrobeat': {
    bpm: 112, desc: 'Patrón afrobeat polirrítmico',
    kick:  b([1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0]),
    snare: b([0,0,1,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]),
    hat:   b([1,1,0,1, 1,0,1,1, 0,1,1,0, 1,0,1,0]),
  },

  // ── Cumbia
  'Cumbia': {
    bpm: 100, desc: 'Ritmo cumbia latinoamericana',
    kick:  b([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
    snare: b([0,0,1,0, 1,0,0,0, 0,0,1,0, 1,0,0,0]),
    hat:   b([0,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,1,0]),
  },

  // ── Samba
  'Samba': {
    bpm: 120, desc: 'Samba brasileira simplificada',
    kick:  b([1,0,0,0, 1,0,1,0, 0,0,0,0, 1,0,0,0]),
    snare: b([0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
  },

  // ── Bossa Nova
  'Bossa Nova': {
    bpm: 80, desc: 'Patrón bossa nova (clave 3-2)',
    kick:  b([1,0,0,0, 1,0,0,0, 0,0,1,0, 0,0,0,0]),
    snare: b([0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,1,0]),
    hat:   b([1,0,1,1, 0,1,0,1, 1,0,1,1, 0,1,0,1]),
  },

  // ── Salsa
  'Salsa — Clave 3-2': {
    bpm: 120, desc: 'Clave de son 3-2',
    kick:  b([1,0,0,1, 0,0,1,0, 0,0,0,0, 0,0,1,0]),
    snare: b([0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
    hat:   b([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
  },
};
