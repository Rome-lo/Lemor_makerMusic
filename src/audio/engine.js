import * as Tone from 'tone';
import { SCALES } from '../constants/scales';
import { evalEq, computePartials, stepToFreq, bassStepToFreq } from './waveform';
import { KICK_TYPES, SNARE_TYPES, HAT_TYPES } from '../constants/drums';
import { BASS_TYPES } from '../constants/bass';

class AudioEngine {
  constructor() {
    this.initialized = false;

    // ── Mutable state (written by React, read by sequence callback) ──
    this.tracks     = null;
    this.compiledEq = null;
    this.tSpeed     = 1.0;
    this.amp        = 0.60;
    this.scale      = 'minor';
    this.rootNote   = 48;
    this.onStep     = null;

    // ── Per-drum runtime props (set by buildKick/buildSnare/buildHat) ──
    this.kickNote  = 'C1';   this.kickDur  = '8n';  this.kickVol  = 0.85;
    this.snareDur  = '8n';   this.snareVol = 0.65;
    this.hatNote   = 'C6';   this.hatDur   = '32n'; this.hatVol   = 0.28;
    this.bassVol   = 0.85;

    // ── Tone.js nodes ──
    this._kick      = null;
    this._snare     = null;
    this._snareHP   = null;
    this._hat       = null;
    this._bass      = null;
    this._bassFilter = null;
    this._bassLFO   = null;
    this._melody    = null;
    this._filter    = null;
    this._reverb    = null;
    this._delay     = null;
    this._seq       = null;
    this._analyser  = null;
  }

  get analyser() { return this._analyser; }
  get filter()   { return this._filter; }
  get reverb()   { return this._reverb; }
  get delay()    { return this._delay; }
  get seq()      { return this._seq; }

