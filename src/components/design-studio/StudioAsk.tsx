import { useEffect, useRef, useState } from 'react';
import { ArrowUp02Icon, ArrowLeft01Icon, ArrowRight01Icon, Comment01Icon, CursorMagicSelection02Icon, Refresh01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { icon } from '../studio-case/StudioUI';
import { agentHarnesses } from '../../data/design-studio-setup';
import { SIDE, StudioWindow, W, useReduced, type Key } from './explore/StudioWindow';
import StepBar from './StepBar';
import { usePhone } from '../case-study/scene';
import './studio-hero.css';

// How you work in Design Studio: in the coding agent you already use. On the left, a conversation in that agent; on the right, the
// Studio rendering what each message makes. Each request writes or changes a file in the Feedback Inbox sample
// (src/prototypes/parker/feedback-inbox), and the Studio opens it. The chat is a neutral harness, not any one product's interface.
//
// Phones keep the same window, chat beside browser, at a fixed 780 x 520 in a square frame, and pan between the two at one scale: the
// chat (with the browser's edge beside it) while a request is typed and worked on, then across to the whole browser as the result
// lands. Stacking the chat over the browser would show a coding agent that no one uses.
const PHONE_W = 780, PHONE_H = 520, PHONE_RATIO = 1;

type Turn = { ask: string; did: string; file: string; key: Key; lofi?: boolean };
const MIN = 0.5;
const turns: Turn[] = [
  { ask: 'Write up the problem and open questions for a feedback inbox for Echo', did: 'Created', file: 'discovery/project-context.md', key: 'context' },
  { ask: 'Map how feedback moves from recorded to resolved', did: 'Created', file: 'discovery/feedback-flow.mermaid', key: 'flow' },
  { ask: 'Sketch the inbox as a lo-fi screen so we can settle the layout', did: 'Created', file: 'app/feedback-inbox.tsx', key: 'inbox', lofi: true },
  { ask: 'Make it hi-fi with our Product system', did: 'Marked hi-fi', file: 'app/feedback-inbox.tsx', key: 'inbox' },
  { ask: 'Lay out every screen and state on a canvas for engineering', did: 'Created', file: 'eng-handoff.excalidraw', key: 'handoff' },
];

// One turn: type the message (its length decides how long), send it, work, report, then hold on the result.
const TYPE_MS = 26, WORK_MS = 1100, HOLD_MS = 2600;
type Phase = 'typing' | 'working' | 'done';
// Each message's segment fills over its whole turn: typing, the send pause, the work, and the hold (the last one holds a little longer).
const steps = turns.map((t, i) => ({ label: t.ask, ms: Math.ceil(t.ask.length / 2) * TYPE_MS * 2 + 380 + WORK_MS + HOLD_MS + (i === turns.length - 1 ? 800 : 0) }));

export default function StudioAsk() {
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [typed, setTyped] = useState(0);
  const [fading, setFading] = useState(false);
  const [cut, setCut] = useState(0);
  // The browser view's size: the Studio scales to its width and stretches its own height to fill it, so nothing is left blank.
  const view = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 700, h: 480 });
  useEffect(() => {
    const el = view.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(1, Math.max(MIN, size.w / (W - SIDE)));
  const phone = usePhone();
  const cam = useRef<HTMLDivElement>(null);
  const [camW, setCamW] = useState(0);
  useEffect(() => {
    const el = cam.current;
    if (!el || !phone) return;
    const ro = new ResizeObserver(([e]) => setCamW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [phone]);
  const goTo = (i: number) => { setTurn(i); setTyped(0); setPhase('typing'); setFading(false); setCut(n => n + 1); };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio > 0.3), { threshold: [0, 0.3, 0.6] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion: the whole conversation, with its last result.
  useEffect(() => { if (reduced) { setTurn(turns.length - 1); setPhase('done'); } }, [reduced]);

  useEffect(() => {
    if (reduced || !visible || !playing) return;
    const ask = turns[turn].ask;
    let timer = 0;
    if (phase === 'typing') {
      if (typed < ask.length) timer = window.setTimeout(() => setTyped(n => Math.min(ask.length, n + 2)), TYPE_MS * 2);
      else timer = window.setTimeout(() => setPhase('working'), 380);
    } else if (phase === 'working') {
      timer = window.setTimeout(() => setPhase('done'), WORK_MS);
    } else if (turn < turns.length - 1) {
      timer = window.setTimeout(() => goTo(turn + 1), HOLD_MS);
    } else {
      // The end: hold, fade the conversation out, and start it again from an empty thread.
      timer = window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => goTo(0), 420);
      }, HOLD_MS + 800);
    }
    return () => window.clearTimeout(timer);
  }, [reduced, visible, playing, turn, phase, typed]);

  // The newest message stays in view, as in any chat.
  useEffect(() => { const t = thread.current; if (t) t.scrollTo({ top: t.scrollHeight, behavior: reduced ? 'auto' : 'smooth' }); }, [turn, phase, reduced]);

  // What the Studio shows: the last finished turn's file (before the first one finishes, the Studio's empty prototype).
  const shownTurn = phase === 'done' ? turn : turn - 1;
  const shown = shownTurn >= 0 ? turns[shownTurn] : null;
  const sent = turns.slice(0, phase === 'typing' ? turn : turn + 1);
  const draft = phase === 'typing' ? turns[turn].ask.slice(0, typed) : '';
  // The phone camera: the whole window's height, panned to the chat or to the browser pane at the right edge.
  const onBrowser = reduced || phase === 'done';
  const k = camW * PHONE_RATIO / PHONE_H;
  const camStyle = phone && camW ? { transform: `scale(${k}) translateX(${onBrowser ? camW / k - PHONE_W : 0}px)` } : undefined;
  return <div className="hx-ask-wrap" ref={ref}>
  <div className={`hx-cam ${phone && camW ? 'is-ready' : ''}`} ref={cam}>
  <div className={`hx-agent ${fading ? 'is-fading' : ''}`} style={camStyle}>
    <header className="hx-agent-bar">
      <span className="hx-agent-dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="hx-agent-name">Your coding agent</span>
      <span className="hx-chat-agents">{agentHarnesses.map(h => <span key={h.title} className="dx-logo" title={h.title} style={{ ['--logo' as string]: `url(${h.logo})` }} />)}</span>
    </header>
    <div className="hx-agent-body">
      <div className="hx-chat">
        <div className="hx-thread" ref={thread} aria-live="polite">
          {sent.map((t, i) => <div key={i} className="hx-turn">
            <p className="hx-msg">{t.ask}</p>
            {i < turn || phase === 'done'
              ? <p className="hx-reply">{icon(Tick02Icon, 14)}<span>{t.did} <code>{t.file}</code></span></p>
              : <p className="hx-reply is-working"><i /><span>Working in <code>{t.file.split('/')[0]}</code></span></p>}
          </div>)}
        </div>
        <div className="hx-composer">
          <p className={draft ? '' : 'is-empty'}>{draft || 'Ask for a screen, a flow, a doc…'}{draft && <span className="dx-caret" aria-hidden="true" />}</p>
          <span className={`hx-send ${draft ? 'is-ready' : ''}`} aria-hidden="true">{icon(ArrowUp02Icon, 14)}</span>
        </div>
      </div>
      <div className="hx-browser">
        <div className="hx-browser-bar" aria-hidden="true">
          <span className="hx-browser-nav">{icon(ArrowLeft01Icon, 15)}{icon(ArrowRight01Icon, 15)}{icon(Refresh01Icon, 14)}</span>
          <span className="hx-url"><i /></span>
          {/* The agent browser's own review tools: pick an element to give design feedback on, and leave comments. */}
          <span className="hx-browser-tools">{icon(CursorMagicSelection02Icon, 15)}{icon(Comment01Icon, 15)}</span>
        </div>
        <div className="hx-browser-view" ref={view}>
          <StudioWindow shown={shown?.key ?? 'inbox'} fidelity={shown?.lofi ? 0 : 1} min={MIN} side={false} height={size.h / scale} className={`hx-ask-window ${shown ? '' : 'is-empty'}`} />
        </div>
      </div>
    </div>
  </div>
  </div>
  <StepBar title="the conversation" steps={steps} current={turn} done={false} playing={playing && visible && !reduced} cut={cut} reduced={reduced}
    onJump={i => { goTo(i); setPlaying(true); }} onToggle={() => setPlaying(p => !p)} />
  </div>;
}
