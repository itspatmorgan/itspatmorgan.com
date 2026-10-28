import { AnimatePresence, motion } from 'motion/react';
import { NativeStage } from '../case-study/NativeStage';
import { AgentsHub } from './HeroAgents';
import { ART, CheckCircle, Icon, Page, VerdictIcon, Zoom } from './SublimeUI';
import { Pointer, SceneControls, Screens, useScene, useTargets } from './scene';

// Meeting ADÉ (patrick/mttc agents-hub, AdeOffPage, AdeOffLoop and AdeEducationDialog): from the hub, the ADÉ card opens ADÉ's page before
// it is on, which tells the loop and its Time to Coverage; Learn more opens How ADÉ works, which leads to settings. Copy is the source's
// (AdeOffPage, AdeEducationUnified). Liberty taken: the aqua stages behind the loop and the dialog's shots are redrawn on neutral surfaces.
const W = 1000;
const timings = [1100, 900, 300, 2800, 800, 300, 3000, 800, 300, 3400, 3000];
const captions = ['The Agents hub', 'Open ADÉ', 'Open ADÉ', 'ADÉ’s page before it is on: the loop, and under 2 hours to coverage', 'Learn more', 'Learn more', 'How ADÉ works: what it does', 'What you control', 'What you control', 'You start in control and add autonomy when you are ready', 'Go to ADÉ settings, where ADÉ is turned on at the level you choose'];
const tabs = [
  { id: 'how', nav: 'What ADÉ does', title: 'ADÉ turns a missed threat into new coverage', lead: 'When a threat gets past your detection rules, ADÉ builds a rule to catch it. On average, that takes under 2 hours.' },
  { id: 'control', nav: 'What you control', title: 'You decide how much ADÉ does on its own', lead: 'You start in control and add autonomy when you are ready.' },
  { id: 'measure', nav: 'How it’s measured', title: '', lead: '' },
];
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
function OffPage({ learnPressed }: { learnPressed: boolean }) {
  return <Page crumbs={['Agents', 'ADÉ']} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 56, minHeight: 760, padding: '0 40px' }}>
    <div style={{ display: 'grid', gap: 28, width: 400 }}>
      <p style={{ fontSize: 26, fontWeight: 600, lineHeight: '34px', letterSpacing: '-.3px' }}>ADÉ turns missed threats into new coverage</p>
      <div className="sb-body" style={{ display: 'grid', gap: 14, lineHeight: '22px' }}>
        <p>ADÉ is your Autonomous Detection Engineer.</p>
        <p>When a threat gets past your detection rules, ADÉ writes and tests a new rule recommended for your environment.</p>
        <p>On average, that takes <b style={{ fontWeight: 600 }}>under 2 hours</b>.</p>
        <p>You stay in control. Review every recommendation, or turn on auto-accept when you’re ready.</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}><span className="sb-btn">Set up ADÉ</span><span className={`sb-btn is-ghost ${learnPressed ? 'is-pressed' : ''}`} data-target="learn">Learn more</span></div>
    </div>
    <OffLoop />
  </Page>;
}

const loop = [
  { title: 'A threat gets through', body: 'A message your rules missed is sent to ADÉ.' },
  { title: 'ASA analyzes it', body: 'ASA gives ADÉ the context to draft a strong rule.' },
  { title: 'ADÉ writes and tests a rule', body: 'ADÉ drafts, tests and revises until the rule is ready.' },
  { title: 'The rule goes live', body: 'Once accepted, the rule catches similar threats.' },
];
const levels = [
  { title: 'Manual', body: 'You choose which missed threats to send to ADÉ, and you accept or reject every recommendation.', who: ['You', 'ADÉ', 'You'] },
  { title: 'Auto-start', body: 'ADÉ starts on missed threats by itself. You still accept or reject every recommendation.', who: ['ADÉ', 'ADÉ', 'You'] },
  { title: 'Auto-accept', body: 'ADÉ also accepts recommendations that meet the threshold you set, so rules go live without waiting for you.', who: ['ADÉ', 'ADÉ', 'ADÉ'] },
];

function LoopPicture() {
  return <div style={{ display: 'grid', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      {loop.map((s, i) => <motion.div key={s.title} className="sb-shot" initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .12 + i * .09, duration: .45, ease: [.23, 1, .32, 1] }}>
        <div className="sb-shot-art">
          {i === 0 && <div className="sb-mini-mail"><span className="sb-label" style={{ fontSize: 10 }}>notify@share-mail.net</span><b>Shared file for review</b><span className="sb-chip" style={{ height: 18, fontSize: 10, width: 'fit-content' }}>No rule matched</span></div>}
          {i === 1 && <div style={{ display: 'grid', justifyItems: 'center', gap: 6 }}><img src={ART.asa} alt="" draggable={false} className="sb-art" style={{ height: 52 }} /><span className="sb-chip" style={{ height: 20, fontSize: 10, gap: 4 }}><VerdictIcon verdict="malicious" size={11} />Malicious</span></div>}
          {i === 2 && <img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ height: 70 }} />}
          {i === 3 && <CheckCircle size={30} color="var(--sb-success)" />}
        </div>
        <b style={{ fontSize: 13, fontWeight: 600, lineHeight: '18px' }}>{s.title}</b>
        <span className="sb-label" style={{ lineHeight: '16px' }}>{s.body}</span>
      </motion.div>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <div style={{ gridColumn: '1 / 4', display: 'grid', gap: 6 }}>
        <motion.span className="sb-ttc-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: .5, duration: .9, ease: [.65, 0, .35, 1] }} />
        <span className="sb-label" style={{ textAlign: 'center' }}><b style={{ fontWeight: 600, color: 'var(--sb-strong)' }}>Time to Coverage</b> · under 2 hours</span>
      </div>
    </div>
  </div>;
}

