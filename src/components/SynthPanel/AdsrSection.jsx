import React from 'react';
import { Tooltip } from 'react-tooltip';
import { useStudio } from '../../store/StudioContext';

const TIP = 'adsr-tip';

const TIPS = {
  atk: 'Attack — tiempo que tarda la nota en alcanzar su volumen máximo desde el silencio. Valores cortos dan ataques percusivos; valores largos crean un fade-in suave.',
  dec: 'Decay — tiempo de caída desde el pico hasta el nivel de sustain. Controla cuán rápido "asienta" el sonido tras el ataque.',
  sus: 'Sustain — nivel de volumen que se mantiene mientras la nota está activa. 100 % conserva el volumen pico; 0 % da sonidos percusivos que desaparecen.',
  rel: 'Release — tiempo de apagado después de que la nota se suelta. Valores largos dan colas de reverb natural; valores cortos cortan el sonido limpio.',
};

export default function AdsrSection() {
  const { state, dispatch } = useStudio();
  const { adsr } = state;

  function setAdsr(key, value) {
    dispatch({ type: 'SET_ADSR', key, value });
  }

  const params = [
    { key: 'atk', label: 'Attack',  min: 0.001, max: 2,   fmt: (v) => `${v.toFixed(3)}s` },
    { key: 'dec', label: 'Decay',   min: 0.001, max: 2,   fmt: (v) => `${v.toFixed(3)}s` },
    { key: 'sus', label: 'Sustain', min: 0,     max: 1,   fmt: (v) => `${Math.round(v * 100)}%` },
    { key: 'rel', label: 'Release', min: 0.001, max: 4,   fmt: (v) => `${v.toFixed(3)}s` },
  ];

  return (
    <div className="adsr-section">
      <Tooltip
        id={TIP}
        place="top"
        style={{ maxWidth: 280, fontSize: '0.75rem', lineHeight: 1.45 }}
      />
      <p className="section-label">ADSR</p>
      {params.map((p) => (
        <div key={p.key} className="slider-row">
          <span
            className="slider-label tip-hover"
            data-tooltip-id={TIP}
            data-tooltip-content={TIPS[p.key]}
          >
            {p.label}
          </span>
          <input
            type="range"
            className="slider"
            min={p.min}
            max={p.max}
            step={0.001}
            value={adsr[p.key]}
            onChange={(e) => setAdsr(p.key, Number(e.target.value))}
          />
          <span className="slider-val">{p.fmt(adsr[p.key])}</span>
        </div>
      ))}
    </div>
  );
}
