import React, { memo } from 'react';
import { Tooltip } from 'react-tooltip';
import { useStudio } from '../../store/StudioContext';
import { kickOpts, snareOpts, hatOpts } from '../../constants/drums';
import { bassOpts } from '../../constants/bass';

const DRUM_OPTS = { kick: kickOpts, snare: snareOpts, hat: hatOpts, bass: bassOpts };
const TIP = 'drum-type-tip';

const TrackRow = memo(function TrackRow({ trackKey, label, cls }) {
  const { state, dispatch } = useStudio();
  const track    = state.tracks[trackKey];
  const typeOpts = DRUM_OPTS[trackKey];         // undefined for melody
  const drumType = state.drumTypes?.[trackKey]; // undefined for melody

  const selectedOpt = typeOpts?.find((o) => o.v === drumType);

  return (
    <div className={`track-row track-row--${cls}`}>
      <Tooltip
        id={TIP}
        place="top"
        style={{ maxWidth: 240, fontSize: '0.72rem', lineHeight: 1.4 }}
      />

      <div className="track-info">
        {/* Mute */}
        <button
          className={`mute-btn${track.muted ? ' muted' : ''}`}
          title={track.muted ? 'Activar' : 'Silenciar'}
          onClick={() => dispatch({ type: 'TOGGLE_MUTE', track: trackKey })}
        >
          {track.muted ? 'M' : '●'}
        </button>

        {/* Label + type selector */}
        <div className="track-meta">
          <span className="track-label">{label}</span>

          {typeOpts && (
            <select
              className={`drum-type-select drum-type-select--${cls}`}
              value={drumType}
              data-tooltip-id={TIP}
              data-tooltip-content={selectedOpt?.desc ?? ''}
              onChange={(e) =>
                dispatch({ type: 'SET_DRUM_TYPE', track: trackKey, value: e.target.value })
              }
            >
              {typeOpts.map((o) => (
                <option key={o.v} value={o.v}>{o.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Volume */}
        <input
          type="range"
          className="track-vol"
          min={0}
          max={1}
          step={0.01}
          value={track.vol}
          onChange={(e) =>
            dispatch({ type: 'SET_TRACK_VOL', track: trackKey, vol: Number(e.target.value) })
          }
          title={`Volumen ${label}`}
        />
      </div>

      {/* Steps */}
      <div className="steps">
        {track.steps.map((on, idx) => (
          <button
            key={idx}
            data-idx={idx}
            className={`step-btn step-btn--${cls}${on ? ' active' : ''}${idx % 4 === 0 ? ' beat' : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_STEP', track: trackKey, idx })}
            aria-pressed={on}
          />
        ))}
      </div>
    </div>
  );
});

export default TrackRow;
