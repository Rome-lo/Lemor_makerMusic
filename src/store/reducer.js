import { PRESETS } from '../constants/presets';
import { DEFAULT_TRACKS, FILL_PATTERNS, TRACK_DENSITY, DRUM_STYLES } from '../constants/tracks';

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_EQ':
      return { ...state, equation: action.payload, eqError: null };

    case 'SET_EQ_ERROR':
      return { ...state, eqError: action.payload };

    case 'SET_SYNTH_TYPE':
      return { ...state, synthType: action.payload };

    case 'SET_PRESET': {
      const p = PRESETS[action.payload];
      if (!p) return state;
      return {
        ...state,
        preset: action.payload,
        adsr: { atk: p.atk, dec: p.dec, sus: p.sus, rel: p.rel },
        fil: p.fil,
        rev: p.rev,
        del: p.del,
      };
    }

    case 'SET_PARAM':
      return { ...state, [action.key]: action.value };

    case 'SET_ADSR':
      return { ...state, adsr: { ...state.adsr, [action.key]: action.value } };

    case 'SET_PLAYING':
      return { ...state, playing: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_STATUS':
      return { ...state, status: action.payload };

    case 'TOGGLE_STEP': {
      const { track, idx } = action;
      const steps = [...state.tracks[track].steps];
      steps[idx] = !steps[idx];
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [track]: { ...state.tracks[track], steps },
        },
      };
    }

    case 'SET_TRACK_VOL': {
      const { track, vol } = action;
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [track]: { ...state.tracks[track], vol },
        },
      };
    }

    case 'TOGGLE_MUTE': {
      const { track } = action;
      return {
        ...state,
        tracks: {
          ...state.tracks,
          [track]: { ...state.tracks[track], muted: !state.tracks[track].muted },
        },
      };
    }

    case 'FILL_PATTERN': {
      const { track } = action;
      // Cycle: preset fill → all off → random → preset fill
      const preset = FILL_PATTERNS[track];
      const current = state.tracks[track].steps;

      let steps;
      if (preset) {
        const isPreset = current.every((v, i) => v === preset[i]);
        const isEmpty  = current.every((v) => !v);
        if (isPreset) {
          steps = Array(16).fill(false);
        } else if (isEmpty) {
          const density = TRACK_DENSITY[track] ?? 0.35;
          steps = Array.from({ length: 16 }, () => Math.random() < density);
        } else {
          steps = [...preset];
        }
      } else {
        const isEmpty = current.every((v) => !v);
        if (isEmpty) {
          const density = TRACK_DENSITY[track] ?? 0.35;
          steps = Array.from({ length: 16 }, () => Math.random() < density);
        } else {
          steps = Array(16).fill(false);
        }
      }

      return {
        ...state,
        tracks: {
          ...state.tracks,
          [track]: { ...state.tracks[track], steps },
        },
      };
    }

    case 'IMPORT_PRESET': {
      const p = action.payload;
      return {
        ...state,
        equation:  p.equation  ?? state.equation,
        tSpeed:    p.tSpeed    ?? state.tSpeed,
        amp:       p.amp       ?? state.amp,
        scale:     p.scale     ?? state.scale,
        rootNote:  p.rootNote  ?? state.rootNote,
        synthType: p.synthType ?? state.synthType,
        preset:    p.preset    ?? state.preset,
        adsr:      p.adsr      ?? state.adsr,
        fil:       p.fil       ?? state.fil,
        rev:       p.rev       ?? state.rev,
        del:       p.del       ?? state.del,
        bpm:       p.bpm       ?? state.bpm,
        tracks:    p.tracks    ?? state.tracks,
        drumTypes: { ...state.drumTypes, ...(p.drumTypes ?? {}) },
      };
    }

    case 'SET_DRUM_TYPE':
      return {
        ...state,
        drumTypes: { ...state.drumTypes, [action.track]: action.value },
      };

    case 'APPLY_DRUM_STYLE': {
      const style = DRUM_STYLES[action.payload];
      if (!style) return state;
      return {
        ...state,
        bpm: style.bpm,
        tracks: {
          ...state.tracks,
          kick:  { ...state.tracks.kick,  steps: [...style.kick]  },
          snare: { ...state.tracks.snare, steps: [...style.snare] },
          hat:   { ...state.tracks.hat,   steps: [...style.hat]   },
        },
        // Apply recommended drum types for this genre if defined
        ...(style.drumTypes && {
          drumTypes: { ...state.drumTypes, ...style.drumTypes },
        }),
      };
    }

    case 'RESET_TRACKS':
      return { ...state, tracks: DEFAULT_TRACKS };

    default:
      return state;
  }
}
