import { useEffect, useRef, useState } from 'react';
import { StudioWindow, artifacts, themes, useReduced, type Key, type Theme } from './StudioWindow';

// Exploration 1, after DialKit: the Studio window is the hero, and a small panel of live controls beside it changes it in place.
// On load the inbox resolves from its lo-fi sketch into the real screen, once, so the first thing a visitor sees is the idea.

function Slider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const set = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    onChange(Math.min(1, Math.max(0, (clientX - r.left) / r.width)));
  };
  return <div ref={track} className="dx-slider" role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)}
    onPointerDown={e => { (e.target as HTMLElement).setPointerCapture(e.pointerId); set(e.clientX); }}
    onPointerMove={e => { if (e.buttons) set(e.clientX); }}
    onKeyDown={e => { if (e.key === 'ArrowRight') onChange(Math.min(1, value + .1)); if (e.key === 'ArrowLeft') onChange(Math.max(0, value - .1)); }}>
    <i style={{ width: `${value * 100}%` }} /><b style={{ left: `${value * 100}%` }} />
  </div>;
}

export default function DialsHero() {
  const [shown, setShown] = useState<Key>('inbox');
  const [fidelity, setFidelity] = useState(0);
  const [theme, setTheme] = useState<Theme>('green');
  const touchedRef = useRef(false);
  const setTouched = (v: boolean) => { touchedRef.current = v; };
  const reduced = useReduced();
  // The opening: hold the sketch, then resolve it.
  useEffect(() => {
    if (reduced) { setFidelity(1); return; }
    let raf = 0; let start = 0;
    const delay = window.setTimeout(() => {
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / 1600);
        if (touchedRef.current) return;
        setFidelity(1 - Math.pow(1 - t, 3));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 900);
    return () => { window.clearTimeout(delay); cancelAnimationFrame(raf); };
  }, [reduced]);
  const fid = (v: number) => { setTouched(true); setShown('inbox'); setFidelity(v); };
  const word = fidelity < .2 ? 'Sketch' : fidelity > .8 ? 'Real' : 'Between';
  return <div className="dx-dials">
    <StudioWindow shown={shown} onPick={k => { setTouched(true); setShown(k); }} fidelity={fidelity} theme={theme} crop="pane" instant className="dx-dials-window" />
    <div className="dx-panel" aria-label="Try Design Studio">
      <div className="dx-panel-head"><span>Try it</span><span className="dx-mono">feedback-inbox</span></div>
      <div className="dx-row">
        <span className="dx-label">Fidelity</span>
        <Slider value={fidelity} onChange={fid} label="Fidelity, from sketch to real" />
        <span className="dx-mono dx-value">{word}</span>
      </div>
      <div className="dx-row">
        <span className="dx-label">Theme</span>
        <div className="dx-swatches">{themes.map(t => <button key={t.key} type="button" aria-label={`${t.label} theme`} aria-pressed={theme === t.key} className={theme === t.key ? 'is-on' : ''} style={{ background: t.swatch }} onClick={() => { setTouched(true); setShown(s => s === 'flow' || s === 'context' ? 'inbox' : s); setTheme(t.key); }} />)}</div>
        <span className="dx-mono dx-value">{themes.find(t => t.key === theme)!.label}</span>
      </div>
      <div className="dx-row is-stack">
        <span className="dx-label">Artifact</span>
        <div className="dx-seg">{artifacts.map(a => <button key={a.key} type="button" aria-pressed={shown === a.key} className={shown === a.key ? 'is-on' : ''} onClick={() => { setTouched(true); setShown(a.key); if (a.key === 'inbox') setFidelity(1); }}>{a.label}</button>)}</div>
      </div>
    </div>
  </div>;
}
