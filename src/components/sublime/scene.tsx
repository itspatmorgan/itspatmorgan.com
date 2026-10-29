import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowReloadHorizontalIcon, Cursor01Icon, PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';
import { useDemoLoop } from '../case-study/useDemoLoop';

// Scene plumbing for the Sublime screens. A scene plays once when it scrolls into view and holds its last frame, so nothing
// snaps back mid-read; Replay fades the frame out before it starts again. Reduced motion lands on the last frame.

export function useScene(timings: readonly number[]) {
  const loop = useDemoLoop(timings, 0, false, true);
  const [fade, setFade] = useState(false);
  // Each replay is a new take: keying the screen on it remounts it, so entrances and count-ups run again from the start.
  const [take, setTake] = useState(0);
  const done = loop.step === timings.length - 1;
  const replay = () => {
    setFade(true);
    window.setTimeout(() => { loop.replay(); setTake(n => n + 1); setFade(false); }, 240);
  };
  return { ...loop, done, fade, take, replay };
}
export type Scene = ReturnType<typeof useScene>;

/** Pause and play while a scene runs; Replay once it has finished. */
export function SceneControls({ scene, title, caption }: { scene: Scene; title: string; caption: string }) {
  const finished = scene.done && !scene.reduced;
  const label = finished ? `Replay ${title}` : `${scene.playing ? 'Pause' : 'Play'} ${title}`;
  return <>
    <figcaption className="sr-only" aria-live={scene.playing && !scene.done ? 'off' : 'polite'}>{caption}</figcaption>
    {!scene.reduced && <button type="button" className="qb-play" aria-label={label} title={label} onClick={finished ? scene.replay : scene.toggle}>
      <HugeiconsIcon icon={finished ? ArrowReloadHorizontalIcon : scene.playing ? PauseIcon : PlayIcon} size={14} strokeWidth={1.7} />
    </button>}
  </>;
}

export type View = { x: number; y: number; s: number };
const HOME: View = { x: 0, y: 0, s: 1 };
const CameraScale = createContext<MotionValue<number> | null>(null);

/** A camera over the screen: `view` puts source point (x, y) at the frame's top left at scale `s`, for a `width` × `height` frame.
 *  A move keeps the point under the frame's center travelling in a straight line while the scale changes geometrically, so a zoom
 *  reads as one gesture rather than a pan and a zoom fighting each other. Moves ease in and out and take longer the further they go.
 *  The first view it is given lands without a move, so a scene never opens on a jump. */
export function Camera({ view, width, height, children, cameraRef, style, reduced = false }: { view: View; width: number; height: number; children: ReactNode; cameraRef?: RefObject<HTMLDivElement | null>; style?: CSSProperties; reduced?: boolean }) {
  const s = useMotionValue(view.s);
  const cx = useMotionValue(view.x + width / 2 / view.s);
  const cy = useMotionValue(view.y + height / 2 / view.s);
  const transform = useTransform(() => {
    const k = s.get();
    return `scale(${k}) translate(${-(cx.get() - width / 2 / k)}px, ${-(cy.get() - height / 2 / k)}px)`;
  });
  const painted = useRef(false);
  useEffect(() => { const id = requestAnimationFrame(() => requestAnimationFrame(() => { painted.current = true; })); return () => cancelAnimationFrame(id); }, []);
  useEffect(() => {
    const to = { s: view.s, cx: view.x + width / 2 / view.s, cy: view.y + height / 2 / view.s };
    const from = { s: s.get(), cx: cx.get(), cy: cy.get() };
    const jump = () => { s.jump(to.s); cx.jump(to.cx); cy.jump(to.cy); };
    if (reduced || !painted.current) { jump(); return; }
    // Distance in on-screen pixels: the center's travel plus how much the zoom changes.
    const travel = Math.hypot(to.cx - from.cx, to.cy - from.cy) * Math.max(from.s, to.s) + Math.abs(Math.log(to.s / from.s)) * width;
    if (travel < 1) { jump(); return; }
    const controls = animate(0, 1, {
      duration: Math.min(1.1, .55 + travel / 1800), ease: [.65, 0, .35, 1],
      onUpdate: p => { s.set(from.s * Math.pow(to.s / from.s, p)); cx.set(from.cx + (to.cx - from.cx) * p); cy.set(from.cy + (to.cy - from.cy) * p); },
    });
    return () => controls.stop();
  }, [view.x, view.y, view.s, width, height, reduced]);
  return <CameraScale.Provider value={s}>
    <motion.div ref={cameraRef} className="sb-camera" style={{ transform, ...style }}>{children}</motion.div>
  </CameraScale.Provider>;
}

