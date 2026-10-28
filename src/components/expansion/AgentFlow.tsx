import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { NativeStage, DemoControls } from '../query-builder/NativeUI';
import { useDemoLoop } from '../query-builder/useDemoLoop';

// The Agent Processing section as one live diagram: the source's twelve 1920 × 1500 frames (001–005, 100–102, 200–202, 000)
// become steps, and each element moves, stretches or fades between its positions in those frames.
type State = { title: ReactNode; caption: string; agent: 0 | 1 | 2 | 3; top: number; bottom: number; bold?: boolean };
const states: State[] = [
  { title: 'Requests enter', caption: 'A request travels from the client to the server', agent: 0, top: 0, bottom: 0 },
  { title: 'Responses flow back', caption: 'The response travels back to the client', agent: 0, top: 0, bottom: 0 },
  { title: 'Agent intercepts both sides', caption: 'The agent sits between client and server', agent: 1, top: 0, bottom: 0 },
  { title: 'Agent phases', caption: 'The agent works in pre and post phases', agent: 2, top: 0, bottom: 0 },
  { title: 'Agent sub-phases', caption: 'Each phase has early, main and late steps', agent: 3, top: 0, bottom: 0 },
  { title: <>Collect <b>incoming</b> data</>, caption: 'A collector sends incoming data out', agent: 3, top: 1, bottom: 0 },
  { title: <>Collect <b>incoming</b> data</>, caption: 'Incoming data goes to the cloud', agent: 3, top: 2, bottom: 0 },
  { title: <>Collect <b>incoming</b> data</>, caption: 'Data also flows back from the cloud', agent: 3, top: 3, bottom: 0 },
  { title: <>Collect <b>outgoing</b> data</>, caption: 'A second collector sends outgoing data out', agent: 3, top: 3, bottom: 1 },
  { title: <>Collect <b>outgoing</b> data</>, caption: 'Outgoing data goes to the cloud', agent: 3, top: 3, bottom: 2 },
  { title: <>Collect <b>outgoing</b> data</>, caption: 'Data also flows back on the way out', agent: 3, top: 3, bottom: 3 },
  { title: 'Agent processing flow', caption: 'The full agent processing flow', agent: 3, top: 3, bottom: 3, bold: true },
];
const timings = states.map((_, i) => (i === states.length - 1 ? 4200 : 2000));
// Titles that repeat across steps share one element, so they hold still instead of crossfading into themselves.
const titles = [0, 1, 2, 3, 4, 5, 5, 5, 8, 8, 8, 11];

const show = (on: boolean, extra: CSSProperties = {}): CSSProperties => ({ opacity: on ? 1 : 0, ...extra });
// 5px connector segments and 24px arrowheads, as divs so their lengths and positions can transition.
const h = (x1: number, x2: number, y: number, style?: CSSProperties) => <i className="xp-seg" style={{ left: Math.min(x1, x2), width: Math.abs(x2 - x1), top: y - 2.5, height: 5, ...style }} />;
const v = (x: number, y1: number, y2: number, style?: CSSProperties) => <i className="xp-seg" style={{ left: x - 2.5, width: 5, top: Math.min(y1, y2), height: Math.abs(y2 - y1), ...style }} />;
const head = (x: number, y: number, dir: 'right' | 'left' | 'up' | 'down', style?: CSSProperties) => {
  const at = { right: [x - 24, y - 12], left: [x, y - 12], up: [x - 12, y], down: [x - 12, y - 24] }[dir];
  return <i className={`xp-head is-${dir}`} style={{ left: at[0], top: at[1], ...style }} />;
};

function Cloud({ x, y, on }: { x: number; y: number; on: boolean }) {
  return <div className="xp-cloud xp-pop" style={show(on, { left: x, top: y, transform: on ? 'none' : 'scale(.92)' })}>
    <i style={{ left: 42, top: 24, width: 75, height: 75 }} /><i style={{ left: 89, top: -4, width: 150, height: 150 }} /><i style={{ left: 0, top: 43, width: 271, height: 112 }} /><span>Cloud</span>
  </div>;
}

// Dashed collector lines at 45°; they draw outward from their start.
function Dashed({ from, to, color, on }: { from: [number, number]; to: [number, number]; color: string; on: boolean }) {
  const [x1, y1] = from; const [x2, y2] = to;
  const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
  const bx = x2 - dx * 14, by = y2 - dy * 14;
  const length = Math.hypot(bx - x1, by - y1);
  return <g className="xp-draw" style={{ opacity: on ? 1 : 0 }}>
    <mask id={`m${x1}${y1}`}><line x1={x1} y1={y1} x2={bx} y2={by} stroke="#fff" strokeWidth={9} strokeDasharray={length} strokeDashoffset={on ? 0 : length} className="xp-draw" /></mask>
    <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={5} strokeDasharray="14 10" mask={`url(#m${x1}${y1})`} />
    <polygon fill={color} points={`${x2},${y2} ${bx - dy * 10},${by + dx * 10} ${bx + dy * 10},${by - dx * 10}`} />
  </g>;
}

