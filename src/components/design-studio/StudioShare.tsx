import { useEffect, useRef, useState } from 'react';
import { CheckmarkCircle02Icon, Link01Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
import { Avatar, icon } from '../studio-case/StudioUI';
import { StudioWindow, useReduced } from './explore/StudioWindow';

// A published Studio, open in a teammate's browser: the same prototype view, at a link the team keeps. The address is the point here,
// so it is spelled out, with the people viewing it and the copy button beside it. The button shows the link being copied now and then.
export default function StudioShare() {
  const [copied, setCopied] = useState(false);
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: .4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (reduced || !visible) { setCopied(false); return; }
    const timer = window.setTimeout(() => setCopied(c => !c), copied ? 1800 : 3200);
    return () => window.clearTimeout(timer);
  }, [copied, reduced, visible]);
  return <div ref={ref} className="sh" aria-label="A published Design Studio open in the browser at your team's own link, with teammates viewing it" role="img">
    <div className="sh-window" aria-hidden="true">
      <div className="hx-browser-bar sh-bar">
        <span className="hx-agent-dots"><i /><i /><i /></span>
        <span className="sh-url">{icon(SquareLock02Icon, 14)}<span>design.yourteam.com<span className="sh-path">/prototypes/feedback-inbox</span></span></span>
        <span className="sh-viewers"><Avatar name="Patrick" /><Avatar name="Maya" /><Avatar name="Leo" /></span>
        <span className={`sh-copy ${copied ? 'is-done' : ''}`}>{icon(copied ? CheckmarkCircle02Icon : Link01Icon, 14)}{copied ? 'Link copied' : 'Copy link'}</span>
      </div>
      <div className="sh-view"><StudioWindow shown="inbox" min={0.6} crop="pane" /></div>
    </div>
  </div>;
}
