import { useEffect, useRef, useState } from 'react';
import { ArrowUp02Icon, ArrowUpRight01Icon, CheckmarkCircle02Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
import { icon } from '../studio-case/StudioUI';
import { StudioWindow, useReduced } from './explore/StudioWindow';
import StepBar from './StepBar';

// Sharing comes down to one thing: a link. You ask your agent to publish, it hands back one address, and that address opens the
// Studio in anyone's browser. The demo is those three beats and nothing else, in the page's own controls. The link opens the real
// Studio, the Feedback Inbox sample, at a small scale: the point is the link, but what it opens is the product, never a wireframe. Phones show one beat at a time in the same box: the chat with its link,
// then the browser that link opens, sliding in over it, rather than both stacked into one tall card.
const ASK = 'Publish the Studio to our site';
const LINK = 'design.yourteam.com';
const steps = [
  { label: 'Ask your agent to publish', ms: 2600 },
  { label: 'It hands back one link', ms: 2000 },
  { label: 'Your team opens it in any browser', ms: 3800 },
];


export default function StudioShare() {
  const reduced = useReduced();
  const [step, setStep] = useState(0);
  const [cut, setCut] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  // The first pass opens with the ask already typed, ready to send, so the first frame says what's happening; later passes type it.
  const [typed, setTyped] = useState(ASK.length);
  const [opening, setOpening] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio > 0.4), { threshold: [0, 0.4, 0.8] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const running = playing && visible && !reduced;
  // Type the ask during the first beat; later beats show it whole.
  useEffect(() => {
    if (reduced || step > 0 || opening) { setTyped(ASK.length); return; }
    setTyped(0);
  }, [step, cut, reduced]);
  useEffect(() => {
    if (!running || step !== 0 || typed >= ASK.length) return;
    const t = window.setTimeout(() => setTyped(n => n + 1), 38);
    return () => window.clearTimeout(t);
  }, [running, step, typed]);
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => { setStep(s => (s + 1) % steps.length); setCut(c => c + 1); setOpening(false); }, steps[step].ms);
    return () => window.clearTimeout(t);
  }, [running, step, cut]);
  const shown = reduced ? 2 : step;
  const sent = shown > 0 || typed >= ASK.length;
  return <div ref={ref} className="ps">
    <div data-stage className={`ps-stage ${shown === 2 ? 'is-opened' : ''}`} role="img" aria-label={`You ask your agent to publish the Studio. It replies with one link, ${LINK}, and your team opens that link in any browser to see the prototypes.`}>
      <div className="ps-chat" aria-hidden="true">
        <div className={`ps-composer ${shown > 0 ? 'is-sent' : ''}`}>
          <p>{shown > 0 ? '' : ASK.slice(0, typed)}{shown === 0 && <i className="ps-caret" />}</p>
          <span className={`hx-send ${sent && shown === 0 ? 'is-ready' : ''}`}>{icon(ArrowUp02Icon, 14)}</span>
        </div>
        {shown > 0 && <p className="hx-msg ps-ask">{ASK}</p>}
        {shown > 0 && <p className="ps-reply">{icon(CheckmarkCircle02Icon, 15)}<span>Published. Share this link with your team:</span></p>}
        {shown > 0 && <span className={`ps-link ${shown === 2 ? 'is-opened' : ''}`}>{LINK}{icon(ArrowUpRight01Icon, 14)}</span>}
      </div>
      <div className={`ps-browser ${shown === 2 ? 'is-open' : ''}`} aria-hidden="true">
        <div className="ps-bar"><span><i /><i /><i /></span><em>{icon(SquareLock02Icon, 12)}{LINK}</em></div>
        <StudioWindow shown="inbox" min={0.2} instant className="ps-window" />
      </div>
    </div>
    <StepBar title="sharing" steps={steps} current={shown} done={false} playing={running} cut={cut} reduced={reduced}
      onJump={i => { setStep(i); setCut(c => c + 1); setOpening(false); }} onToggle={() => setPlaying(p => !p)} />
  </div>;
}