function ControlPicture() {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
    {levels.map((l, i) => <motion.div key={l.title} className={`sb-shot ${i === 0 ? 'is-current' : ''}`} initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: .1 + i * .09, duration: .45, ease: [.23, 1, .32, 1] }}>
      <span className="sb-level-bars" aria-hidden="true">{[0, 1, 2].map(b => <i key={b} className={b <= i ? 'is-on' : ''} style={{ height: 6 + b * 4 }} />)}</span>
      <b style={{ fontSize: 16, fontWeight: 600, lineHeight: '22px' }}>{l.title}{i === 0 && <span className="sb-start">Where you start</span>}</b>
      <span className="sb-label" style={{ lineHeight: '16px', minHeight: 64 }}>{l.body}</span>
      <div style={{ display: 'grid', gap: 6, paddingTop: 10, borderTop: '1px solid var(--sb-border)' }}>
        {['Send a threat', 'Build a rule', 'Accept a rule'].map((r, j) => <span key={r} className="sb-label" style={{ display: 'flex', justifyContent: 'space-between' }}>{r}<b style={{ fontWeight: 600, color: l.who[j] === 'ADÉ' ? 'var(--sb-success-ink)' : 'var(--sb-strong)' }}>{l.who[j]}</b></span>)}
      </div>
    </motion.div>)}
  </div>;
}

/** Meeting ADÉ before turning it on. */
export default function AdeSetup() {
  const scene = useScene(timings);
  const step = scene.step;
  const t = useTargets(step);
  const open = step >= 6;
  const tab = step >= 9 ? 1 : 0;
  const pointer = step === 1 || step === 2 ? { key: 'card-ade', pressing: step === 2 }
    : step === 4 || step === 5 ? { key: 'learn', pressing: step === 5 }
    : step === 7 || step === 8 ? { key: 'tab-control', pressing: step === 8 }
    : step === 10 ? { key: 'settings' } : null;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="From the Agents hub, the ADÉ card opens ADÉ's page before it is on: ADÉ turns missed threats into new coverage, in under 2 hours on average, shown as a loop from a missed threat through ASA and ADÉ to a live rule. Learn more opens How ADÉ works: what ADÉ does, and what you control, from Manual to Auto-start to Auto-accept; the dialog leads to ADÉ settings">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <div ref={t.ref} style={{ position: 'relative' }}>
            <Screens id={step <= 2 ? 'hub' : 'ade'}>
              {step <= 2 ? <AgentsHub hover={step >= 1 ? 'ade' : null} pressed={step === 2} /> : <OffPage learnPressed={step === 5} />}
            </Screens>
            <div className={`sb-scrim ${open ? '' : 'is-out'}`} style={{ paddingTop: 70 }}>
              <div className={`sb-modal sb-dialog ${open ? '' : 'is-out'}`} style={{ width: 860 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--sb-border)' }}><b style={{ fontSize: 15, fontWeight: 600 }}>How ADÉ works</b><span className="sb-close">{Icon.x}</span></div>
                <div style={{ display: 'grid', gap: 16, padding: '18px 24px 22px' }}>
                  <div className="sb-seg" role="tablist">
                    {tabs.map((tb, i) => <span key={tb.id} className={`sb-seg-item ${i === tab ? 'is-on' : ''} ${step === 8 && i === 1 ? 'is-pressed' : ''}`} data-target={`tab-${tb.id}`}>
                      {i === tab && <motion.i layoutId="sb-seg" className="sb-seg-pill" transition={{ type: 'spring', bounce: .12, duration: .5 }} />}
                      <span>{tb.nav}</span>
                    </span>)}
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={tab} initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }} transition={{ duration: .26, ease: [.23, 1, .32, 1] }} style={{ display: 'grid', gap: 16 }}>
                      <div><p style={{ fontSize: 20, fontWeight: 600, lineHeight: '28px', letterSpacing: '-.2px' }}>{tabs[tab].title}</p><p className="sb-body" style={{ marginTop: 4 }}>{tabs[tab].lead}</p></div>
                      <div className="sb-shot-stage">{open && (tab === 0 ? <LoopPicture /> : <ControlPicture />)}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, padding: '12px 20px', borderTop: '1px solid var(--sb-border)' }}>
                  <span className="sb-body sb-verdict" style={{ fontWeight: 500 }}>View ADÉ documentation{Icon.external}</span>
                  <span className="sb-btn" data-target="settings">Go to ADÉ settings</span>
                </div>
              </div>
            </div>
            <Pointer at={pointer ? t.at(pointer.key) : null} visible={!!pointer} pressing={pointer?.pressing} reduced={scene.reduced} />
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the ADÉ introduction" caption={captions[step]} />
  </figure>;
}
