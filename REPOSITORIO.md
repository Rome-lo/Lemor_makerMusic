# Lemor MakerMusic — Math Synth Studio

Aplicación web de producción musical que combina síntesis de sonido con ecuaciones matemáticas y un secuenciador de pasos. El usuario escribe una función `f(t)` que controla simultáneamente la forma de onda del oscilador y el mapeo de notas del secuenciador.

---

## Stack tecnológico

| Herramienta | Versión | Rol |
|---|---|---|
| React | ^18.3 | UI y gestión de estado |
| Tone.js | ^14.7 | Motor de audio (síntesis, efectos, secuenciador) |
| math.js | ^11.11 | Compilación y evaluación de ecuaciones |
| Vite | ^5.4 | Bundler / dev server |
| react-tooltip | ^5.26 | Tooltips de osciladores |

---

## Estructura de archivos

```
src/
├── App.jsx                        # Raíz de la UI: ensambla todos los paneles
├── index.jsx                      # Entry point de React
├── styles/global.css              # Estilos globales
│
├── store/
│   ├── StudioContext.jsx          # Context + Provider: estado global y acciones
│   ├── initialState.js            # Estado inicial de la aplicación
│   └── reducer.js                 # Reducer: todas las mutaciones de estado
│
├── audio/
│   ├── engine.js                  # AudioEngine: clase singleton con Tone.js
│   ├── waveform.js                # evalEq, computePartials, stepToFreq, bassStepToFreq
│   ├── export.js                  # Renderizado offline y export WAV
│   └── wav.js                     # Encoder PCM → WAV y descarga de blob
│
├── constants/
│   ├── equations.js               # Biblioteca de 100+ ecuaciones y chips de funciones
│   ├── scales.js                  # ~30 escalas musicales y notas raíz
│   ├── presets.js                 # Presets ADSR/efectos y tipos de oscilador
│   ├── tracks.js                  # Patrones de batería, estilos por género
│   ├── drums.js                   # Tipos de bombo, caja y hi-hat
│   ├── bass.js                    # Tipos de bajo sintetizado
│   └── index.js                   # Re-exports
│
├── components/
│   ├── EquationPanel/
│   │   ├── EquationPanel.jsx      # Input f(t), biblioteca de ecuaciones
│   │   ├── FunctionChips.jsx      # Botones de funciones matemáticas (sin, cos, etc.)
│   │   └── WaveCanvas.jsx         # Canvas con visualizador de onda en tiempo real
│   ├── WaveformParams/
│   │   └── WaveformParams.jsx     # Sliders de velocidad temporal (tSpeed) y amplitud
│   ├── SynthPanel/
│   │   ├── SynthPanel.jsx         # Selector de preset e instrumento
│   │   ├── AdsrSection.jsx        # Envolvente Attack / Decay / Sustain / Release
│   │   └── EffectsSection.jsx     # Filter (Hz), Reverb y Delay
│   ├── Sequencer/
│   │   ├── Sequencer.jsx          # Contenedor del secuenciador de 16 pasos
│   │   ├── TrackRow.jsx           # Fila de pistas: pasos + volumen + mute + tipo
│   │   └── FillButtons.jsx        # Botones de fill y estilos de batería por género
│   ├── Transport/
│   │   └── Transport.jsx          # Controles Play / Pause / Stop + BPM + escala + nota raíz
│   ├── ExportPanel/
│   │   └── ExportPanel.jsx        # Export WAV (4/8/16/32 s) + Export/Import JSON
│   └── ui/
│       ├── Panel.jsx              # Contenedor de sección con título
│       ├── PillGroup.jsx          # Grupo de botones tipo píldora
│       └── Slider.jsx             # Slider con label y valor
│
└── hooks/
    └── useWaveCanvas.js           # (hook auxiliar para canvas)
```

---

## Flujo de datos

```
Usuario escribe f(t)
       │
       ▼
handleEqChange()  →  math.compile(eq)  →  compiledRef  →  engine.compiledEq
       │
       ▼
drawCanvas() / RAF  →  evalEq(compiled, t)  →  Canvas 2D
       │
       ▼
Tone.Sequence [0..15]  →  stepToFreq(idx, compiled, …)  →  triggerAttackRelease()
```

El contexto global (`StudioContext`) mantiene tanto el estado de React (via `useReducer`) como referencias mutables (`useRef`) compartidas con el motor de audio, evitando re-renders innecesarios durante la reproducción.

---

## Motor de audio (`AudioEngine`)

Clase singleton en `src/audio/engine.js`. Se inicializa de forma lazy al primer Play.

### Cadena de señal (melodía)

```
Melody Synth → Filter (lowpass) → Delay (FeedbackDelay) → Reverb → Destination
                     │
                     └── Analyser (waveform, 2048 puntos) → Canvas overlay
```

### Batería y bajo

- **Bombo** (`MembraneSynth`) → directo a Destination
- **Caja** (`NoiseSynth`) → `Filter (highpass)` → Destination
- **Hi-hat** (`MetalSynth`) → directo a Destination
- **Bajo** (`Synth` / `PluckSynth`) → `Filter (lowpass)` → Destination (con LFO opcional para wobble)

