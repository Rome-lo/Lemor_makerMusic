import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useStudio } from '../../store/StudioContext';
import { SYNTH_TYPE_OPTS, PRESET_OPTS } from '../../constants/presets';
import Panel from '../ui/Panel';
import AdsrSection from './AdsrSection';
import EffectsSection from './EffectsSection';

const TIP = 'synth-tip';

// Group preset opts by the 'g' field
const PRESET_GROUPS = PRESET_OPTS.reduce((acc, o) => {
  (acc[o.g] = acc[o.g] || []).push(o);
  return acc;
}, {});

export default function SynthPanel() {
  const { state, dispatch, changeSynthType, applyWave } = useStudio();

  const currentType = SYNTH_TYPE_OPTS.find((o) => o.v === state.synthType);

  return (
    <Panel title="Sintetizador">
      <Tooltip
        id={TIP}
        place="top"
        style={{ maxWidth: 260, fontSize: '0.75rem', lineHeight: 1.45 }}
      />

      {/* Preset */}
      <div className="field" style={{ marginBottom: '0.75rem' }}>
        <label className="field-label">Preset de instrumento</label>
        <select
          className="select"
          value={state.preset}
          onChange={(e) => dispatch({ type: 'SET_PRESET', payload: e.target.value })}
        >
          {Object.entries(PRESET_GROUPS).map(([group, opts]) => (
            <optgroup key={group} label={`── ${group}`}>
              {opts.map((o) => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Synth type */}
      <div className="field" style={{ marginBottom: '0.5rem' }}>
        <label className="field-label">
          Tipo de oscilador
          {currentType && (
            <span
              className="tip-icon"
              data-tooltip-id={TIP}
              data-tooltip-content={currentType.desc}
            >
              ?
            </span>
          )}
        </label>
        <div className="synth-type-grid">
          {SYNTH_TYPE_OPTS.map((o) => (
            <button
              key={o.v}
              className={`synth-btn${state.synthType === o.v ? ' active' : ''}`}
              data-tooltip-id={TIP}
              data-tooltip-content={o.desc}
              onClick={() => changeSynthType(o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {state.synthType === 'custom' && (
        <button className="btn-secondary" onClick={applyWave} style={{ marginBottom: '0.5rem' }}>
          Aplicar ecuación como waveform
        </button>
      )}

      <AdsrSection />
      <EffectsSection />
    </Panel>
  );
}
