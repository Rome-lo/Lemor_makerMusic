# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with HMR at localhost:5173
npm run build    # Production build → dist/
npm run preview  # Serve dist/ at localhost:4173
npm start        # build + preview (production check)
```

No linter or test suite is configured.

## What this app does

**Lemor makerMusic / Math Synth Studio** — a browser-based synthesizer where mathematical equations drive musical note pitch. The user types an equation `f(t)` and a 16-step sequencer maps each active step's t-value to a frequency on a musical scale.

## Architecture

### State — `src/store/`

Single `useReducer` store wrapped in `StudioContext`. All components consume it via `useStudio()`. No external state library.

- `initialState.js` — canonical shape of state (equation, tSpeed, amp, scale, rootNote, synthType, adsr, fil/rev/del, bpm, tracks, drumTypes)
- `reducer.js` — all actions: `SET_EQ`, `SET_PRESET`, `SET_PARAM`, `SET_ADSR`, `TOGGLE_STEP`, `SET_TRACK_VOL`, `TOGGLE_MUTE`, `FILL_PATTERN`, `APPLY_DRUM_STYLE`, `SET_DRUM_TYPE`, `IMPORT_PRESET`, `RESET_TRACKS`
- `StudioContext.jsx` — the provider. Holds several refs that live outside React render cycles: `compiledRef` (mathjs compiled equation), `playingRef`, `stepRef`, `stepTimeRef`, `canvasRef`. Syncs engine mutable properties via `useEffect`. Exposes actions: `handleEqChange`, `changeSynthType`, `applyWave`, `play`, `pause`, `stop`, `doExportWAV`, `doExportJSON`, `doImportJSON`.

### Audio Engine — `src/audio/engine.js`

A singleton class (`export const engine`) that lives **outside React**. React never re-renders it; instead `StudioContext` writes to its mutable properties directly:

```
engine.tracks      // current track step state
engine.compiledEq  // mathjs compiled equation
engine.tSpeed / amp / scale / rootNote
```

Signal chains:
- **Melody**: `_melody` → `_filter` → `_delay` → `_reverb` → destination; `_filter` → `_analyser` (passive tap)
- **Bass**: `_bass` → `_bassFilter` (LP, optional `_bassLFO` for wobble type) → destination
- **Drums**: `_kick`, `_snare`+`_snareHP`, `_hat` → destination (each direct, no effects)

`buildSequence()` creates a `Tone.Sequence` at `'16n'` intervals. The callback reads all values from `this.*` (mutable bag) to avoid stale closures. Rebuilding a drum/bass synth (`buildKick()`, `buildBass()`, etc.) disposes the old node and creates a new one — the running sequence picks it up automatically because it reads `this._kick` by reference.

**Step → frequency mapping** (`src/audio/waveform.js`):
- `evalEq(compiled, t)` → clamped `[-1, 1]`
- `stepToFreq(idx, ...)` → equation evaluated at `t = (idx/16) * 4π * tSpeed`, mapped over 2 octaves of the scale
- `bassStepToFreq(idx, ...)` → same but mapped over 1 octave, `rootNote - 12`

### Constants — `src/constants/`

All musical data lives here as plain JS objects — never hardcoded in components:

| File | Contents |
|---|---|
| `equations.js` | `EQ_GROUPS` (19 categories, ~110 equations with labels) + flat `EQ_LIB` |
| `scales.js` | 32 scales as semitone-offset arrays; `ROOT_NOTES_GROUPED` (C1–B5) |
| `presets.js` | 30 synth presets with ADSR/filter/rev/del values; `SYNTH_TYPE_OPTS` |
| `tracks.js` | `TRACK_DEFS` (5 tracks), `DEFAULT_TRACKS`, `DRUM_STYLES` (20+ genre patterns with optional `drumTypes`) |
| `drums.js` | `KICK_TYPES`, `SNARE_TYPES`, `HAT_TYPES` (10 each, Tone.js constructor params) |
| `bass.js` | `BASS_TYPES` (8 types: sub, synth, acid, pluck, k808, reese, fingered, wobble) |

### Canvas — `src/hooks/useWaveCanvas.js`

Manages the waveform canvas in `WaveCanvas.jsx`. Has its own `canvasRef`, RAF loop (`startRAF`/`stopRAF`), and `drawCanvas`. `WaveCanvas.jsx` calls `startRAF()` / `stopRAF()` based on `state.playing`.

During playback, `drawCanvas` draws:
1. Equation curve (purple, glows based on RMS from `engine.analyser`)
2. Dashed crosshair at the current step's `(t, amplitude)` point
3. Glowing amber dot at that point with `t = X.XX` / `a = ±X.XXX` labels
4. Ghost dot that glides smoothly to the next step (interpolated via `stepTimeRef` + BPM)

`stepTimeRef` is stamped in `engine.onStep` (called from the Tone.js sequence callback on each step).

### WAV Export — `src/audio/export.js`

Uses `Tone.Offline` to render the full composition offline. Rebuilds the entire signal chain (drums, bass, melody, effects) inside the offline context using the same config values from `state`. Outputs stereo→mono mix as PCM-16 RIFF WAV via `src/audio/wav.js`.

## Key non-obvious constraints

**`optimizeDeps: { exclude: ['tone'] }`** in `vite.config.js` is required — Tone.js uses Worker URLs that Vite's pre-bundler breaks. Do not remove it.

**The StudioContext `canvasRef` / `drawCanvas` / `startRAF` / `stopRAF`** defined in `StudioContext.jsx` are dead code — they reference a `canvasRef` that is never attached to a DOM element. The real canvas drawing happens entirely in `useWaveCanvas.js`. Do not try to use the context versions for canvas work.

**Drum type rebuilds during playback** work because `buildKick()` / `buildSnare()` / `buildHat()` / `buildBass()` dispose the old Tone node and create a new one, and the sequence callback reads `this._kick` etc. by reference on every tick — so the new node is picked up without restarting the sequence.

**`APPLY_DRUM_STYLE`** in the reducer optionally carries a `drumTypes` field that auto-selects the musically appropriate drum kit for that genre. When adding new `DRUM_STYLES` entries, include `drumTypes: { kick, snare, hat }` for best results.

**Equation variables**: mathjs expressions receive `{ t, pi, E }`. The equation is compiled once (`math.compile()`) and the compiled object is stored in `compiledRef` and synced to `engine.compiledEq`. Never store the raw string in the engine — always the compiled form.
