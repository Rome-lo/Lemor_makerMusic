import React from 'react';
import Panel from '../ui/Panel';
import TrackRow from './TrackRow';
import FillButtons from './FillButtons';
import { TRACK_DEFS } from '../../constants/tracks';

export default function Sequencer() {
  return (
    <Panel title="Secuenciador — 16 pasos" className="seq-panel">
      {TRACK_DEFS.map((t) => (
        <TrackRow key={t.key} trackKey={t.key} label={t.label} cls={t.cls} />
      ))}
      <FillButtons />
    </Panel>
  );
}
