import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, animate, motion } from 'motion/react';
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
/** A camera over the screen: `view` puts source point (x, y) at the frame's top left at scale `s`. Moves ease in and out, like a hand on a trackpad. */
export function Camera({ view, children, cameraRef, style }: { view: View; children: ReactNode; cameraRef?: RefObject<HTMLDivElement | null>; style?: CSSProperties }) {
  return <div ref={cameraRef} className="sb-camera" style={{ transform: `scale(${view.s}) translate(${-view.x}px, ${-view.y}px)`, ...style }}>{children}</div>;
}

/** Where the cursor should point: each `[data-target]` inside `ref`'s element, in that element's own pixels, measured on every step. */
export function useTargets(step: number, extra: unknown = null) {
  const ref = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Record<string, { x: number; y: number }>>({});
  const [rects, setRects] = useState<Record<string, { x: number; y: number; w: number; h: number }>>({});
  useEffect(() => {
    const measure = () => {
      const root = ref.current;
      if (!root) return;
      const box = root.getBoundingClientRect();
      const scale = box.width / root.offsetWidth || 1;
      const next: Record<string, { x: number; y: number }> = {};
      root.querySelectorAll<HTMLElement>('[data-target]').forEach(el => {
        const r = el.getBoundingClientRect();
        next[el.dataset.target!] = { x: (r.left - box.left + Math.min(r.width * .5, 56)) / scale, y: (r.top - box.top + r.height * .6) / scale };
      });
      setPoints(next);
      const frames: Record<string, { x: number; y: number; w: number; h: number }> = {};
      root.querySelectorAll<HTMLElement>('[data-frame]').forEach(el => {
        const r = el.getBoundingClientRect();
        frames[el.dataset.frame!] = { x: (r.left - box.left) / scale, y: (r.top - box.top) / scale, w: r.width / scale, h: r.height / scale };
      });
      setRects(frames);
    };
    measure();
    // Layout settles after enter transitions; measure again once they have.
    const timer = window.setTimeout(measure, 420);
    return () => window.clearTimeout(timer);
  }, [step, extra]);
  return { ref, at: (key: string) => points[key] ?? null, rect: (key: string) => rects[key] ?? null };
}

/** A pointer that moves like a hand: a critically damped spring, a press that dips, and a fixed on-screen size whatever the camera does. */
export function Pointer({ at, visible, pressing = false, scale = 1, reduced = false }: { at: { x: number; y: number } | null; visible: boolean; pressing?: boolean; scale?: number; reduced?: boolean }) {
  const show = visible && !!at && !reduced;
  // Appear where it is needed rather than flying in from the corner: while hidden, position changes are instant.
  const wasShown = useRef(false);
  const jump = !wasShown.current;
  useEffect(() => { wasShown.current = show; }, [show]);
  const move = jump ? { duration: 0 } : { type: 'spring' as const, bounce: 0, duration: .75 };
  return <motion.div className="q-cursor sb-pointer" aria-hidden="true"
    initial={false}
    animate={{ x: at?.x ?? 0, y: at?.y ?? 0, opacity: show ? 1 : 0, scale: (pressing ? .86 : 1) / scale }}
    transition={{ x: move, y: move, scale: { type: 'spring', bounce: 0, duration: .22 }, opacity: { duration: .2 } }}
    style={{ left: 0, top: 0, transformOrigin: '4px 3px' }}>
    <HugeiconsIcon icon={Cursor01Icon} size={23} strokeWidth={1.7} />
  </motion.div>;
}

/** The camera view that centers frame `r` in a `width` × `height` viewport at scale `s`, kept inside the page's top-left edge. */
export function focus(r: { x: number; y: number; w: number; h: number } | null, s: number, width: number, height: number, bias = .5): View {
  if (!r) return { x: 0, y: 0, s: 1 };
  const x = Math.min(Math.max(0, r.x + r.w / 2 - width / s / 2), width - width / s);
  const y = Math.max(0, r.y + r.h * bias - height / s / 2);
  return { x, y, s };
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