type Rect = { x: number; y: number; w: number; h: number };
/** Where the cursor should point (each `[data-target]`) and what the camera can frame (each `[data-frame]`) inside `ref`'s element, in
 *  that element's own pixels. Measured before paint on every step, then every frame while the step's layout settles (springs, screen
 *  changes), so nothing aims at where an element was. `height` is the page's height, the camera's bottom edge. */
export function useTargets(step: number, extra: unknown = null) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ points: Record<string, { x: number; y: number }>; rects: Record<string, Rect>; height: number }>({ points: {}, rects: {}, height: 0 });
  useLayoutEffect(() => {
    let last = '';
    const measure = () => {
      const root = ref.current;
      if (!root) return;
      const box = root.getBoundingClientRect();
      const scale = box.width / root.offsetWidth || 1;
      const points: Record<string, { x: number; y: number }> = {};
      root.querySelectorAll<HTMLElement>('[data-target]').forEach(el => {
        const r = el.getBoundingClientRect();
        points[el.dataset.target!] = { x: Math.round((r.left - box.left + Math.min(r.width * .5, 56)) / scale), y: Math.round((r.top - box.top + r.height * .6) / scale) };
      });
      const rects: Record<string, Rect> = {};
      root.querySelectorAll<HTMLElement>('[data-frame]').forEach(el => {
        const r = el.getBoundingClientRect();
        rects[el.dataset.frame!] = { x: Math.round((r.left - box.left) / scale), y: Math.round((r.top - box.top) / scale), w: Math.round(r.width / scale), h: Math.round(r.height / scale) };
      });
      const page = root.firstElementChild as HTMLElement | null;
      const next = { points, rects, height: page ? page.offsetHeight : root.offsetHeight };
      const key = JSON.stringify(next);
      if (key !== last) { last = key; setState(next); }
    };
    measure();
    const until = performance.now() + 1000;
    let id = requestAnimationFrame(function tick() { measure(); if (performance.now() < until) id = requestAnimationFrame(tick); });
    return () => cancelAnimationFrame(id);
  }, [step, extra]);
  return { ref, height: state.height, at: (key: string) => state.points[key] ?? null, rect: (key: string) => state.rects[key] ?? null };
}
export type Targets = ReturnType<typeof useTargets>;

/** The view that frames `r` whole in a `width` × `height` frame: scaled to fit with `pad` around it (or at `scale`), centered or
 *  aligned to the frame’s start, and kept inside the page on every edge so a zoom never shows past it. A `bottom` of 0 leaves
 *  the bottom open, for a page that is about to grow. */
export function frame(r: Rect | null, box: { width: number; height: number; bottom: number }, { scale, pad = 32, max = 1.6, x: ax = 'center', y: ay = 'center' }: { scale?: number; pad?: number; max?: number; x?: 'start' | 'center'; y?: 'start' | 'center' } = {}): View | null {
  if (!r) return null;
  const s = Math.max(1, scale ?? Math.min(max, box.width / (r.w + pad * 2), box.height / (r.h + pad * 2)));
  const vw = box.width / s, vh = box.height / s;
  const x = ax === 'start' ? r.x - pad : r.x + r.w / 2 - vw / 2;
  const y = ay === 'start' ? r.y - pad : r.y + r.h / 2 - vh / 2;
  const clamp = (v: number, hi: number) => Math.round(Math.min(Math.max(0, v), Math.max(0, hi)));
  return { x: clamp(x, box.width - vw), y: clamp(y, (box.bottom || Infinity) - vh), s };
}

/** Holds a shot: the view for `key` is fixed once it can be measured, so content opening or closing elsewhere on the page can't nudge
 *  the camera mid-shot. A new key (or none, the whole page) moves on. */
export function useShot(key: string | null, view: View | null): View {
  const held = useRef<{ key: string; view: View } | null>(null);
  if (key === null) { held.current = null; return HOME; }
  if (held.current?.key !== key) held.current = view ? { key, view } : null;
  return held.current?.view ?? HOME;
}