const chip = (text: string, left: number, main: boolean, style: CSSProperties = {}) => <span className={`xp-chip ${main ? 'is-main' : ''}`} style={{ position: 'absolute', top: 20, left, ...style }}>{text}</span>;

/** How a request moved through the agent, and where data was collected on each side. */
export default function AgentFlow() {
  const loop = useDemoLoop(timings, states.length - 1);
  // On restart the stage has faded out; jump to the first frame without transitions, then let later steps animate.
  const [jump, setJump] = useState(false);
  useLayoutEffect(() => {
    if (loop.step !== 0) return;
    setJump(true);
    let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setJump(false)); });
    return () => cancelAnimationFrame(frame);
  }, [loop.step]);
  const s = states[loop.step];
  const wide = s.agent === 0;
  const responded = loop.step > 0;
  const phases = s.agent >= 2, full = s.agent === 3;
  // Connector ends from the source: they meet the message boxes before the agent exists, and the agent after.
  const inEnd = wide ? 833 : 650, outStart = wide ? 1090 : 1263;
  return <figure className={`qb-demo xp-agent-flow ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="The Signal Sciences agent processing flow: requests and responses pass through the agent's pre and post phases, and collectors send data to the cloud">
    <NativeStage width={1240} height={900}><div className="xp-card"><div className="xp-agent-fit">
      <div className={`xp-agent xp-live ${jump ? 'is-jump' : ''}`}>
        {titles.map((t, i) => titles.indexOf(t) === i && <div key={i} className="xp-script" style={show(titles[loop.step] === t, { fontWeight: states[t].bold ? 700 : 400 })} aria-hidden={titles[loop.step] !== t}>{states[t].title}</div>)}

        {/* Request path, then the response path. */}
        {v(200, 591, 673)}{h(197.5, inEnd - 24, 591)}{head(inEnd, 591, 'right')}
        {h(outStart, 1715.5, 591)}{v(1713, 591, 649)}{head(1713, 673, 'down')}
        {v(1713, 857, 941.5, show(responded))}{h(outStart + 24, 1715.5, 939, show(responded))}{head(outStart, 939, 'left', show(responded))}
        {h(197.5, inEnd, 939, show(responded))}{v(200, 881, 941.5, show(responded))}{head(200, 857, 'up', show(responded))}

        <div className="xp-box xp-node" style={{ left: 113, top: 709, width: 174, height: 112 }}>Client</div>
        <div className="xp-box xp-node" style={{ left: 1619, top: 709, width: 188, height: 112 }}>Server</div>
        <div className="xp-box xp-msg" style={{ left: wide ? 853 : 313, top: 555.5, width: 214, height: 71 }}>Request</div>
        <div className="xp-box xp-msg" style={show(responded, { left: wide ? 853 : 1394, top: 904, width: wide ? 214 : 239, height: 71 })}>Response</div>

        <div className="xp-box xp-container xp-pop" style={show(s.agent > 0, { left: 689, top: 500, width: 542, height: 500, transform: s.agent > 0 ? 'none' : 'scale(.96)' })}>
          <span style={{ position: 'absolute', left: phases ? 154 : 215, top: phases ? 233 : 225 }}>Agent</span>
          <div className="xp-phase" style={show(phases, { left: 283, top: 216, width: 100, height: 83 })}>{chip('Init', 16, true)}</div>
          <span className="xp-label" style={show(full, { left: 244, top: 20 })}>Pre</span>
          <div className="xp-phase" style={show(phases, { left: 20, top: full ? 67 : 47, width: 502, height: 83 })}>
            {chip('Pre-early', 16, false, show(full))}{chip('Pre', full ? 220 : 216, true)}{chip('Pre-Late', 354, false, show(full))}
          </div>
          <span className="xp-label" style={show(full, { left: 235, top: 347 })}>Post</span>
          <div className="xp-phase" style={show(phases, { left: 20, top: full ? 397 : 390, width: full ? 505 : 502, height: 83 })}>
            {chip('Post-Late', 16, false, show(full))}{chip('Post', full ? 207 : 209.5, true)}{chip('Post-early', 336, false, show(full))}
          </div>
        </div>

        <svg viewBox="0 0 1920 1500" width={1920} height={1500} aria-hidden="true">
          <Dashed from={[1158, 456]} to={[1335, 279]} color="var(--x-blue)" on={s.top > 0} />
          <Dashed from={[1409, 279]} to={[1232, 456]} color="var(--x-orange)" on={s.top > 2} />
          <Dashed from={[758, 1032]} to={[581, 1209]} color="var(--x-blue)" on={s.bottom > 0} />
          <Dashed from={[503, 1209]} to={[680, 1032]} color="var(--x-yellow)" on={s.bottom > 2} />
        </svg>
        <span className="xp-collector" style={show(s.top > 0, { left: 1164, top: 324 })}>Collector</span>
        <span className="xp-collector" style={show(s.bottom > 0, { left: 652, top: 1123 })}>Collector</span>
        <Cloud x={1254} y={93} on={s.top > 1} />
        <Cloud x={342} y={1236} on={s.bottom > 1} />
      </div>
    </div></div></NativeStage>
    <DemoControls loop={loop} title="agent processing flow" caption={s.caption} />
  </figure>;
}
