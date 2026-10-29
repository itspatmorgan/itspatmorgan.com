import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowReloadHorizontalIcon, Cursor01Icon, PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';
import { useDemoLoop } from './useDemoLoop';
import { NativeStage } from './NativeStage';

// Scene plumbing for case-study demos, first built for the Sublime screens. A scene starts when it scrolls into view. By default it cycles: the last step holds for its
// time, then the frame fades out and the scene starts again from its first frame, since a flow's last screen rarely tells the whole
// story. A scene whose end state is the point (`loop: false`) plays once and holds it, with Replay. Reduced motion lands on the last frame.

export function useScene(timings: readonly number[], captions: readonly string[], { loop: cycle = true }: { loop?: boolean } = {}) {
  const loop = useDemoLoop(timings, 0, false, true);
  const [fade, setFade] = useState(false);
  // Each replay is a new take: keying the screen on it remounts it, so entrances and count-ups run again from the start.
  const [take, setTake] = useState(0);
  // Each jump restarts the current chapter's progress bar.
  const [cut, setCut] = useState(0);
  const done = loop.step === timings.length - 1;
  // Chapters: a run of steps that share a caption. Each gets a segment in the progress bar, and its caption shows under the stage.
  const beats = captions.reduce<{ start: number; caption: string; duration: number }[]>((list, caption, i) => {
    const last = list[list.length - 1];
    if (last && last.caption === caption) last.duration += timings[i];
    else list.push({ start: i, caption, duration: timings[i] });
    return list;
  }, []);
  const beat = beats.reduce((current, b, i) => (b.start <= loop.step ? i : current), 0);
  const replay = () => {
    setFade(true);
    window.setTimeout(() => { loop.replay(); setTake(n => n + 1); setCut(n => n + 1); setFade(false); }, 240);
  };
  // The loop hook stops on the last step; a cycling scene holds it for its time, then restarts with a fade rather than stepping backward.
  const last = timings[timings.length - 1];
  useEffect(() => {
    if (!cycle || !done || !loop.playing || !loop.visible || loop.reduced) return;
    const timer = window.setTimeout(replay, last);
    return () => window.clearTimeout(timer);
  }, [cycle, done, loop.playing, loop.visible, loop.reduced, last, take, cut]);
  const jumpTo = (i: number) => {
    if (i === 0) { replay(); return; }
    setCut(n => n + 1);
    if (loop.reduced) loop.choose(beats[i].start); else loop.jump(beats[i].start);
  };
  return { ...loop, done, cycle, fade, take, cut, replay, beats, beat, caption: captions[loop.step], jumpTo };
}
export type Scene = ReturnType<typeof useScene>;

/** Whether the page is phone-sized. Scenes then lay the product out in one narrow column, so its text stays readable. */
export function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return narrow;
}
const NarrowLayout = createContext(false);
/** Inside a stage: true when the product is laid out for a phone. */
export const useNarrowLayout = () => useContext(NarrowLayout);

/** Lays out children at `width` source pixels and scales them to fill `to` frame pixels. */
export function Zoom({ width, to = 1020, children, style, zoomRef }: { width: number; to?: number; children: ReactNode; style?: CSSProperties; zoomRef?: RefObject<HTMLDivElement | null> }) {
  return <div className="cs-zoom" ref={zoomRef} style={{ width, transform: `scale(${to / width})`, ...style }}>{children}</div>;
}

/** Stage geometry, in stage pixels. Wide: a 1240 px stage with the card inset 64 px, so a 1000 px screen renders at about its true size
 *  on a laptop. Narrow: a 600 px stage with the card inset 20 px, holding a 400 px product layout. The card bleeds off the stage's
 *  bottom edge, as a page that goes on; a `contained` screen that ends sits whole inside the stage instead (wide only). */
