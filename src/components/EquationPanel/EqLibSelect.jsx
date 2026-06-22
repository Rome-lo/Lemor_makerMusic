import React, { useState, useRef, useEffect } from 'react';
import * as math from 'mathjs';
import { EQ_GROUPS } from '../../constants/equations';

const PW = 72; // preview width
const PH = 22; // preview height

// Build SVG path string for an equation — cached per equation string
const pathCache = new Map();

function buildPath(eq) {
  if (pathCache.has(eq)) return pathCache.get(eq);
  let d = '';
  try {
    const compiled = math.compile(eq);
    for (let x = 0; x <= PW; x++) {
      const t = (x / PW) * 4 * Math.PI;
      let v = 0;
      try { v = +compiled.evaluate({ t, pi: Math.PI, E: Math.E }); } catch (_) {}
      if (!isFinite(v)) v = 0;
      v = Math.max(-1, Math.min(1, v));
      const y = ((1 - v) / 2) * PH;
      d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)} `;
    }
  } catch (_) {
    d = `M0,${PH / 2} L${PW},${PH / 2}`;
  }
  pathCache.set(eq, d);
  return d;
}

// Pre-warm cache during browser idle time after mount
let warmed = false;
function warmCache() {
  if (warmed) return;
  warmed = true;
  const all = EQ_GROUPS.flatMap(g => g.items.map(i => i.eq));
  let idx = 0;
  function step(deadline) {
    while (idx < all.length && (deadline.timeRemaining() > 2 || deadline.didTimeout)) {
      buildPath(all[idx++]);
    }
    if (idx < all.length) requestIdleCallback(step, { timeout: 1000 });
  }
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(step, { timeout: 500 });
  } else {
    setTimeout(() => all.forEach(buildPath), 200);
  }
}

export default function EqLibSelect({ onSelect }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Pre-warm cache on first mount
  useEffect(() => { warmCache(); }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) setOpen(false); };
    const onKey  = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pick(eq) {
    onSelect(eq);
    setOpen(false);
  }

  return (
    <div className="eqlib-wrap" ref={wrapRef}>
      <button
        className="eqlib-btn"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        Biblioteca… <span className="eqlib-arrow">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="eqlib-panel" role="listbox">
          {EQ_GROUPS.map((g) => (
            <div key={g.label} className="eqlib-group">
              <div className="eqlib-group-label">{g.label}</div>
              {g.items.map((item) => (
                <button
                  key={item.eq}
                  className="eqlib-item"
                  role="option"
                  onClick={() => pick(item.eq)}
                >
                  <svg
                    className="eqlib-preview"
                    width={PW}
                    height={PH}
                    viewBox={`0 0 ${PW} ${PH}`}
                    preserveAspectRatio="none"
                  >
                    <path d={buildPath(item.eq)} />
                  </svg>
                  <span className="eqlib-name">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
