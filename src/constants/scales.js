export const SCALES = {
  // ── Modos de la escala mayor (griegos) ──────────────────────────────────
  major:       [0, 2, 4, 5, 7, 9, 11],   // Jónico
  dorian:      [0, 2, 3, 5, 7, 9, 10],
  phrygian:    [0, 1, 3, 5, 7, 8, 10],
  lydian:      [0, 2, 4, 6, 7, 9, 11],
  mixolydian:  [0, 2, 4, 5, 7, 9, 10],
  minor:       [0, 2, 3, 5, 7, 8, 10],   // Eólico / menor natural
  locrian:     [0, 1, 3, 5, 6, 8, 10],

  // ── Escala menor variantes ───────────────────────────────────────────────
  harmMinor:   [0, 2, 3, 5, 7, 8, 11],   // menor armónica
  harmMajor:   [0, 2, 4, 5, 7, 8, 11],   // mayor armónica
  melMinor:    [0, 2, 3, 5, 7, 9, 11],   // menor melódica

  // ── Pentatónicas ─────────────────────────────────────────────────────────
  penta:       [0, 2, 4, 7, 9],           // pentatónica mayor
  pentaMin:    [0, 3, 5, 7, 10],          // pentatónica menor
  japanese:    [0, 2, 5, 7, 9],           // yo (japonesa)
  hirajoshi:   [0, 2, 3, 7, 8],           // hirajoshi

  // ── Blues ────────────────────────────────────────────────────────────────
  blues:       [0, 3, 5, 6, 7, 10],
  bluesMaj:    [0, 2, 3, 4, 7, 9],        // blues mayor

  // ── Simétricas ───────────────────────────────────────────────────────────
  wholeTone:   [0, 2, 4, 6, 8, 10],
  diminished:  [0, 2, 3, 5, 6, 8, 9, 11], // octatónica (tono-semitono)
  dimH:        [0, 1, 3, 4, 6, 7, 9, 10], // octatónica (semitono-tono)
  augmented:   [0, 3, 4, 7, 8, 11],
  chromatic:   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

  // ── Mundo / étnicas ──────────────────────────────────────────────────────
  arabic:      [0, 1, 4, 5, 7, 8, 11],    // doblemente armónica árabe
  persian:     [0, 1, 4, 5, 6, 8, 11],
  hungarian:   [0, 2, 3, 6, 7, 8, 11],    // menor húngara / gitana
  flamenco:    [0, 1, 4, 5, 7, 8, 10],    // frígio dominante
  neapMinor:   [0, 1, 3, 5, 7, 8, 11],    // napolitana menor
  enigmatic:   [0, 1, 4, 6, 8, 10, 11],
  byzantine:   [0, 1, 4, 5, 7, 8, 11],    // igual que árabe pero orientado diferente
  romanian:    [0, 2, 3, 6, 7, 9, 10],    // menor rumana
  ukranian:    [0, 2, 3, 6, 7, 9, 10],    // dorian #4

  // ── Modos adicionales ────────────────────────────────────────────────────
  phrygDom:    [0, 1, 4, 5, 7, 8, 10],    // frígio dominante (igual flamenco)
  lydianDom:   [0, 2, 4, 6, 7, 9, 10],    // lidio dominante (lidio b7)
  superLocrian:[0, 1, 3, 4, 6, 8, 10],    // alterada / super-locria
  dorianb2:    [0, 1, 3, 5, 7, 9, 10],    // dorian b2
};

export const SCALE_OPTS = [
  // Modos griegos
  { v: 'major',        l: 'Mayor (Jónico)'         },
  { v: 'dorian',       l: 'Dórico'                  },
  { v: 'phrygian',     l: 'Frigio'                  },
  { v: 'lydian',       l: 'Lidio'                   },
  { v: 'mixolydian',   l: 'Mixolidio'               },
  { v: 'minor',        l: 'Menor Natural (Eólico)'  },
  { v: 'locrian',      l: 'Locrio'                  },
  // Menor variantes
  { v: 'harmMinor',    l: 'Menor Armónica'          },
  { v: 'harmMajor',    l: 'Mayor Armónica'          },
  { v: 'melMinor',     l: 'Menor Melódica'          },
  // Pentatónicas
  { v: 'penta',        l: 'Pentatónica Mayor'       },
  { v: 'pentaMin',     l: 'Pentatónica Menor'       },
  { v: 'japanese',     l: 'Japonesa (Yo)'           },
  { v: 'hirajoshi',    l: 'Hirajoshi'               },
  // Blues
  { v: 'blues',        l: 'Blues Menor'             },
  { v: 'bluesMaj',     l: 'Blues Mayor'             },
  // Simétricas
  { v: 'wholeTone',    l: 'Tonos Enteros'           },
  { v: 'diminished',   l: 'Disminuida (T-S)'        },
  { v: 'dimH',         l: 'Disminuida (S-T)'        },
  { v: 'augmented',    l: 'Aumentada'               },
  { v: 'chromatic',    l: 'Cromática'               },
  // Mundo / étnicas
  { v: 'arabic',       l: 'Árabe'                   },
  { v: 'persian',      l: 'Persa'                   },
  { v: 'hungarian',    l: 'Húngara (Gitana)'        },
  { v: 'flamenco',     l: 'Flamenco / Frigio Dom.'  },
  { v: 'neapMinor',    l: 'Napolitana Menor'        },
  { v: 'byzantine',    l: 'Bizantina'               },
  { v: 'romanian',     l: 'Rumana'                  },
  { v: 'enigmatic',    l: 'Enigmática'              },
  // Modos adicionales
  { v: 'lydianDom',    l: 'Lidio Dominante'         },
  { v: 'superLocrian', l: 'Super-Locria (Alterada)' },
  { v: 'dorianb2',     l: 'Dórico b2'              },
];

// ── Notas raíz: C1 a B5 (MIDI 24 – 83) agrupadas por octava ──────────────
function notesInOctave(octave) {
  const base = 12 + octave * 12; // C1 = MIDI 24
  return [
    { v: base + 0,  l: `C${octave}`  },
    { v: base + 1,  l: `C#${octave}` },
    { v: base + 2,  l: `D${octave}`  },
    { v: base + 3,  l: `D#${octave}` },
    { v: base + 4,  l: `E${octave}`  },
    { v: base + 5,  l: `F${octave}`  },
    { v: base + 6,  l: `F#${octave}` },
    { v: base + 7,  l: `G${octave}`  },
    { v: base + 8,  l: `G#${octave}` },
    { v: base + 9,  l: `A${octave}`  },
    { v: base + 10, l: `A#${octave}` },
    { v: base + 11, l: `B${octave}`  },
  ];
}

export const ROOT_NOTES_GROUPED = [1, 2, 3, 4, 5].map((oct) => ({
  label: `Octava ${oct}`,
  notes: notesInOctave(oct),
}));

// Flat list for simple selects / presets
export const ROOT_NOTES = ROOT_NOTES_GROUPED.flatMap((g) => g.notes);