  // ── Init ─────────────────────────────────────────────────────────────────
  async init() {
    if (this.initialized) return;

    await Tone.start();
    if (Tone.getContext().state !== 'running') {
      await Tone.getContext().rawContext.resume();
    }

    // Melody effects chain: melody → filter → delay → reverb → destination
    this._reverb = new Tone.Reverb({ decay: 2.5 });
    this._reverb.wet.value = 0.2;
    await Promise.race([
      this._reverb.ready,
      new Promise((r) => setTimeout(r, 3000)),
    ]);
    this._reverb.toDestination();

    this._delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.28 });
    this._delay.wet.value = 0.15;
    this._delay.connect(this._reverb);

    this._filter = new Tone.Filter(2000, 'lowpass');
    this._filter.connect(this._delay);

    this._analyser = new Tone.Analyser('waveform', 2048);
    this._filter.connect(this._analyser);

    // Build drums with defaults
    this.buildKick('classic');
    this.buildSnare('classic');
    this.buildHat('closed');
    this.buildBass('sub');

    // Build melody + sequence
    this.buildMelody('basic', { atk: 0.01, dec: 0.20, sus: 0.5, rel: 0.30 });
    this.buildSequence();
    this.initialized = true;
  }

  // ── Drum builders ─────────────────────────────────────────────────────────
  buildKick(type) {
    if (this._kick) {
      try { this._kick.disconnect(); this._kick.dispose(); } catch (_) {}
    }
    const cfg = KICK_TYPES[type] || KICK_TYPES.classic;
    this.kickNote = cfg.note;
    this.kickDur  = cfg.dur;
    this.kickVol  = cfg.vol;
    this._kick = new Tone.MembraneSynth({
      pitchDecay: cfg.pitchDecay,
      octaves:    cfg.octaves,
      envelope:   cfg.envelope,
    }).toDestination();
  }

  buildSnare(type) {
    if (this._snare)   { try { this._snare.disconnect();   this._snare.dispose();   } catch (_) {} }
    if (this._snareHP) { try { this._snareHP.disconnect(); this._snareHP.dispose(); } catch (_) {} }
    const cfg = SNARE_TYPES[type] || SNARE_TYPES.classic;
    this.snareDur  = cfg.dur;
    this.snareVol  = cfg.vol;
    this._snareHP  = new Tone.Filter(cfg.hpFreq, 'highpass').toDestination();
    this._snare    = new Tone.NoiseSynth({
      noise:    { type: cfg.noiseType },
      envelope: cfg.envelope,
    }).connect(this._snareHP);
  }

  buildHat(type) {
    if (this._hat) {
      try { this._hat.disconnect(); this._hat.dispose(); } catch (_) {}
    }
    const cfg = HAT_TYPES[type] || HAT_TYPES.closed;
    this.hatNote = cfg.note;
    this.hatDur  = cfg.dur;
    this.hatVol  = cfg.vol;
    this._hat = new Tone.MetalSynth({
      frequency:       cfg.frequency,
      harmonicity:     cfg.harmonicity,
      modulationIndex: cfg.modulationIndex,
      resonance:       cfg.resonance,
      octaves:         cfg.octaves,
      envelope:        cfg.envelope,
    }).toDestination();
  }

  // ── Bass synth factory ───────────────────────────────────────────────────
  buildBass(type) {
    if (this._bassLFO) {
      try { this._bassLFO.stop(); this._bassLFO.dispose(); } catch (_) {}
      this._bassLFO = null;
    }
    if (this._bassFilter) {
      try { this._bassFilter.disconnect(); this._bassFilter.dispose(); } catch (_) {}
    }
    if (this._bass) {
      try { this._bass.disconnect(); this._bass.dispose(); } catch (_) {}
    }

    const cfg = BASS_TYPES[type] || BASS_TYPES.sub;
    this.bassVol = cfg.vol ?? 0.80;

    this._bassFilter = new Tone.Filter(cfg.filterFreq ?? 400, 'lowpass');
    this._bassFilter.toDestination();

    if (cfg.wobble) {
      this._bassLFO = new Tone.LFO({ frequency: '4n', min: 80, max: 900 });
      this._bassLFO.connect(this._bassFilter.frequency);
      this._bassLFO.start();
    }

    if (cfg.oscType === 'pluck') {
      this._bass = new Tone.PluckSynth({ attackNoise: 1, dampening: 3000, resonance: 0.95 });
    } else {
      const oscCfg = cfg.oscType === 'fatsawtooth'
        ? { type: 'fatsawtooth', count: 2, spread: 20 }
        : { type: cfg.oscType };
      this._bass = new Tone.Synth({ oscillator: oscCfg, envelope: cfg.envelope });
    }
    this._bass.connect(this._bassFilter);
  }

  // ── Melody synth factory ──────────────────────────────────────────────────
  buildMelody(type, adsr) {
    if (this._melody) {
      try { this._melody.disconnect(); this._melody.dispose(); } catch (_) {}
    }

    const env = {
      attack:  adsr.atk,
      decay:   adsr.dec,
      sustain: adsr.sus,
      release: adsr.rel,
    };

    switch (type) {
      case 'fm':
        this._melody = new Tone.FMSynth({
          harmonicity: 3, modulationIndex: 10, envelope: env,
          modulationEnvelope: { attack: env.attack, decay: env.decay, sustain: env.sustain, release: env.release },
        });
        break;
      case 'am':
        this._melody = new Tone.AMSynth({ harmonicity: 2, envelope: env });
        break;
      case 'duo':
        this._melody = new Tone.DuoSynth({
          harmonicity: 1.5, vibratoAmount: 0.05, vibratoRate: 4,
          voice0: { oscillator: { type: 'sawtooth' }, envelope: env },
          voice1: { oscillator: { type: 'sine' },     envelope: env },
        });
        break;
      case 'pluck':
        this._melody = new Tone.PluckSynth({ attackNoise: 1, dampening: 4000, resonance: 0.97 });
        break;
      case 'saw':
        this._melody = new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: env });
        break;
      case 'square':
        this._melody = new Tone.Synth({ oscillator: { type: 'square' }, envelope: env });
        break;
      case 'triangle':
        this._melody = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: env });
        break;
      case 'fatsaw':
        this._melody = new Tone.Synth({ oscillator: { type: 'fatsawtooth', count: 3, spread: 30 }, envelope: env });
        break;
      default:
        this._melody = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: env });
    }

    if (this._filter) this._melody.connect(this._filter);
  }

  // ── Sequence ──────────────────────────────────────────────────────────────
  buildSequence() {
    if (this._seq) {
      try { this._seq.stop(); this._seq.dispose(); } catch (_) {}
    }

    this._seq = new Tone.Sequence(
      (time, idx) => {
        const tr = this.tracks;
        if (!tr) return;

        if (!tr.kick.muted && tr.kick.steps[idx])
          this._kick.triggerAttackRelease(this.kickNote, this.kickDur, time, tr.kick.vol * this.kickVol);

        if (!tr.snare.muted && tr.snare.steps[idx])
          this._snare.triggerAttackRelease(this.snareDur, time, tr.snare.vol * this.snareVol);

        if (!tr.hat.muted && tr.hat.steps[idx])
          this._hat.triggerAttackRelease(this.hatNote, this.hatDur, time, tr.hat.vol * this.hatVol);

        if (!tr.bass?.muted && tr.bass?.steps[idx]) {
          try {
            const scale = SCALES[this.scale] || SCALES.minor;
            const freq  = bassStepToFreq(idx, this.compiledEq, this.tSpeed, scale, this.rootNote, Tone.Frequency);
            this._bass.triggerAttackRelease(freq, '8n', time, tr.bass.vol * this.bassVol);
          } catch (_) {}
        }

        if (!tr.melody.muted && tr.melody.steps[idx]) {
          try {
            const scale = SCALES[this.scale] || SCALES.minor;
            const freq  = stepToFreq(idx, this.compiledEq, this.tSpeed, scale, this.rootNote, Tone.Frequency);
            this._melody.triggerAttackRelease(freq, '8n', time, tr.melody.vol * this.amp);
          } catch (_) {}
        }

        if (this.onStep) this.onStep(idx);
      },
      [...Array(16).keys()],
      '16n',
    );
  }

  // ── Live param updates ────────────────────────────────────────────────────
  updateEnvelope(adsr) {
    if (!this._melody) return;
    const env = { attack: adsr.atk, decay: adsr.dec, sustain: adsr.sus, release: adsr.rel };
    this._melody.envelope?.set(env);
    this._melody.voice0?.envelope?.set(env);
    this._melody.voice1?.envelope?.set(env);
  }

  applyWave() {
    if (!this.compiledEq || !this._melody) return false;
    const osc = this._melody.oscillator ?? this._melody.voice0?.oscillator;
    if (!osc) return false;
    const partials = computePartials(this.compiledEq, this.tSpeed);
    osc.type     = 'custom';
    osc.partials = partials;
    return true;
  }
}

export const engine = new AudioEngine();