### Métodos principales

| Método | Descripción |
|---|---|
| `init()` | Inicia el contexto de audio y construye todos los instrumentos |
| `buildMelody(type, adsr)` | Recrea el sintetizador de melodía |
| `buildKick/Snare/Hat/Bass(type)` | Recrea instrumentos de batería/bajo |
| `buildSequence()` | Crea el `Tone.Sequence` de 16 pasos |
| `updateEnvelope(adsr)` | Actualiza ADSR en caliente |
| `applyWave()` | Aplica DFT de la ecuación como forma de onda custom |

---

## Ecuaciones f(t)

La ecuación define **dos cosas al mismo tiempo**:

1. **Forma de onda** (modo `Custom Eq`): se calcula la DFT via `computePartials()` y se aplica como `PeriodicWave` al oscilador.
2. **Mapeo de notas**: en cada paso `idx` del secuenciador, `evalEq(compiled, t)` retorna un valor `[-1, 1]` que se convierte en grado de escala → nota MIDI → frecuencia Hz.

### Biblioteca incluida (100+ ecuaciones)

| Categoría | Ejemplos |
|---|---|
| Clásicas | `sin(t)`, `cos(t)`, diente de sierra, triángulo, cuadrada |
| Síntesis aditiva | `sin(t) + sin(3*t)/3 + sin(5*t)/5 + sin(7*t)/7` |
| Modulación de fase (PM) | `sin(t + sin(3*t))`, `cos(t + sin(t + cos(t)))` |
| FM | `sin(t * (1 + 0.5*sin(t/2)))` |
| AM / RM | `sin(t) * abs(sin(t/4))`, `sin(t) * sin(3*t)` |
| Saturación / clipping | `tanh(3*sin(t))`, `atan(10*sin(t)) / (pi/2)` |
| Glitch / bitcrusher | `floor(sin(t)*8)/8`, `round(sin(t)*3)/3` |
| Caótico / complejo | `sin(t * sin(t))`, `sin(t + cos(t*2)*2)` |
| Hiperbólicas | `sinh(sin(t)) / 1.18`, `tanh(sin(t/2) * 3)` |
| Latido (beating) | `sin(t)*sin(t*1.01)`, `sin(20*t)*sin(t/20)` |

---

## Escalas musicales

~30 escalas disponibles en `src/constants/scales.js`:

| Grupo | Escalas |
|---|---|
| Modos griegos | Mayor, Dórico, Frigio, Lidio, Mixolidio, Menor Natural, Locrio |
| Menor variantes | Menor armónica, Mayor armónica, Menor melódica |
| Pentatónicas | Mayor, Menor, Japonesa (Yo), Hirajoshi |
| Blues | Blues menor, Blues mayor |
| Simétricas | Tonos enteros, Disminuida (×2), Aumentada, Cromática |
| Étnicas / mundo | Árabe, Persa, Húngara, Flamenco, Napolitana, Bizantina, Rumana |
| Modos adicionales | Lidio Dominante, Super-Locria, Dórico b2 |

Notas raíz: C1 a B5 (MIDI 24–83).

---

## Tipos de oscilador (melodía)

| ID | Nombre | Descripción |
|---|---|---|
| `basic` | Sine | Sinusoidal pura |
| `triangle` | Triangle | Triangular con leves armónicos impares |
| `saw` | Sawtooth | Rica en armónicos, leads y bajos |
| `square` | Square | Armónicos impares, timbre hueco |
| `fatsaw` | Fat Saw | 3 sierras detuneadas, Super Saw EDM |
| `fm` | FM Synth | Modulación de frecuencia, timbre metálico |
| `am` | AM Synth | Modulación de amplitud, trémolo intrínseco |
| `duo` | Duo Synth | Dos osciladores detuneados, coro natural |
| `pluck` | Pluck | Karplus-Strong, cuerda pulsada |
| `custom` | Custom Eq | Forma de onda desde la ecuación f(t) via DFT |

---

## Presets de instrumento

Cada preset define valores de ADSR + filter + reverb + delay:

| Grupo | Presets disponibles |
|---|---|
| Electrónico | Sintetizador, Lead Melody, Pad Atmosférico, Super Saw, Chiptune, Órgano, Ambient, Drone |
| Bajo | Bajo Estándar, Bajo 808, Sub Bajo, Acid Bass, Wobble Bass, Reese Bass |
| Acústico | Cuerdas, Violín, Chelo, Flauta, Oboe, Clarinete, Metal, Trompeta |
| Teclado | Piano, Piano Eléctrico, Marimba, Vibráfono, Campana, Celesta |
| Percusión | Pluck |

---

## Secuenciador de 16 pasos

5 pistas independientes:

| Pista | Instrumento | Patrón default |
|---|---|---|
| `kick` | Bombo | 4-on-the-floor: pasos 1, 5, 9, 13 |
| `snare` | Caja | Pasos 5, 13 |
| `hat` | Hi-hat | Pasos 3, 7, 11, 15 |
| `bass` | Bajo | Pasos 1, 9, 13 (melodía grave desde f(t)) |
| `melody` | Melodía | Pasos 1, 5, 9, 13 (notas desde f(t)) |

