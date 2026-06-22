import React, { useRef } from 'react';
import { useStudio } from '../../store/StudioContext';
import Panel from '../ui/Panel';
import WaveCanvas from './WaveCanvas';
import FunctionChips from './FunctionChips';
import EqLibSelect from './EqLibSelect';

export default function EquationPanel() {
  const { state, dispatch, handleEqChange } = useStudio();
  const inputRef = useRef(null);

  function insertChip(chip) {
    const el  = inputRef.current;
    if (!el) return;
    const s   = el.selectionStart ?? el.value.length;
    const e   = el.selectionEnd   ?? el.value.length;
    const ins = ['sin','cos','tan','sinh','cosh','tanh','abs','sqrt','floor','ceil','round',
                 'sign','log','log2','exp','pow','mod'].includes(chip)
      ? `${chip}(`
      : chip;
    const next = el.value.slice(0, s) + ins + el.value.slice(e);
    handleEqChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = s + ins.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <Panel title="f(t) — Ecuación de Onda" className="eq-panel">
      <div className="eq-row">
        <span className="eq-prefix">f(t) =</span>
        <input
          ref={inputRef}
          className={`eq-input${state.eqError ? ' error' : ''}`}
          value={state.equation}
          onChange={(e) => handleEqChange(e.target.value)}
          spellCheck={false}
          placeholder="sin(t)"
        />
        <EqLibSelect onSelect={handleEqChange} />
      </div>

      {state.eqError && (
        <p className="eq-error">{state.eqError}</p>
      )}

      <FunctionChips onInsert={insertChip} />
      <WaveCanvas />
    </Panel>
  );
}
