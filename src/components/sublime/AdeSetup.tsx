import { AnimatePresence, motion } from 'motion/react';
import { NativeStage } from '../case-study/NativeStage';
import { ART, CheckCircle, Icon, Page, VerdictIcon, Zoom } from './SublimeUI';
import { Pointer, SceneControls, useScene, useTargets } from './scene';

// Turning ADÉ on (patrick/mttc ade-detail and AdeEducationDialog): the ADÉ page before activation, with the How ADÉ works dialog open.
// Copy is the dialog's (AdeEducationUnified). Liberty taken: the dialog's aqua product-shot stage is redrawn on neutral surfaces.
// Time to Coverage shows the platform average until ADÉ has data of its own, as the shipped tile does.
const W = 1000;
const timings = [700, 3000, 900, 400, 3600, 3000];
const captions = ['The ADÉ page, before ADÉ is on', 'How ADÉ works: what it does', 'What you control', 'What you control', 'You start in control and add autonomy when you are ready', 'Go to ADÉ settings, where ADÉ is turned on at the level you choose'];
const tabs = [
  { id: 'how', nav: 'What ADÉ does', title: 'ADÉ turns a missed threat into new coverage', lead: 'When a threat gets past your detection rules, ADÉ builds a rule to catch it. On average, that takes under 2 hours.' },
  { id: 'control', nav: 'What you control', title: 'You decide how much ADÉ does on its own', lead: 'You start in control and add autonomy when you are ready.' },
  { id: 'measure', nav: 'How it’s measured', title: '', lead: '' },
];
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
  const open = step >= 1;
  const tab = step >= 3 ? 1 : 0;
  const pointer = step === 2 || step === 3 ? { key: 'tab-control', pressing: step === 3 } : step === 5 ? { key: 'settings' } : null;
  return <figure className={`qb-demo ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="The ADÉ page before activation with the How ADÉ works dialog: What ADÉ does shows the loop from a missed threat to a live rule, with Time to Coverage under 2 hours; What you control shows Manual, Auto-start and Auto-accept; the dialog leads to ADÉ settings">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom key={scene.take} width={W}>
          <div ref={t.ref} style={{ position: 'relative' }}>
            <Page crumbs={['Agents', 'ADÉ']} style={{ padding: '28px 32px 0', minHeight: 900 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                <span className="sb-ade-mark" style={{ width: 64, height: 64, borderRadius: 4 }}><img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ width: 44 }} /></span>
                <div style={{ flex: 1, paddingTop: 6 }}>
                  <p className="sb-h">ADÉ (Autonomous Detection Engineer)</p>
                  <p className="sb-body sb-verdict" style={{ fontWeight: 500 }}>Creates detections tailored to your environment.{Icon.info}</p>
                </div>
                <span className="sb-btn is-secondary">Go to Settings</span>
              </div>
              <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Performance <span className="sb-label" style={{ fontWeight: 400, marginLeft: 4 }}>(Last 30 days)</span></p>
              <div style={{ display: 'flex', marginTop: 10 }}>
                {[['< 2 hrs', 'Time to Coverage'], ['0', 'Hours Saved'], ['0', 'Attacks Blocked']].map(([v, l], i) => <div key={l} className="sb-tile" style={{ marginLeft: i ? -1 : 0 }}><p>{v}</p><span className="sb-label sb-verdict" style={{ fontSize: 11, gap: 4 }}>{l}{Icon.info}</span></div>)}
              </div>
              <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Jobs</p>
              <div className="sb-empty"><span>{Icon.bullseye}</span>No ADÉ jobs yet.</div>
            </Page>
            <div className={`sb-scrim ${open ? '' : 'is-out'}`} style={{ paddingTop: 70 }}>
              <div className={`sb-modal sb-dialog ${open ? '' : 'is-out'}`} style={{ width: 860 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--sb-border)' }}><b style={{ fontSize: 15, fontWeight: 600 }}>How ADÉ works</b><span className="sb-close">{Icon.x}</span></div>
                <div style={{ display: 'grid', gap: 16, padding: '18px 24px 22px' }}>
                  <div className="sb-seg" role="tablist">
                    {tabs.map((tb, i) => <span key={tb.id} className={`sb-seg-item ${i === tab ? 'is-on' : ''} ${step === 3 && i === 1 ? 'is-pressed' : ''}`} data-target={`tab-${tb.id}`}>
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