Cada pista tiene: **volumen individual**, **mute**, **tipo de instrumento** (bombo, caja, etc.) y **fill** cíclico (preset → vacío → aleatorio).

### Estilos de batería por género

El botón "Estilo" permite aplicar patrones predefinidos para:

- **House**: 4 en el suelo, Tech House
- **Techno**: 4-on-floor industrial
- **Hip-Hop**: Básico, Boom Bap, Swing
- **Trap**: Básico, Hi-hat 32nds
- **Reggaeton**: Dem Bow (×3 variantes)
- **Moombahton**: Clásico, Dirty
- **Drum & Bass**: Two-Step, Amen, Liquid DnB
- **Breakbeat**
- **Funk**, **Afrobeat**, **Cumbia**, **Samba**, **Bossa Nova**, **Salsa**

---

## Tipos de bombo, caja y hi-hat

### Bombos (`MembraneSynth`)
`classic`, `k808`, `punchy`, `deep`, `techno`, `electro`, `taiko`, `tight`, `vinyl`, `gated`, `dubstep`

### Cajas (`NoiseSynth + highpass`)
`classic`, `rim`, `clap`, `snap`, `deep`, `brush`, `electronic`, `tight`, `fat`, `trap`, `halfstep`

### Hi-hats (`MetalSynth`)
`closed`, `open`, `pedal`, `crash`, `ride`, `shaker`, `tambourine`, `crotales`, `cowbell`, `tick`

### Bajos (`Synth` / `PluckSynth`)
`sub`, `synth`, `acid`, `pluck`, `k808`, `reese`, `fingered`, `wobble`

---

## Efectos y ADSR

### Envolvente (ADSR)
- **Attack**: tiempo de subida
- **Decay**: tiempo de caída al sustain
- **Sustain**: nivel sostenido (0–1)
- **Release**: tiempo de liberación

### Efectos en cadena
- **Filter**: lowpass, corte ajustable en Hz (200–18 000 Hz)
- **Delay**: `FeedbackDelay` 8n, feedback 0.28, wet 0–1
- **Reverb**: `Reverb` decay 2.5 s, wet 0–1

---

## Export

### WAV
Usa `Tone.Offline()` para renderizar el loop completo sin reproducción en tiempo real. Duraciones: 4 s, 8 s, 16 s, 32 s. El resultado se codifica como WAV 16-bit mono a 44 100 Hz y se descarga directamente.

### JSON (preset)
Exporta / importa el estado completo de la sesión:
```json
{
  "equation": "sin(t)",
  "tSpeed": 1.0,
  "amp": 0.6,
  "scale": "minor",
  "rootNote": 48,
  "synthType": "basic",
  "preset": "synth",
  "adsr": { "atk": 0.01, "dec": 0.2, "sus": 0.5, "rel": 0.3 },
  "fil": 2000,
  "rev": 0.2,
  "del": 0.15,
  "bpm": 120,
  "tracks": { ... },
  "drumTypes": { "kick": "classic", "snare": "classic", "hat": "closed", "bass": "sub" }
}
```

---

## Canvas en tiempo real

El canvas de `WaveCanvas` se actualiza frame a frame con `requestAnimationFrame` mientras hay reproducción:

- **Línea morada** (`#7F77DD`): ecuación f(t) estática
- **Línea verde** (`#1D9E75`): señal real del analizador Tone.js (2048 puntos)
- **Retícula punteada naranja** (`#EF9F27`): posición actual del paso (horizontal = tiempo, vertical = amplitud/pitch)
- **Dot grande naranja**: punto exacto donde se dispara la nota en este paso
- **Ghost dot**: posición animada que desliza hacia el siguiente paso
- **Etiquetas**: `t = x.xx` y `a = ±x.xxx` junto al dot

---

## Estado global (`initialState`)

```js
{
  equation:  'sin(t)',     // expresión f(t) actual
  eqError:   null,         // mensaje de error de compilación
  tSpeed:    1.0,          // multiplicador de velocidad temporal de la ecuación
  amp:       0.60,         // amplitud global de melodía
  scale:     'minor',      // escala musical activa
  rootNote:  48,           // nota raíz (MIDI, C4 = 60)
  synthType: 'basic',      // tipo de oscilador de melodía
  preset:    'synth',      // preset de instrumento activo
  adsr:      { atk, dec, sus, rel },
  fil:       2000,         // frecuencia de corte del filtro en Hz
  rev:       0.20,         // wet del reverb
  del:       0.15,         // wet del delay
  bpm:       120,
  playing:   false,
  tracks:    { kick, snare, hat, bass, melody },
  drumTypes: { kick: 'classic', snare: 'classic', hat: 'closed', bass: 'sub' },
  loading:   false,
  status:    '',
}
```

---

## Comandos

```bash
npm run dev       # servidor de desarrollo (Vite HMR)
npm run build     # build de producción
npm run preview   # preview del build
npm start         # build + preview (producción)
```
