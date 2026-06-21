import React from 'react';

/**
 * Renders a row of pill buttons.
 * @param {Array<{v, l}>} options - value / label pairs
 * @param {string}        value   - currently selected value
 * @param {function}      onChange
 */
export default function PillGroup({ options, value, onChange }) {
  return (
    <div className="pill-group">
      {options.map((o) => (
        <button
          key={o.v}
          className={`pill${value === o.v ? ' active' : ''}`}
          onClick={() => onChange(o.v)}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
