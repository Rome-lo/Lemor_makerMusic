import React from 'react';
import { CHIPS } from '../../constants/equations';

export default function FunctionChips({ onInsert }) {
  return (
    <div className="chips">
      {CHIPS.map((c) => (
        <button key={c} className="chip" onClick={() => onInsert(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
