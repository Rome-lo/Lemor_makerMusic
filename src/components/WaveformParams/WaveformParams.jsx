import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useStudio } from '../../store/StudioContext';
import { SCALE_OPTS, ROOT_NOTES_GROUPED } from '../../constants/scales';
import Panel from '../ui/Panel';

const TIP = 'wave-tip';

const TIPS = {
  tSpeed:   'Velocidad de avance de la variable t. Valores mayores generan armónicos más agudos y ondas más densas. A 1x la onda se evalúa una vez por ciclo; a 4x, cuatro veces.',
  amp:      'Volumen de la melodía generada. No afecta la batería. Al 100 % la señal puede saturar si la ecuación supera ±1.',
  scale:    'Cuantiza las notas de la melodía a una escala musical. La ecuación determina qué grado de la escala se toca en cada paso del secuenciador.',
  rootNote: 'Nota fundamental de la escala. Cambia la tonalidad de toda la composición sin alterar el patrón armónico. C4 = Do central (MIDI 60).',
};

function TipIcon({ content }) {
  return (
    <span
      className="tip-icon"
      data-tooltip-id={TIP}
      data-tooltip-content={content}
      aria-label="Información"
    >
      ?
    </span>
  );
}

export default function WaveformParams() {
  const { state, dispatch } = useStudio();

  function set(key, value) {
    dispatch({ type: 'SET_PARAM', key, value });
  }

  return (
    <Panel title="Parámetros de Onda">
      <Tooltip
        id={TIP}
        place="top"
        style={{ maxWidth: 280, fontSize: '0.75rem', lineHeight: 1.45 }}
      />

      {/* Velocidad t */}
      <div className="slider-row">
        <span className="slider-label">
          Velocidad t <TipIcon content={TIPS.tSpeed} />
        </span>
        <input
          type="range" className="slider"
          min={0.1} max={5} step={0.01}
          value={state.tSpeed}
          onChange={(e) => set('tSpeed', Number(e.target.value))}
        />
        <span className="slider-val">{state.tSpeed.toFixed(2)}x</span>
      </div>

      {/* Amplitud */}
      <div className="slider-row">
        <span className="slider-label">
          Amplitud <TipIcon content={TIPS.amp} />
        </span>
        <input
          type="range" className="slider"
          min={0.01} max={1} step={0.01}
          value={state.amp}
          onChange={(e) => set('amp', Number(e.target.value))}
        />
        <span className="slider-val">{Math.round(state.amp * 100)}%</span>
      </div>

      <div className="row-2col" style={{ marginTop: '0.5rem' }}>
        {/* Escala */}
        <div className="field">
          <label className="field-label">
            Escala <TipIcon content={TIPS.scale} />
          </label>
          <select
            className="select"
            value={state.scale}
            onChange={(e) => set('scale', e.target.value)}
          >
            {SCALE_OPTS.map((o) => (
              <option key={o.v} value={o.v}>{o.l}</option>
            ))}
          </select>
        </div>

        {/* Nota raíz con optgroup por octava */}
        <div className="field">
          <label className="field-label">
            Nota raíz <TipIcon content={TIPS.rootNote} />
          </label>
          <select
            className="select"
            value={state.rootNote}
            onChange={(e) => set('rootNote', Number(e.target.value))}
          >
            {ROOT_NOTES_GROUPED.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.notes.map((n) => (
                  <option key={n.v} value={n.v}>{n.l}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </Panel>
  );
}
