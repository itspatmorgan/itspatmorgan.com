import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { NativeStage } from './NativeStage';
import type { DemoLoop } from './useDemoLoop';
import './project-card.css';

// The frame every project card's visual shares, after the feature cards on Stripe's and Linear's sites. Cards run 330 to 450 px wide, so
// a card is drawn at 400 × 225, close to the size it shows at, so type stays at real UI sizes and lines stay crisp. Two layers, no more:
// one large, simple panel behind (running off the right and bottom edges, which fade) and one small, crisp card in front, placed where
// the panel behind is empty, carrying the one thing to read. Both are built from the case study's real product components.
// A card rests on its last frame, which makes the point on its own, and plays only when hovered: from its first frame (always a
// complete one, nothing blank or hidden) back to that last frame, with no fade. It never starts on its own, so a card half on screen as
// the page loads is never caught mid-animation, and touch devices simply show the last frame. Cards pass a loop made with
// `useDemoLoop(timings, timings.length - 1, false, true)`, which starts on the last step. Reduced motion shows the last frame only.
export const CARD_W = 400;
export const CARD_H = 225;

export function ProjectCardStage({ loop, label, className = '', width = CARD_W, height = CARD_H, children }: { loop: DemoLoop; label: string; className?: string; width?: number; height?: number; children: ReactNode }) {
  // The hover listener is attached once and reads the loop through a ref, so it always sees the current step.
  const latest = useRef(loop);
  latest.current = loop;
  useEffect(() => {
    const card = latest.current.ref.current?.closest('[data-project-card]');
    if (!card) return;
    const replay = () => {
      const current = latest.current;
      if (!current.reduced && current.step === current.count - 1) current.replay();
    };
    card.addEventListener('mouseenter', replay);
    return () => card.removeEventListener('mouseenter', replay);
  }, []);
  return <figure className={`pc ${className}`} ref={loop.ref as RefObject<HTMLElement>} aria-label={label}>
    <NativeStage width={width} height={height} interactive={false}>{children}</NativeStage>
  </figure>;
}