export function useStage({ wide, narrow: narrowWidth = 400, height = 760, contained = false }: { wide: number; narrow?: number; height?: number; contained?: boolean }) {
  const narrow = useNarrow();
  const g = narrow ? { width: 600, height: 780, inset: 20, top: 24, ring: 10, bottom: 0 } : { width: 1240, height, inset: 64, top: 64, ring: 16, bottom: contained ? 64 : 0 };
  const card = g.width - g.inset * 2;
  const W = narrow ? narrowWidth : wide;
  return { narrow, W, g, card, box: { width: W, height: (g.height - g.top - g.bottom) * W / card } };
}
export type Stage = ReturnType<typeof useStage>;

/** A scene: the stage, with the product card bleeding off its bottom edge and fading out, then the chapter captions and progress. */
export function SceneFrame({ scene, stage, label, title, size = 'wide', controls = true, children }: { scene: Scene; stage: Stage; label: string; title: string; size?: 'wide' | 'normal'; controls?: boolean; children: ReactNode }) {
  const { g, card } = stage;
  // The server renders the wide layout; on a phone the stage stays hidden until it has laid itself out for the phone.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <figure className={`cs-scene ${scene.fade ? 'cs-loop-reset' : ''}`} ref={scene.ref as RefObject<HTMLElement>} aria-label={label}>
    <div className={`cs-stage texture-bg cs-frame is-${size} ${ready ? 'is-ready' : ''}`}>
      <NarrowLayout.Provider value={stage.narrow}>
        <NativeStage width={g.width} height={g.height}>
          <div className={`cs-shell ${g.bottom ? 'is-contained' : ''}`} style={{ left: g.inset - g.ring, top: g.top - g.ring, bottom: g.bottom ? g.bottom - g.ring : 0, width: card + g.ring * 2, padding: g.bottom ? g.ring : `${g.ring}px ${g.ring}px 0` }}>
            <div className="cs-card">
              <Zoom key={`${scene.take}-${stage.narrow}`} width={stage.W} to={card}>{children}</Zoom>
            </div>
          </div>
        </NativeStage>
      </NarrowLayout.Provider>
    </div>
    {controls ? <SceneTour scene={scene} title={title} /> : <figcaption className="sr-only">{scene.caption}</figcaption>}
  </figure>;
}

/** A scene on the plain stage: the product frame sits on the texture with the stage's own padding, and the tour runs under it. For
 *  demos laid out by their own component (Query Builder, Expansion) rather than in the Sublime card. Each take remounts the content, so a
 *  replay starts from its first frame instead of animating backward. */
export function DemoFrame({ scene, label, title, stage = '', caption = true, children }: { scene: Scene; label: string; title: string; stage?: string; caption?: boolean; children: ReactNode }) {
  return <figure className={`cs-scene ${scene.fade ? 'cs-loop-reset' : ''}`} ref={scene.ref as RefObject<HTMLElement>} aria-label={label}>
    <div className={`cs-stage texture-bg ${stage}`} key={scene.take}>{children}</div>
    <SceneTour scene={scene} title={title} caption={caption} />
  </figure>;
}

/** Under the stage: what the current chapter shows, and a segment per chapter that fills as it plays. Segments jump to their chapter;
 *  the button pauses or plays, and replays a finished scene that doesn't cycle. */
export function SceneTour({ scene, title, caption = true }: { scene: Scene; title: string; caption?: boolean }) {
  const finished = scene.done && !scene.reduced && !scene.cycle;
  const label = finished ? `Replay ${title}` : `${scene.playing ? 'Pause' : 'Play'} ${title}`;
  const running = scene.playing && scene.visible && !scene.reduced;
  // Without a visible caption (a demo the picture already explains), the controls sit alone at the right and the caption stays for screen readers.
  if (!caption) return <div className="cs-tour is-quiet">
    <figcaption className="sr-only">{scene.beats[scene.beat]?.caption}</figcaption>
    <TourControls scene={scene} label={label} finished={finished} running={running} />
  </div>;
  return <div className="cs-tour">
    <figcaption className="cs-tour-caption" aria-live={scene.playing && !scene.done ? 'off' : 'polite'}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={scene.beat} initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }} transition={{ duration: .26, ease: [.23, 1, .32, 1] }}>{scene.beats[scene.beat]?.caption}</motion.span>
      </AnimatePresence>
    </figcaption>
    <TourControls scene={scene} label={label} finished={finished} running={running} />
  </div>;
}

