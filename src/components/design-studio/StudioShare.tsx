import { useEffect, useRef, useState } from 'react';
import { CheckmarkCircle02Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
import { icon } from '../studio-case/StudioUI';
import { StudioWindow, useReduced } from './explore/StudioWindow';

// Publishing, as it works: your agent builds the Studio as a static website and puts it on your host. Your team opens the link in a
// browser and reads the prototypes and docs; nobody edits there, and there is nothing live between viewers. So the picture is a
// plain browser at the team's link, with the agent's own report of the publish beside it, and a "Published" stamp in place of any
// presence or share controls.
export default function StudioShare() {
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: .5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`sh ${shown || reduced ? 'is-shown' : ''}`} role="img"
    aria-label="Your agent publishes the Studio as a static website. Your team opens it in the browser at your own link, read only">
    <div className="sh-window" aria-hidden="true">
      <div className="hx-browser-bar sh-bar">
        <span className="hx-agent-dots"><i /><i /><i /></span>
        <span className="sh-url">{icon(SquareLock02Icon, 14)}<span>design.yourteam.com<span className="sh-path">/prototypes/feedback-inbox</span></span></span>
        <span className="sh-stamp">Published Oct 31</span>
      </div>
      <div className="sh-view"><StudioWindow shown="inbox" min={0.6} crop="pane" /></div>
    </div>
    <div className="sh-report" aria-hidden="true">
      <p className="hx-msg">Publish the Studio to our site</p>
      <p className="hx-reply">{icon(CheckmarkCircle02Icon, 14)}<span>Built a static site and published it to <code>design.yourteam.com</code>. Your team can open it in any browser.</span></p>
    </div>
  </div>;
}
