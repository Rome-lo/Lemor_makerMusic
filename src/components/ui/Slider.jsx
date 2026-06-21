import React from 'react';

export default function Slider({ label, value, min, max, step = 0.001, onChange, fmt }) {
  const display = fmt ? fmt(value) : value.toFixed(3);
  return (
    <div className="slider-row">
      <span className="slider-label">{label}</span>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="slider-val">{display}</span>
    </div>
  );
}
