import * as Tone from 'tone';
import { SCALES } from '../constants/scales';
import { stepToFreq, bassStepToFreq } from './waveform';
import { encodeWAV, downloadBlob } from './wav';
import { KICK_TYPES, SNARE_TYPES, HAT_TYPES } from '../constants/drums';
import { BASS_TYPES } from '../constants/bass';

export async function exportLoop(duration, state, compiledEq, onStatus) {
  onStatus('Preparando render…');

  const sr    = 44100;
  const scale = SCALES[state.scale] || SCALES.minor;
  const adsr  = state.adsr;
  const dt    = state.drumTypes || { kick: 'classic', snare: 'classic', hat: 'closed', bass: 'sub' };

  const kickCfg  = KICK_TYPES[dt.kick]   || KICK_TYPES.classic;
  const snareCfg = SNARE_TYPES[dt.snare] || SNARE_TYPES.classic;
  const hatCfg   = HAT_TYPES[dt.hat]     || HAT_TYPES.closed;
  const bassCfg  = BASS_TYPES[dt.bass]   || BASS_TYPES.sub;

  const buffer = await Tone.Offline(async ({ transport }) => {
    transport.bpm.value = state.bpm;

    // ── Effects chain ──
    const reverb = new Tone.Reverb({ decay: 2.5 });
    reverb.wet.value = state.rev;
    await reverb.ready;
    reverb.toDestination();

    const delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.28 });
    delay.wet.value = state.del;
    delay.connect(reverb);

    const filter = new Tone.Filter(state.fil, 'lowpass');
    filter.connect(delay);

    // ── Drums (using selected types) ──
    const kick = new Tone.MembraneSynth({
      pitchDecay: kickCfg.pitchDecay,
      octaves:    kickCfg.octaves,
      envelope:   kickCfg.envelope,
    }).toDestination();

    const snareHP = new Tone.Filter(snareCfg.hpFreq, 'highpass').toDestination();
    const snare   = new Tone.NoiseSynth({
      noise:    { type: snareCfg.noiseType },
      envelope: snareCfg.envelope,
    }).connect(snareHP);

    const hat = new Tone.MetalSynth({
      frequency:       hatCfg.frequency,
      harmonicity:     hatCfg.harmonicity,
      modulationIndex: hatCfg.modulationIndex,
      resonance:       hatCfg.resonance,
      octaves:         hatCfg.octaves,
      envelope:        hatCfg.envelope,
    }).toDestination();

    // ── Bass ──
    const bassLPF = new Tone.Filter(bassCfg.filterFreq ?? 400, 'lowpass').toDestination();
    let bass;
    if (bassCfg.oscType === 'pluck') {
      bass = new Tone.PluckSynth({ attackNoise: 1, dampening: 3000, resonance: 0.95 }).connect(bassLPF);
    } else {
      const oscCfg = bassCfg.oscType === 'fatsawtooth'
        ? { type: 'fatsawtooth', count: 2, spread: 20 }
        : { type: bassCfg.oscType };
      bass = new Tone.Synth({ oscillator: oscCfg, envelope: bassCfg.envelope }).connect(bassLPF);
    }

    // ── Melody ──
    const env = { attack: adsr.atk, decay: adsr.dec, sustain: adsr.sus, release: adsr.rel };
    let melody;
    switch (state.synthType) {
      case 'fm':
        melody = new Tone.FMSynth({ harmonicity: 3, modulationIndex: 10, envelope: env, modulationEnvelope: { ...env } });
        break;
      case 'am':
        melody = new Tone.AMSynth({ harmonicity: 2, envelope: env });
        break;
      case 'duo':
        melody = new Tone.DuoSynth({
          harmonicity: 1.5, vibratoAmount: 0.05, vibratoRate: 4,
          voice0: { oscillator: { type: 'sawtooth' }, envelope: env },
          voice1: { oscillator: { type: 'sine' },     envelope: env },
        });
        break;
      case 'pluck':
        melody = new Tone.PluckSynth({ attackNoise: 1, dampening: 4000, resonance: 0.97 });
        break;
      case 'saw':
        melody = new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: env });
        break;
      case 'square':
        melody = new Tone.Synth({ oscillator: { type: 'square' }, envelope: env });
        break;
      case 'triangle':
        melody = new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: env });
        break;
      case 'fatsaw':
        melody = new Tone.Synth({ oscillator: { type: 'fatsawtooth', count: 3, spread: 30 }, envelope: env });
        break;
      default:
        melody = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: env });
    }
    melody.connect(filter);

    // ── Sequence ──
    const tr  = state.tracks;
    const seq = new Tone.Sequence(
      (time, idx) => {
        if (!tr.kick.muted && tr.kick.steps[idx])
          kick.triggerAttackRelease(kickCfg.note, kickCfg.dur, time, tr.kick.vol * kickCfg.vol);

        if (!tr.snare.muted && tr.snare.steps[idx])
          snare.triggerAttackRelease(snareCfg.dur, time, tr.snare.vol * snareCfg.vol);

        if (!tr.hat.muted && tr.hat.steps[idx])
          hat.triggerAttackRelease(hatCfg.note, hatCfg.dur, time, tr.hat.vol * hatCfg.vol);

        if (!tr.bass?.muted && tr.bass?.steps[idx]) {
          try {
            const freq = bassStepToFreq(idx, compiledEq, state.tSpeed, scale, state.rootNote, Tone.Frequency);
            bass.triggerAttackRelease(freq, '8n', time, tr.bass.vol * (bassCfg.vol ?? 0.80));
          } catch (_) {}
        }

        if (!tr.melody.muted && tr.melody.steps[idx]) {
          try {
            const freq = stepToFreq(idx, compiledEq, state.tSpeed, scale, state.rootNote, Tone.Frequency);
            melody.triggerAttackRelease(freq, '8n', time, tr.melody.vol * state.amp);
          } catch (_) {}
        }
      },
      [...Array(16).keys()],
      '16n',
    );

    seq.start(0);
    transport.start();
  }, duration, 1, sr);

  onStatus('Codificando WAV…');
  const L    = buffer.getChannelData(0);
  const R    = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : L;
  const mono = new Float32Array(L.length);
  for (let i = 0; i < L.length; i++) mono[i] = (L[i] + R[i]) * 0.5;

  const wav  = encodeWAV(mono, sr);
  const blob = new Blob([wav], { type: 'audio/wav' });
  downloadBlob(blob, `lemor_${duration}s.wav`);
  onStatus(`WAV exportado (${duration}s)`);
}
