import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useDark, useIsomorphicLayoutEffect, useReduced } from '../../hooks';
import { OsRail } from '../../studio-case/StudioUI';
import { Canvas, Doc, Flow, Inbox, Nav, type Key } from '../StudioShapes';
import '../../case-study/case-study.css';
import '../../studio-case/studio-case.css';
import '../studio-shapes.css';
import './explore.css';

// Hero explorations for /design-studio (not linked from the site). Each one shows the open-source Studio's prototype view with the
// Echo app sample, built from the same parts as the live hero (StudioShapes), but at a readable size and open to the visitor's hand.

export type { Key };
export const artifacts: { key: Key; label: string }[] = [
  { key: 'inbox', label: 'Prototype' },
  { key: 'lofi', label: 'Lo-fi' },
  { key: 'flow', label: 'Flow' },
  { key: 'handoff', label: 'Handoff' },
  { key: 'context', label: 'Brief' },
];

// Themes for Echo, the sample product, as a design system would set them: primary, accent and corner radius.
export type Theme = 'echo' | 'indigo' | 'clay' | 'echo-marketing';
export const themes: { key: Theme; label: string; swatch: string }[] = [
  { key: 'echo', label: 'Cobalt', swatch: 'oklch(0.55 0.24 265)' },
  { key: 'indigo', label: 'Indigo', swatch: 'oklch(0.511 0.262 276.966)' },
  { key: 'clay', label: 'Clay', swatch: 'oklch(0.553 0.195 38.402)' },
];
const themeVars: Record<Theme, { light: Record<string, string>; dark: Record<string, string>; radius: string }> = {
  echo: { light: {}, dark: {}, radius: '8px' },
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
  // Echo's Marketing system (src/systems/marketing/styles/theme.css), used by the Echo website: the same cobalt as Product at full
  // strength, on white with zinc ink, so the two read as one company with two jobs.
  'echo-marketing': {
    light: { '--e-bg': '#ffffff', '--e-fg': '#09090b', '--e-card': '#ffffff', '--e-primary': '#2f5bff', '--e-primary-fg': '#ffffff', '--e-secondary': '#f4f4f5', '--e-secondary-fg': '#09090b', '--e-muted': '#f4f4f5', '--e-weak': '#71717a', '--e-accent': '#eef2ff', '--e-accent-fg': '#2149e6', '--e-line': '#e4e4e7' },
    dark: { '--e-bg': '#09090b', '--e-fg': '#fafafa', '--e-card': '#18181b', '--e-primary': '#4d74ff', '--e-primary-fg': '#ffffff', '--e-secondary': '#18181b', '--e-secondary-fg': '#fafafa', '--e-muted': '#18181b', '--e-weak': '#a1a1aa', '--e-accent': '#1a2350', '--e-accent-fg': '#9db2ff', '--e-line': '#27272a' },
    radius: '8px',
  },
};

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

export const W = 1120, H = 700, SIDE = 276;

/** Fits a native W-wide surface to its box: scales down to fit, holding `min` scale on narrow screens and cropping instead, from
 *  the left edge or, when `crop` is 'pane' and the whole sidebar would leave the view, from the start of the content pane. */
export function useFit(min: number, max: number, crop: 'start' | 'pane', base = W, guess = W) {
  const ref = useRef<HTMLDivElement>(null);
  // `guess` is the box's width on a desktop screen, so the server-rendered window already has its final size there; the layout
  // effect measures the real box before the first paint after hydration, so the window never jumps from full size while scrolling.
  const [width, setWidth] = useState(guess);
  const [ready, setReady] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    setReady(true);
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const fit = width / base;
  const s = Math.min(max, Math.max(min, fit));
  const cropped = fit < min;
  // Skip the sidebar only when the whole of it would leave the view; a partial skip would cut its labels mid-word.
  const x = cropped && crop === 'pane' && base === W && W - width / s >= SIDE ? -SIDE * s : 0;
  return { ref, s, x, cropped, ready, width };
}

/** Echo's tokens for a theme, light or dark, plus its corner radius. */
export function themeStyle(theme: Theme, dark: boolean) {
  const t = themeVars[theme];
  return { ...(dark ? t.dark : t.light), '--e-radius': t.radius } as CSSProperties;
}

/** The Studio window at its desktop layout, showing one artifact. */
export function StudioWindow({ shown, onPick, fidelity = 1, theme = 'echo', min = 0.62, max = 1, crop = 'start', height = H, className = '', instant = false, side = true }: {
  shown: Key; onPick?: (key: Key) => void; fidelity?: number; theme?: Theme; min?: number; max?: number; crop?: 'start' | 'pane'; height?: number; className?: string; instant?: boolean;
  /** false: the Studio with its artifact list collapsed (the rail's panel button), so the artifact gets the room. */
  side?: boolean;
}) {
  const base = side ? W : W - SIDE;
  const { ref, s, x, cropped } = useFit(min, max, crop, base);
  const dark = useDark(ref);
  const lofi = shown === 'lofi' ? 1 : shown === 'inbox' ? 1 - fidelity : 0;
  const pane = shown === 'inbox' || shown === 'lofi'
    ? <div className="ss-pane"><div className="ss-app"><Inbox /></div><div className={`ss-app is-lofi ss-lofi-layer ${instant ? 'is-instant' : ''}`} style={{ opacity: lofi }}><Inbox /></div></div>
    : shown === 'flow' ? <Flow /> : shown === 'handoff' ? <Canvas /> : <Doc />;
  return <div ref={ref} className={`dx-window ${cropped ? 'is-cropped' : ''} ${className}`} style={{ height: height * s }}>
    <div className="sc cs-native dx-native" style={{ width: base, height, transform: `translateX(${x}px) scale(${s})` }}>
      <div className="sc-os ss-os dx-os" style={themeStyle(theme, dark)}>
        <OsRail on="prototypes" />
        {side && <Nav on={shown} onPick={onPick} />}
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
