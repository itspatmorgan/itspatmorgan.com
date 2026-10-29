import { NativeStage } from '../case-study/NativeStage';
import { AgentsHub } from './HeroAgents';
import { ART, CheckCircle, Page, VerdictIcon, Zoom } from './SublimeUI';
import { Pointer, SceneControls, Screens, useScene, useTargets } from './scene';

// Meeting ADÉ (patrick/mttc agents-hub, AdeOffPage and AdeOffLoop): from the hub, the ADÉ card opens ADÉ's page before it is on, which
// tells the loop and its Time to Coverage. The page's Learn more dialog is left out so the scene stays on the page itself. Copy is the
// source's (AdeOffPage). Liberty taken: the aqua stage behind the loop is redrawn on a neutral surface.
const W = 1000;
const timings = [1100, 900, 300, 3600, 3400];
const captions = ['The Agents hub', 'Open ADÉ', 'Open ADÉ', 'ADÉ’s page before it is on: the loop, and under 2 hours to coverage', 'Set up ADÉ when you are ready'];
const ringR = 132;
const loopTiles = [
  { label: 'Missed threat', mark: 'mail' },
  { label: 'ASA investigates', mark: 'asa' },
  { label: 'ADÉ writes a rule', mark: 'ade' },
  { label: 'Rule goes live', mark: 'live' },
] as const;

/** AdeOffLoop: four marks on a ring, clockwise, the last arc dashed as the loop-back; Time to Coverage in the middle. */
function OffLoop() {
  const size = 400, c = size / 2, gap = 31;
  const pt = (deg: number) => [c + ringR * Math.sin(deg * Math.PI / 180), c - ringR * Math.cos(deg * Math.PI / 180)];
  const arc = (from: number, to: number) => { const [x1, y1] = pt(from), [x2, y2] = pt(to); return `M${x1} ${y1} A${ringR} ${ringR} 0 0 1 ${x2} ${y2}`; };
  const head = (to: number) => { const [x, y] = pt(to); const a = Math.atan2(-Math.cos((to + 90) * Math.PI / 180), Math.sin((to + 90) * Math.PI / 180)) + Math.PI; const w = (d: number) => `${x + 7 * Math.cos(a + d)} ${y + 7 * Math.sin(a + d)}`; return `M${w(.55)} L${x} ${y} L${w(-.55)}`; };
  return <div className="sb-loop" role="img" aria-label="The loop: a message your rules missed goes to ASA, then ADÉ, then a new rule goes live, and the loop closes so the next similar threat is caught. Time to Coverage is under 2 hours.">
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
function OffPage() {
  return <Page crumbs={['Agents', 'ADÉ']} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, minHeight: 760, padding: '0 40px' }}>
    <div style={{ display: 'grid', gap: 28, width: 400 }}>
      <p style={{ fontSize: 26, fontWeight: 600, lineHeight: '34px', letterSpacing: '-.3px' }}>ADÉ turns missed threats into new coverage</p>
      <div className="sb-body" style={{ display: 'grid', gap: 14, lineHeight: '22px' }}>
        <p>ADÉ is your Autonomous Detection Engineer.</p>
        <p>When a threat gets past your detection rules, ADÉ writes and tests a new rule recommended for your environment.</p>
        <p>On average, that takes <b style={{ fontWeight: 600 }}>under 2 hours</b>.</p>
        <p>You stay in control. Review every recommendation, or turn on auto-accept when you’re ready.</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}><span className="sb-btn" data-target="setup">Set up ADÉ</span><span className="sb-btn is-ghost">Learn more</span></div>
    </div>
    <OffLoop />
  </Page>;
}

/** Meeting ADÉ before turning it on. */
export default function AdeSetup() {
  const scene = useScene(timings);
  const step = scene.step;
  const t = useTargets(step);
  const pointer = step === 1 || step === 2 ? { key: 'card-ade', pressing: step === 2 } : step === 4 ? { key: 'setup' } : null;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="From the Agents hub, the ADÉ card opens ADÉ's page before it is on: ADÉ turns missed threats into new coverage, in under 2 hours on average, shown as a loop from a missed threat through ASA and ADÉ to a live rule. Set up ADÉ sits beside Learn more">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <div ref={t.ref} style={{ position: 'relative' }}>
            <Screens id={step <= 2 ? 'hub' : 'ade'}>
              {step <= 2 ? <AgentsHub hover={step >= 1 ? 'ade' : null} pressed={step === 2} /> : <OffPage />}
            </Screens>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the ADÉ introduction" caption={captions[step]} />
  </figure>;
}
