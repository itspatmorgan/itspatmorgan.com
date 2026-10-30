import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cursor01Icon } from '@hugeicons/core-free-icons';

// Shared plumbing for case-study demos: a source frame scaled crisply to its stage, and a demo cursor. Playback lives in scene.tsx.
// A `crop` shows one region of the frame at a larger scale (a phone's closer look); a new crop eases to it.

/** How far a phone zooms in for a closer look, keeping the frame's proportions. */
export const PHONE_ZOOM = 1.6;
/** A phone's view of a `width` × `height` frame: the whole frame, or PHONE_ZOOM closer with the same proportions, centered on `at`
 *  inside the frame. Passing the whole frame rather than no crop lets the view ease in and out of a closer look. */
export function zoomCrop(width: number, height: number, at: readonly [number, number] | null) {
  if (!at) return { x: 0, y: 0, width, height };
  const [x, y] = at, w = width / PHONE_ZOOM, h = height / PHONE_ZOOM;
  const clamp = (v: number, hi: number) => Math.round(Math.min(Math.max(0, v), hi));
  return { x: clamp(x - w / 2, width - w), y: clamp(y - h / 2, height - h), width: w, height: h };
}

export function NativeStage({ width, height, children, className = '', interactive = true, crop }: { width: number; height: number; children: ReactNode; className?: string; interactive?: boolean; crop?: { x: number; y: number; width: number; height: number } }) {
  const viewportWidth = crop?.width ?? width;
  const viewportHeight = crop?.height ?? height;
  const offset = `translate(${-1 * (crop?.x ?? 0)}px, ${-1 * (crop?.y ?? 0)}px)`;
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState(0);
  const scale = box / viewportWidth;
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setBox(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  // The first crop lands without a move; only a change of crop after that pans.
  const [pans, setPans] = useState(false);
  useEffect(() => {
    setPans(false);
    if (!crop || !box) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPans(true)));
    return () => cancelAnimationFrame(id);
  }, [!!crop, !!box]);
  return <div className={`cs-native-stage ${crop && crop.width < width ? 'is-cropped' : ''} ${pans ? 'is-panning' : ''} ${className}`} ref={ref} style={{ aspectRatio: `${viewportWidth} / ${viewportHeight}`, containerType: 'inline-size' }}>
    <div className="cs-native cs-canvas" inert={!interactive} style={{ width, height, transform: `${scale ? `scale(${scale})` : `scale(calc(100cqw / ${viewportWidth}px))`} ${offset}` }}><MotionConfig reducedMotion="user">{children}</MotionConfig></div>
  </div>;
}


export function DemoCursor({ x, y, visible, reduced = false, pressing = false }: { x: number; y: number; visible: boolean; reduced?: boolean; pressing?: boolean }) {
  return <AnimatePresence>{visible && <motion.div className="cs-cursor" aria-hidden="true" initial={{ opacity: 0, left: x, top: y }} animate={{ left: x, top: y, opacity: 1, scale: pressing ? .86 : 1 }} exit={{ opacity: 0 }} transition={{ left: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] }, top: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] }, scale: { duration: .14 }, opacity: { duration: .14 } }}><HugeiconsIcon icon={Cursor01Icon} size={23} strokeWidth={1.7} /></motion.div>}</AnimatePresence>;
}
