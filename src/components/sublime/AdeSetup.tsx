import { AgentsHub } from './AgentsHub';
import { ART, CheckCircle, Page, VerdictIcon } from './SublimeUI';
import { Camera, Pointer, SceneFrame, Screens, frame, useNarrowLayout, useScene, useShot, useStage, useTargets } from './scene';

// Meeting ADÉ (patrick/mttc agents-hub, AdeOffPage and AdeOffLoop): from the hub, the ADÉ card opens ADÉ's page before it is on, which
// tells the loop and its Time to Coverage. The page's Learn more dialog is left out so the scene stays on the page itself. Copy is the
// source's (AdeOffPage). Liberties taken: the aqua stage behind the loop is redrawn on a neutral surface, and on a phone the loop sits
// below the copy. The hub's figures are the prototype's sample data.
const timings = [1500, 700, 700, 300, 3000, 3400];
const captions = [
  'The Agents hub: ASA and ADÉ, the agents customers work with',
  'Open ADÉ', 'Open ADÉ', 'Open ADÉ',
  'Before it is on, ADÉ’s page shows the loop it runs, and how fast',
  'Before it is on, ADÉ’s page shows the loop it runs, and how fast',
];
const ringR = 132;
const loopTiles = [
  { label: 'Missed threat', mark: 'mail' },
  { label: 'ASA investigates', mark: 'asa' },
  { label: 'ADÉ writes a rule', mark: 'ade' },
  { label: 'Rule goes live', mark: 'live' },
] as const;

/** AdeOffLoop: four marks on a ring, clockwise, the last arc dashed as the loop-back; Time to Coverage in the middle. */
function OffLoop({ narrow }: { narrow: boolean }) {
  const size = 400, c = size / 2, gap = 31;
  const pt = (deg: number) => [c + ringR * Math.sin(deg * Math.PI / 180), c - ringR * Math.cos(deg * Math.PI / 180)];
  const arc = (from: number, to: number) => { const [x1, y1] = pt(from), [x2, y2] = pt(to); return `M${x1} ${y1} A${ringR} ${ringR} 0 0 1 ${x2} ${y2}`; };
  const head = (to: number) => { const [x, y] = pt(to); const a = Math.atan2(-Math.cos((to + 90) * Math.PI / 180), Math.sin((to + 90) * Math.PI / 180)) + Math.PI; const w = (d: number) => `${x + 7 * Math.cos(a + d)} ${y + 7 * Math.sin(a + d)}`; return `M${w(.55)} L${x} ${y} L${w(-.55)}`; };
  return <div className="sb-loop" data-frame="off-loop" style={narrow ? { borderRadius: 0, boxShadow: 'none' } : undefined} role="img" aria-label="The loop: a message your rules missed goes to ASA, then ADÉ, then a new rule goes live, and the loop closes so the next similar threat is caught. Time to Coverage is under 2 hours.">
    <svg width={size} height={size} aria-hidden="true" style={{ position: 'absolute', inset: 0 }}><g fill="none" stroke="var(--sb-weak)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {[0, 1, 2, 3].map(i => <g key={i} className="sb-loop-arc" style={{ animationDelay: `${.25 + i * .18}s` }}><path d={arc(i * 90 + gap, i * 90 + 90 - gap)} strokeDasharray={i === 3 ? '4 4' : undefined} /><path d={head(i * 90 + 90 - gap)} /></g>)}
    </g></svg>
    <div className="sb-loop-center"><b>&lt;2 hrs</b><span className="sb-label">Time to Coverage</span></div>
    {loopTiles.map((tile, i) => { const [x, y] = pt(i * 90); return <div key={tile.label} className="sb-loop-tile" style={{ left: x - 58, top: y - 56, animationDelay: `${i * .12}s` }}>
      <span className="sb-loop-mark">{tile.mark === 'mail' ? <span className="sb-disc"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M3 5.5l7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg><i><VerdictIcon verdict="malicious" size={15} /></i></span>
        : tile.mark === 'live' ? <CheckCircle size={40} color="var(--sb-success)" />
        : <img src={tile.mark === 'asa' ? ART.asa : ART.ade} alt="" draggable={false} className="sb-art" style={{ height: 50 }} />}</span>
      <span className="sb-loop-label">{tile.label}</span>
    </div>; })}
  </div>;
}

