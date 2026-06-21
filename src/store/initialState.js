import { EQ_LIB } from '../constants/equations';
import { DEFAULT_TRACKS } from '../constants/tracks';
import { PRESETS } from '../constants/presets';

const base = PRESETS.synth;

const initialState = {
  // ── Equation ──
  equation:  EQ_LIB[0],
  eqError:   null,

  // ── Waveform params ──
  tSpeed:    1.0,
  amp:       0.60,

  // ── Scale / pitch ──
  scale:     'minor',
  rootNote:  48,

  // ── Synth ──
  synthType: 'basic',
  preset:    'synth',

  // ── ADSR ──
  adsr: {
    atk: base.atk,
    dec: base.dec,
    sus: base.sus,
    rel: base.rel,
  },

  // ── Effects ──
  fil: base.fil,
  rev: base.rev,
  del: base.del,

  // ── Transport ──
  bpm:     120,
  playing: false,

  // ── Sequencer tracks ──
  tracks: DEFAULT_TRACKS,

  // ── Drum / instrument types ──
  drumTypes: { kick: 'classic', snare: 'classic', hat: 'closed', bass: 'sub' },

  // ── UI state ──
  loading: false,
  status:  '',
};

export default initialState;