/** A pointer that moves like a hand: it glides in when it appears, travels on a critically damped spring, dips when it presses, and
 *  keeps its on-screen size whatever the camera does. */
export function Pointer({ at, visible, pressing = false, reduced = false }: { at: { x: number; y: number } | null; visible: boolean; pressing?: boolean; reduced?: boolean }) {
  const show = visible && !!at && !reduced;
  const camera = useContext(CameraScale);
  const unit = useMotionValue(1);
  const counter = useTransform(camera ?? unit, k => 1 / k);
  const x = useMotionValue(at?.x ?? 0);
  const y = useMotionValue(at?.y ?? 0);
  const opacity = useMotionValue(0);
  const shown = useRef(false);
  useEffect(() => {
    const glide = { type: 'spring' as const, bounce: 0, duration: .75 };
    if (!show) { if (shown.current) animate(opacity, 0, { duration: .2 }); shown.current = false; return; }
    if (!shown.current) {
      // Enter from just below and to the right of the target, as if the hand had been resting nearby.
      const k = camera?.get() ?? 1;
      x.jump(at!.x + 22 / k); y.jump(at!.y + 30 / k);
      animate(opacity, 1, { duration: .25 });
      shown.current = true;
    }
    const ax = animate(x, at!.x, glide), ay = animate(y, at!.y, glide);
    return () => { ax.stop(); ay.stop(); };
  }, [show, at?.x, at?.y]);
  return <motion.div className="q-cursor sb-pointer" aria-hidden="true" style={{ left: 0, top: 0, x, y, opacity }}>
    <motion.div style={{ scale: counter, transformOrigin: '4px 3px' }}>
      <motion.div initial={false} animate={{ scale: pressing ? .86 : 1 }} transition={{ type: 'spring', bounce: 0, duration: .22 }} style={{ transformOrigin: '4px 3px' }}>
        <HugeiconsIcon icon={Cursor01Icon} size={23} strokeWidth={1.7} />
      </motion.div>
    </motion.div>
  </motion.div>;
}

/** Content that opens to its natural height (and closes) on a spring, instead of popping in. */
export function Expand({ open, children, className, style }: { open: boolean; children: ReactNode; className?: string; style?: CSSProperties }) {
  return <AnimatePresence initial={false}>{open && <motion.div key="expand" className={className}
    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
    transition={{ height: { type: 'spring', bounce: 0, duration: .6 }, opacity: { duration: .28, delay: .06 } }}
    style={{ overflow: 'hidden', ...style }}>{children}</motion.div>}</AnimatePresence>;
}

/** A number that counts up to `to` once `run` turns true, easing out like the rest of the motion; reduced motion shows the value. */
export function CountUp({ to, run, duration = 1.1, format = (n: number) => String(Math.round(n)), reduced = false }: { to: number; run: boolean; duration?: number; format?: (n: number) => string; reduced?: boolean }) {
  const [value, setValue] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced) { setValue(to); return; }
    if (!run) { setValue(0); return; }
    const controls = animate(0, to, { duration, ease: [.23, 1, .32, 1], onUpdate: setValue });
    return () => controls.stop();
  }, [run, to, duration, reduced]);
  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{format(value)}</span>;
}

/** One screen at a time, keyed by `id`: going to the next screen fades the old one out and brings the new one up, like a page load
 *  that has already happened. */
export function Screens({ id, children }: { id: string; children: ReactNode }) {
  return <AnimatePresence mode="wait" initial={false}>
    <motion.div key={id} initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6, filter: 'blur(2px)', transition: { duration: .18, ease: [.65, 0, .35, 1] } }}
      transition={{ duration: .42, ease: [.23, 1, .32, 1] }}>{children}</motion.div>
  </AnimatePresence>;
}

/** Text typed out a character at a time once `run` is true, at a person's pace; reduced motion shows it whole. */
export function Typing({ text, run, every = 55, reduced = false }: { text: string; run: boolean; every?: number; reduced?: boolean }) {
  const [shown, setShown] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (reduced) { setShown(text.length); return; }
    if (!run) { setShown(0); return; }
    let i = 0;
    const timer = window.setInterval(() => { i += 1; setShown(i); if (i >= text.length) window.clearInterval(timer); }, every);
    return () => window.clearInterval(timer);
  }, [run, text, every, reduced]);
  return <>{text.slice(0, shown)}</>;
}
