import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { OsRail } from '../../studio-case/StudioUI';
import { Canvas, Doc, Flow, Inbox, Nav, type Key } from '../StudioShapes';
import '../studio-shapes.css';
import './explore.css';

// Hero explorations for /design-studio (not linked from the site). Each one shows the open-source Studio's prototype view with the
// Feedback Inbox sample, built from the same parts as the live hero (StudioShapes), but at a readable size and open to the visitor's hand.

export type { Key };
export const artifacts: { key: Key; label: string }[] = [
  { key: 'inbox', label: 'Prototype' },
  { key: 'lofi', label: 'Lo-fi' },
  { key: 'flow', label: 'Flow' },
  { key: 'handoff', label: 'Handoff' },
  { key: 'context', label: 'Brief' },
];

// Themes for Echo, the sample product, as a design system would set them: primary, accent and corner radius.
export type Theme = 'green' | 'indigo' | 'clay';
export const themes: { key: Theme; label: string; swatch: string }[] = [
  { key: 'green', label: 'Green', swatch: 'oklch(0.508 0.118 165.612)' },
  { key: 'indigo', label: 'Indigo', swatch: 'oklch(0.511 0.262 276.966)' },
  { key: 'clay', label: 'Clay', swatch: 'oklch(0.553 0.195 38.402)' },
];
const themeVars: Record<Theme, { light: Record<string, string>; dark: Record<string, string>; radius: string }> = {
  green: { light: {}, dark: {}, radius: '0px' },
  indigo: {
    light: { '--e-primary': 'oklch(0.511 0.262 276.966)', '--e-primary-fg': 'oklch(0.962 0.018 272.314)', '--e-accent': 'oklch(0.93 0.034 272.788)', '--e-accent-fg': 'oklch(0.398 0.195 277.366)' },
    dark: { '--e-primary': 'oklch(0.673 0.182 276.935)', '--e-primary-fg': 'oklch(0.147 0.004 49.25)', '--e-accent': 'oklch(0.3 0.06 277)', '--e-accent-fg': 'oklch(0.87 0.065 274)' },
    radius: '6px',
  },
  clay: {
    light: { '--e-primary': 'oklch(0.553 0.195 38.402)', '--e-primary-fg': 'oklch(0.98 0.016 73.684)', '--e-accent': 'oklch(0.954 0.038 75.164)', '--e-accent-fg': 'oklch(0.47 0.157 37.304)' },
    dark: { '--e-primary': 'oklch(0.705 0.187 47.604)', '--e-primary-fg': 'oklch(0.147 0.004 49.25)', '--e-accent': 'oklch(0.3 0.06 45)', '--e-accent-fg': 'oklch(0.9 0.07 70)' },
    radius: '12px',
  },
};

/** Whether the page is in dark mode, following the site's theme switch. */
export function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.classList.contains('dark'));
    read();
    const watch = new MutationObserver(read);
    watch.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => watch.disconnect();
  }, []);
  return dark;
}

/** Whether the visitor asked for less motion. */
export function useReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const on = () => setReduced(query.matches);
    query.addEventListener('change', on);
    return () => query.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Steps through `count` items every `ms` until the visitor takes over (`stop`), skipping when reduced motion is on or off screen. */
export function useAutoplay(count: number, ms: number, start = 0) {
  const [index, setIndex] = useState(start);
  const [auto, setAuto] = useState(true);
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || reduced || !visible) return;
    const timer = window.setTimeout(() => setIndex(i => (i + 1) % count), ms);
    return () => window.clearTimeout(timer);
  }, [auto, reduced, visible, index, count, ms]);
  const pick = (i: number) => { setAuto(false); setIndex(i); };
  return { index, pick, auto, playing: auto && !reduced && visible, ref, setAuto };
}

const W = 1120, H = 700, SIDE = 276;

/** The Studio window at its desktop layout. It fits the column on wide screens; below `min` scale it holds that scale and crops,
 *  starting at the content pane when `crop` is 'pane' (the sidebar then sits off the left edge). */
export function StudioWindow({ shown, onPick, fidelity = 1, theme = 'green', min = 0.62, max = 1, crop = 'start', height = H, className = '', instant = false }: {
  shown: Key; onPick?: (key: Key) => void; fidelity?: number; theme?: Theme; min?: number; max?: number; crop?: 'start' | 'pane'; height?: number; className?: string; instant?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(W);
  const dark = useDark();
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fit = width / W;
  const s = Math.min(max, Math.max(min, fit));
  const cropped = fit < min;
  // Skip the sidebar only when the whole of it would leave the view; a partial skip would cut its labels mid-word.
  const x = cropped && crop === 'pane' && W - width / s >= SIDE ? -SIDE * s : 0;
  const t = themeVars[theme];
  const vars = { ...(dark ? t.dark : t.light), '--e-radius': t.radius } as CSSProperties;
  const lofi = shown === 'lofi' ? 1 : shown === 'inbox' ? 1 - fidelity : 0;
  const pane = shown === 'inbox' || shown === 'lofi'
    ? <div className="ss-pane"><div className="ss-app"><Inbox /></div><div className={`ss-app is-lofi ss-lofi-layer ${instant ? 'is-instant' : ''}`} style={{ opacity: lofi }}><Inbox /></div></div>
    : shown === 'flow' ? <Flow /> : shown === 'handoff' ? <Canvas /> : <Doc />;
  return <div ref={box} className={`dx-window ${cropped ? 'is-cropped' : ''} ${className}`} style={{ height: height * s }}>
    <div className="sc cs-native dx-native" style={{ width: W, height, transform: `translateX(${x}px) scale(${s})` }}>
      <div className="sc-os ss-os dx-os" style={vars}>
        <OsRail on="prototypes" />
        <Nav on={shown === 'lofi' ? 'lofi' : shown} onPick={onPick} />
        <div className="ss-panes"><div key={shown === 'lofi' ? 'inbox' : shown} className="dx-pane">{pane}</div></div>
      </div>
    </div>
  </div>;
}

/** Copies text, then says so on the button for a moment. */
export function useCopy() {
  const [done, setDone] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setDone(true); window.setTimeout(() => setDone(false), 2200); }
    catch { document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' }); }
  };
  return { done, copy };
}
