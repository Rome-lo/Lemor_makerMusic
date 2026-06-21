import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useStudio } from '../../store/StudioContext';

const TIP = 'fx-tip';

const TIPS = {
  fil: 'Filtro pasa-bajos — frecuencia de corte en Hz. Por debajo de este valor las frecuencias pasan; por encima se atenúan. Valores bajos (200–800 Hz) dan sonidos oscuros y "under-water"; valores altos (8–18 kHz) abren el brillo.',
  rev: 'Reverb — simula la reflexión del sonido en un espacio físico. 0 % es señal seca; 100 % es puro reverb. Valores altos crean ambientes tipo catedral.',
  del: 'Delay — eco con retroalimentación al ritmo de corcheas. Añade profundidad y movimiento rítmico. Valores bajos dan presencia; altos crean capas.',
};

export default function EffectsSection() {
  const { state, dispatch } = useStudio();

  function set(key, value) {
    dispatch({ type: 'SET_PARAM', key, value });
  }

  const effects = [
    { key: 'fil', label: 'Filtro Hz', min: 80, max: 18000, step: 10,  fmt: (v) => `${Math.round(v)} Hz` },
    { key: 'rev', label: 'Reverb',    min: 0,  max: 1,     step: 0.01, fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'del', label: 'Delay',     min: 0,  max: 1,     step: 0.01, fmt: (v) => `${Math.round(v * 100)}%` },
  ];

  return (
    <div className="fx-section">
      <Tooltip
        id={TIP}
        place="top"
        style={{ maxWidth: 280, fontSize: '0.75rem', lineHeight: 1.45 }}
      />
      <p className="section-label">Efectos</p>
      {effects.map((e) => (
        <div key={e.key} className="slider-row">
          <span
            className="slider-label tip-hover"
            data-tooltip-id={TIP}
            data-tooltip-content={TIPS[e.key]}
          >
            {e.label}
          </span>
          <input
            type="range"
            className="slider"
            min={e.min}
            max={e.max}
            step={e.step}
            value={state[e.key]}
            onChange={(ev) => set(e.key, Number(ev.target.value))}
          />
          <span className="slider-val">{e.fmt(state[e.key])}</span>
        </div>
      ))}
    </div>
  );
}
