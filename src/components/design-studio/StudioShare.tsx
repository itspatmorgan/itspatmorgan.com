import { useEffect, useRef, useState } from 'react';
import { ArrowUp02Icon, ArrowUpRight01Icon, CheckmarkCircle02Icon, SquareLock02Icon } from '@hugeicons/core-free-icons';
import { icon } from '../studio-case/StudioUI';
import { useReduced } from './explore/StudioWindow';
import StepBar from './StepBar';

// Sharing comes down to one thing: a link. You ask your agent to publish, it hands back one address, and that address opens the
// Studio in anyone's browser. The demo is those three beats and nothing else, in the page's own controls. The Studio is drawn as a
// wireframe: the point is the link, not what's behind it.
const ASK = 'Publish the Studio to our site';
const LINK = 'design.yourteam.com';
const steps = [
  { label: 'Ask your agent to publish', ms: 2600 },
  { label: 'It hands back one link', ms: 2000 },
  { label: 'Your team opens it in any browser', ms: 3800 },
];

const Page = () => <div className="ps-page">
  <i className="ps-side" />
  <div className="ps-main"><b /><i /><i /><span><i /><i /><i /></span><i /><i /></div>
</div>;

export default function StudioShare() {
  const reduced = useReduced();
  const [step, setStep] = useState(0);
  const [cut, setCut] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState(0);
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
    if (reduced || step > 0) { setTyped(ASK.length); return; }
    setTyped(0);
  }, [step, cut, reduced]);
  useEffect(() => {
    if (!running || step !== 0 || typed >= ASK.length) return;
    const t = window.setTimeout(() => setTyped(n => n + 1), 38);
    return () => window.clearTimeout(t);
  }, [running, step, typed]);
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => { setStep(s => (s + 1) % steps.length); setCut(c => c + 1); }, steps[step].ms);
    return () => window.clearTimeout(t);
  }, [running, step, cut]);
  const shown = reduced ? 2 : step;
  const sent = shown > 0 || typed >= ASK.length;
  return <div ref={ref} className="ps">
    <div className="ps-stage" role="img" aria-label={`You ask your agent to publish the Studio. It replies with one link, ${LINK}, and your team opens that link in any browser to see the prototypes.`}>
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
        <Page />
      </div>
    </div>
    <StepBar title="sharing" steps={steps} current={shown} done={false} playing={running} cut={cut} reduced={reduced}
      onJump={i => { setStep(i); setCut(c => c + 1); }} onToggle={() => setPlaying(p => !p)} />
  </div>;
}
