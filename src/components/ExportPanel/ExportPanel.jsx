import React, { useRef } from 'react';
import { useStudio } from '../../store/StudioContext';
import Panel from '../ui/Panel';

export default function ExportPanel() {
  const { state, doExportWAV, doExportJSON, doImportJSON } = useStudio();
  const fileRef = useRef(null);

  return (
    <Panel title="Exportar" className="export-panel">
      <div className="export-row">
        <button
          className="btn-export"
          disabled={state.loading}
          onClick={() => doExportWAV(4)}
        >
          WAV 4s
        </button>
        <button
          className="btn-export"
          disabled={state.loading}
          onClick={() => doExportWAV(8)}
        >
          WAV 8s
        </button>
        <button className="btn-export btn-export--json" onClick={doExportJSON}>
          JSON
        </button>
        <button
          className="btn-export btn-export--import"
          onClick={() => fileRef.current?.click()}
        >
          Importar
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files[0]) {
              doImportJSON(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
      </div>

      {state.loading && (
        <div className="export-progress">
          <div className="spinner" />
          <span>{state.status || 'Procesando…'}</span>
        </div>
      )}
    </Panel>
  );
}
