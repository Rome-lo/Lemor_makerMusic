import React from 'react';
import { useStudio } from '../../store/StudioContext';
import Panel from '../ui/Panel';

export default function Transport() {
  const { state, dispatch, play, pause, stop } = useStudio();

  const setBpm = (raw) => {
    const v = Math.max(40, Math.min(240, Number(raw)));
    if (isFinite(v)) dispatch({ type: 'SET_PARAM', key: 'bpm', value: v });
  };

  return (
    <Panel className="transport-panel">
      <div className="transport-row">

        {/* Play / Pause / Stop */}
        <div className="transport-btns">
          <button
            className={`btn-transport btn-play${state.playing ? ' active' : ''}`}
            onClick={state.playing ? pause : play}
            disabled={state.loading}
            title={state.playing ? 'Pausar' : 'Reproducir'}
          >
            {state.playing ? '⏸' : '▶'}
          </button>
          <button
            className="btn-transport btn-stop"
            onClick={stop}
            disabled={state.loading}
            title="Detener y volver al inicio"
          >
            ■
          </button>
        </div>

        {/* BPM */}
        <div className="bpm-group">
          <label className="bpm-label">BPM</label>
          <input
            type="number"
            className="bpm-input"
            min={40}
            max={240}
            value={state.bpm}
            onChange={(e) => setBpm(e.target.value)}
          />
          <input
            type="range"
            className="slider bpm-slider"
            min={40}
            max={240}
            step={1}
            value={state.bpm}
            onChange={(e) => setBpm(e.target.value)}
          />
          <span className="bpm-range">40 – 240</span>
        </div>

        {state.status && !state.loading && (
          <span className="status-msg">{state.status}</span>
        )}
      </div>
    </Panel>
  );
}
