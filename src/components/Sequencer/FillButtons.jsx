import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { useStudio } from '../../store/StudioContext';
import { TRACK_DEFS, DRUM_STYLES } from '../../constants/tracks';

const STYLE_KEYS = Object.keys(DRUM_STYLES);

export default function FillButtons() {
  const { state, dispatch } = useStudio();
  const [lastStyle, setLastStyle] = useState('');

  function applyStyle(key) {
    if (!key) return;
    dispatch({ type: 'APPLY_DRUM_STYLE', payload: key });
    setLastStyle(key);
  }

  const selectedInfo = lastStyle ? DRUM_STYLES[lastStyle] : null;

  return (
    <div className="fill-area">
      <Tooltip
        id="fill-tip"
        place="top"
        style={{ maxWidth: 260, fontSize: '0.75rem', lineHeight: 1.45 }}
      />

      {/* ── Género / Estilo ── */}
      <div className="style-row">
        <span
          className="fill-label"
          data-tooltip-id="fill-tip"
          data-tooltip-content="Aplica un patrón de batería completo (bombo, caja, hi-hat) y ajusta el BPM recomendado para el género. El patrón de melodía no se modifica."
        >
          Género ▸
        </span>
        <select
          className="select style-select"
          value={lastStyle}
          onChange={(e) => applyStyle(e.target.value)}
        >
          <option value="">Seleccionar estilo…</option>
          {STYLE_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}  ({DRUM_STYLES[k].bpm} BPM)
            </option>
          ))}
        </select>
        {selectedInfo && (
          <span className="style-desc">{selectedInfo.desc}</span>
        )}
      </div>

      {/* ── Fill aleatorio / reset por pista ── */}
      <div className="fill-row">
        <span className="fill-label">Fill ▸</span>
        {TRACK_DEFS.map((t) => (
          <button
            key={t.key}
            className="btn-fill"
            data-tooltip-id="fill-tip"
            data-tooltip-content={`Cicla el patrón de ${t.label}: preset → vacío → aleatorio (densidad ajustada al instrumento) → preset…`}
            onClick={() => dispatch({ type: 'FILL_PATTERN', track: t.key })}
          >
            {t.label}
          </button>
        ))}
        <button
          className="btn-fill btn-fill--reset"
          data-tooltip-id="fill-tip"
          data-tooltip-content="Restaura los cuatro tracks al patrón por defecto (house básico)"
          onClick={() => { dispatch({ type: 'RESET_TRACKS' }); setLastStyle(''); }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
