import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cursor01Icon, PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';
import type { DemoLoop } from './useDemoLoop';

// Shared plumbing for case-study demos: a source frame scaled crisply to its stage, playback controls, and a demo cursor.

export function NativeStage({ width, height, children, className = '', interactive = true, crop }: { width: number; height: number; children: ReactNode; className?: string; interactive?: boolean; crop?: { x: number; y: number; width: number; height: number } }) {
  const viewportWidth = crop?.width ?? width;
  const viewportHeight = crop?.height ?? height;
  const offset = `translate(${-1 * (crop?.x ?? 0)}px, ${-1 * (crop?.y ?? 0)}px)`;
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / viewportWidth));
    observer.observe(node);
    return () => observer.disconnect();
  }, [viewportWidth]);
  return <div className={`cs-native-stage ${className}`} ref={ref} style={{ aspectRatio: `${viewportWidth} / ${viewportHeight}`, containerType: 'inline-size' }}>
    <div className="cs-native cs-canvas" inert={!interactive} style={{ width, height, transform: `${scale ? `scale(${scale})` : `scale(calc(100cqw / ${viewportWidth}px))`} ${offset}` }}><MotionConfig reducedMotion="user">{children}</MotionConfig></div>
  </div>;
}

export function DemoControls({ loop, title, caption }: { loop: DemoLoop; title: string; caption: string }) {
  return <><figcaption className="sr-only" aria-live={loop.playing ? 'off' : 'polite'}>{caption}</figcaption><button type="button" className="cs-play" aria-label={`${loop.playing ? 'Pause' : 'Play'} ${title}`} title={`${loop.playing ? 'Pause' : 'Play'} animation`} onClick={loop.toggle}><HugeiconsIcon icon={loop.playing ? PauseIcon : PlayIcon} size={14} strokeWidth={1.7} /></button></>;
}

export function DemoCursor({ x, y, visible, reduced = false, pressing = false }: { x: number; y: number; visible: boolean; reduced?: boolean; pressing?: boolean }) {
  return <AnimatePresence>{visible && <motion.div className="cs-cursor" aria-hidden="true" initial={{ opacity: 0, left: x, top: y }} animate={{ left: x, top: y, opacity: 1, scale: pressing ? .86 : 1 }} exit={{ opacity: 0 }} transition={{ left: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] }, top: { duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] }, scale: { duration: .14 }, opacity: { duration: .14 } }}><HugeiconsIcon icon={Cursor01Icon} size={23} strokeWidth={1.7} /></motion.div>}</AnimatePresence>;
}