/** AdeOffPage: ADÉ's page before it is on, copy and actions beside the loop. */
function OffPage({ height }: { height: number }) {
  const narrow = useNarrowLayout();
  return <Page crumbs={['Agents', 'ADÉ']} style={narrow
    ? { display: 'flex', flexDirection: 'column', gap: 28, padding: '24px 0 0' }
    : { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, minHeight: height - 48, padding: '0 40px' }}>
    <div style={{ display: 'grid', gap: narrow ? 20 : 28, width: 400, padding: narrow ? '0 16px' : undefined, boxSizing: 'border-box' }}>
      <p style={{ fontSize: narrow ? 22 : 26, fontWeight: 600, lineHeight: narrow ? '29px' : '34px', letterSpacing: '-.3px' }}>ADÉ turns missed threats into new coverage</p>
      <div className="sb-body" style={{ display: 'grid', gap: 14, lineHeight: '22px' }}>
        <p>ADÉ is your Autonomous Detection Engineer.</p>
        <p>When a threat gets past your detection rules, ADÉ writes and tests a new rule recommended for your environment.</p>
        <p>On average, that takes <b style={{ fontWeight: 600 }}>under 2 hours</b>.</p>
        <p>You stay in control. Review every recommendation, or turn on auto-accept when you’re ready.</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}><span className="sb-btn" data-target="setup">Set up ADÉ</span><span className="sb-btn is-ghost">Learn more</span></div>
    </div>
    <OffLoop narrow={narrow} />
  </Page>;
}

/** Meeting ADÉ before turning it on. */
export default function AdeSetup() {
  const scene = useScene(timings, captions);
  // The hub and ADÉ's page both end, so the card sits whole on the stage; at 1060 px they render at their true size.
  const stage = useStage({ wide: 1060, height: 840, contained: true });
  const narrow = stage.narrow;
  const step = scene.step;
  const hub = step <= 3;
  // Each screen has its own camera, so arriving on ADÉ's page never rides a scroll from the hub. On a phone: scroll to the ADÉ card
  // before the pointer reaches for it, and on ADÉ's page, from the copy down to the loop.
  const tHub = useTargets(step, narrow);
  const tOff = useTargets(step, narrow);
  const hubShot = narrow && step >= 1 ? 'card-ade' : null;
  const hubView = useShot(hubShot, hubShot ? frame(tHub.rect(hubShot), { ...stage.box, bottom: tHub.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  const offShot = narrow && step === 5 ? 'off-loop' : null;
  const offView = useShot(offShot, offShot ? frame(tOff.rect(offShot), { ...stage.box, bottom: tOff.height }, { scale: 1, pad: 0, y: 'center' }) : null);
  const pointer = step === 2 || step === 3 || (!narrow && step === 1) ? { key: 'card-ade', pressing: step === 3 } : null;
  return <SceneFrame scene={scene} stage={stage} title="the ADÉ introduction" label="From the Agents hub, the ADÉ card opens ADÉ's page before it is on: ADÉ turns missed threats into new coverage, in under 2 hours on average, shown as a loop from a missed threat through ASA and ADÉ to a live rule. Set up ADÉ sits beside Learn more">
    <Screens id={hub ? 'hub' : 'ade'}>
      {hub
        ? <Camera view={hubView} width={stage.W} height={stage.box.height} cameraRef={tHub.ref} reduced={scene.reduced}>
            <AgentsHub hover={step >= 2 ? 'ade' : null} pressed={step === 3} />
            <Pointer at={pointer ? tHub.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
          </Camera>
        : <Camera view={offView} width={stage.W} height={stage.box.height} cameraRef={tOff.ref} reduced={scene.reduced}>
            <OffPage height={stage.box.height} />
          </Camera>}
    </Screens>
  </SceneFrame>;
}
