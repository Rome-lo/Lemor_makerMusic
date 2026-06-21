import React from 'react';
import { useStudio } from './store/StudioContext';
import EquationPanel from './components/EquationPanel/EquationPanel';
import WaveformParams from './components/WaveformParams/WaveformParams';
import SynthPanel from './components/SynthPanel/SynthPanel';
import Sequencer from './components/Sequencer/Sequencer';
import Transport from './components/Transport/Transport';
import ExportPanel from './components/ExportPanel/ExportPanel';

export default function App() {
  const { state } = useStudio();

  return (
    <>
      {state.loading && (
        <div className="overlay">⟳ {state.status || 'loading…'}</div>
      )}

      <h1>
        ⟨ Math Synth Studio ⟩{' '}
        {state.status && !state.loading && (
          <span className="status-tag">— {state.status}</span>
        )}
      </h1>

      <EquationPanel />
      <WaveformParams />
      <SynthPanel />
      <Sequencer />
      <Transport />
      <ExportPanel />
    </>
  );
}