/** The step segments (when there is more than one step) and the play, pause or replay button. */
function TourControls({ scene, label, finished, running }: { scene: Scene; label: string; finished: boolean; running: boolean }) {
  return <div className="cs-tour-controls">
    {scene.beats.length > 1 && <ol className="cs-beats">
      {scene.beats.map((b, i) => <li key={i}>
        <button type="button" className={i < scene.beat ? 'is-done' : i === scene.beat ? 'is-current' : ''} aria-current={i === scene.beat ? 'step' : undefined} aria-label={`Step ${i + 1} of ${scene.beats.length}: ${b.caption}`} onClick={() => scene.jumpTo(i)}>
          <i key={i === scene.beat ? `${scene.cut}-${scene.take}` : 'idle'} style={i === scene.beat ? { animationDuration: `${b.duration}ms`, animationPlayState: running ? 'running' : 'paused' } : undefined} />
        </button>
      </li>)}
    </ol>}
    {!scene.reduced && <button type="button" className="cs-tour-play" aria-label={label} title={label} onClick={finished ? scene.replay : scene.toggle}>
      <HugeiconsIcon icon={finished ? ArrowReloadHorizontalIcon : scene.playing ? PauseIcon : PlayIcon} size={14} strokeWidth={1.8} />
    </button>}
  </div>;
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
    <motion.div ref={cameraRef} className="cs-camera" style={{ transform, ...style }}>{children}</motion.div>
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
  return <motion.div className="cs-cursor cs-pointer" aria-hidden="true" style={{ left: 0, top: 0, x, y, opacity }}>
    <motion.div style={{ scale: counter, transformOrigin: '4px 3px' }}>
      <motion.div initial={false} animate={{ scale: pressing ? .86 : 1 }} transition={{ type: 'spring', bounce: 0, duration: .22 }} style={{ transformOrigin: '4px 3px' }}>
        <HugeiconsIcon icon={Cursor01Icon} size={23} strokeWidth={1.7} />
      </motion.div>
    </motion.div>
  </motion.div>;
}

/** Content that opens to its natural height (and closes) on a spring, instead of popping in. */
export function Expand({ open, children, className, style }: { open: boolean; children: ReactNode; className?: string; style?: CSSProperties }) {
  // The content stays mounted and is measured continuously, so the height animates to what the content really is, even if it settles
  // taller mid-slide (a height of 'auto' is measured once at the start, so the slide fell short and the last stretch snapped into place).
  // Until the first measurement, it simply sits open or closed, so nothing slides in on load.
  const inner = useRef<HTMLDivElement>(null);
  const [h, setH] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setH(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <motion.div initial={false} aria-hidden={!open || undefined} inert={!open || undefined}
    animate={{ height: h === null ? (open ? 'auto' : 0) : open ? h : 0, opacity: open ? 1 : 0 }}
    transition={h === null ? { duration: 0 } : { height: { type: 'spring', bounce: 0, duration: .6 }, opacity: { duration: .28, delay: open ? .06 : 0 } }}
    style={{ overflow: 'hidden', ...style }}>
    {/* flow-root keeps the children's margins inside the measured box. */}
    <div ref={inner} className={className} style={className ? undefined : { display: 'flow-root' }}>{children}</div>
  </motion.div>;
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
  // popLayout lifts the outgoing screen out of the flow, so the two crossfade over each other and the card is never empty.
  return <AnimatePresence mode="popLayout" initial={false}>
    <motion.div key={id} initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(2px)', transition: { duration: .3, ease: [.65, 0, .35, 1] } }}
      transition={{ duration: .45, ease: [.23, 1, .32, 1] }} style={{ background: 'var(--cs-card)' }}>{children}</motion.div>
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
