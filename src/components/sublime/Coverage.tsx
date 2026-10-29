import { ART, Icon, Page } from './SublimeUI';
import { Camera, Pointer, SceneFrame, frame, useScene, useShot, useStage, useTargets } from './scene';

// The result: ADÉ's page just after it is turned on (patrick/mttc ade-detail, state "empty"), where Time to Coverage is never blank. With no
// recommended rule of its own yet, the tile shows the platform average. Its info icon opens How ADÉ works on its third point, How it's measured
// (AdeEducationDialog, layout unified-shot, with AdeEducationShot's Measure graphic). Values, labels and copy are the source's (mttc
// _lib/mttc.js and the education components); the under-two-hour average is the real figure. Liberties taken: the graphic's aqua stage and
// green-cast glass become the page's own neutral surfaces, and the page stops after the Performance row, as the empty jobs state below it says
// nothing about coverage.
const timings = [1500, 900, 300, 4800];
const captions = [
  'ADÉ’s page, the moment it is turned on',
  'Time to Coverage is never blank: open how it’s measured',
  'Time to Coverage is never blank: open how it’s measured',
  'From a missed threat to a recommended rule: under two hours, on average',
];
const tiles = [
  { value: '< 2 hrs', label: 'Time to Coverage' },
  { value: '0', label: 'Hours Saved' },
  { value: '0', label: 'Attacks Blocked' },
];
const pills = ['What ADÉ does', 'What you control', 'How it’s measured'];
const spans = [
  { who: 'ASA', what: 'Analyzes', bar: { background: 'var(--sb-brand)' } },
  { who: 'ADÉ', what: 'Writes and tests the rule', bar: { background: 'var(--sb-strong)' } },
  { who: 'You', what: 'Push it live', bar: { boxShadow: 'inset 0 0 0 1px var(--sb-border-strong)' } },
];

/** How ADÉ works, open on How it's measured. */
function HowItsMeasured({ open, narrow }: { open: boolean; narrow: boolean }) {
  return <div className={`sb-scrim ${open ? '' : 'is-out'}`} style={{ paddingTop: narrow ? 24 : 32 }}>
    <div className="sb-modal" style={{ width: narrow ? 368 : 880 }}>
      <p style={{ padding: '16px 24px', fontSize: 16, fontWeight: 600, borderBottom: '1px solid var(--sb-border)' }}>How ADÉ works</p>
      <div style={{ display: 'grid', gap: narrow ? 16 : 20, padding: narrow ? '16px' : '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{pills.map((p, i) => <span key={p} className={`sb-pill-tab ${i === 2 ? 'is-on' : ''}`}>{p}</span>)}</div>
        <div style={{ display: 'grid', gap: 6 }}>
          <p style={{ fontSize: 18, fontWeight: 600, lineHeight: '24px', letterSpacing: '-.18px' }}>We measure how quickly ADÉ delivers new detection rules</p>
          <p className="sb-body" style={{ fontWeight: 500 }}>Time to Coverage is the average time from a missed threat to a recommended rule.</p>
        </div>
        <div style={{ display: 'grid', placeItems: 'center', height: narrow ? 'auto' : 272, padding: narrow ? 12 : 32, borderRadius: 16, background: 'var(--sb-subtle)', boxShadow: 'inset 0 0 0 1px var(--sb-border)' }}>
          <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 460, padding: narrow ? 18 : 32, borderRadius: 16, background: 'var(--sb-card)', boxShadow: '0 0 0 1px var(--sb-border), 0 16px 32px rgba(0, 0, 0, .1), 0 4px 8px rgba(0, 0, 0, .05)' }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <span className="sb-label">Time to Coverage</span>
              <span style={{ fontSize: narrow ? 40 : 56, fontWeight: 500, lineHeight: 1.1, letterSpacing: '-1.5px' }}>&lt;&thinsp;2 hrs</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 0.9fr', columnGap: 4, rowGap: 8 }}>
              {spans.map(s => <span key={s.who} style={{ height: 8, borderRadius: 4, ...s.bar }} />)}
              {spans.map(s => <span key={s.who} className="sb-label" style={{ display: 'grid', alignContent: 'start', lineHeight: '16px' }}><b style={{ fontWeight: 400, color: 'var(--sb-strong)' }}>{s.who}</b>{s.what}</span>)}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '12px 24px', borderTop: '1px solid var(--sb-border)' }}>
        {!narrow && <span className="sb-btn is-ghost" style={{ gap: 6 }}>View ADÉ documentation{Icon.external}</span>}
        <span className="sb-btn">Go to ADÉ settings</span>
      </div>
    </div>
  </div>;
}

/** The outcome, as the product states it. */
export default function Coverage() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 780, contained: true });
  const narrow = stage.narrow;
  const step = scene.step;
  const t = useTargets(step, narrow);
  const open = step === 3 || scene.reduced;
  const pointer = (step === 1 || step === 2) && !scene.reduced;
  const view = useShot(narrow && step < 3 ? 'perf' : null, narrow && step < 3 ? frame(t.rect('perf'), { ...stage.box, bottom: t.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  return <SceneFrame scene={scene} stage={stage} title="time to coverage" label="ADÉ's page just after it is turned on: Performance shows Time to Coverage under 2 hours, 0 Hours Saved and 0 Attacks Blocked. Its info icon opens How ADÉ works on How it's measured: Time to Coverage is the average time from a missed threat to a recommended rule, under 2 hours, spanning ASA's analysis and ADÉ writing and testing the rule, before you push it live">
    <Camera view={view} width={stage.W} height={stage.box.height} cameraRef={t.ref} reduced={scene.reduced}>
      <Page crumbs={['Agents', 'ADÉ']} style={{ minHeight: stage.box.height - 48, padding: narrow ? '20px 16px 32px' : '28px 32px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: narrow ? 14 : 20 }}>
          <span style={{ display: 'grid', placeItems: 'center', flexShrink: 0, width: narrow ? 52 : 64, height: narrow ? 52 : 64, border: '1px solid var(--sb-border)', borderRadius: 4 }}><img src={ART.ade} alt="" draggable={false} className="sb-art" style={{ width: narrow ? 36 : 44 }} /></span>
          <div style={{ flex: 1, paddingTop: narrow ? 0 : 6 }}>
            <p className="sb-h">{narrow ? 'ADÉ' : 'ADÉ (Autonomous Detection Engineer)'}</p>
            <p className="sb-body" style={{ fontWeight: 500 }}>Creates detections tailored to your environment.</p>
          </div>
          {!narrow && <span className="sb-btn is-secondary">Go to Settings</span>}
        </div>
        <div data-frame="perf">
          <p style={{ marginTop: 28, fontSize: 14, fontWeight: 600 }}>Performance <span className="sb-label" style={{ fontWeight: 400, marginLeft: 4 }}>(Last 30 days)</span></p>
          <div style={{ display: 'flex', marginTop: 10 }}>
            {tiles.map((tile, i) => <div key={tile.label} className="sb-tile" style={{ marginLeft: i ? -1 : 0, ...(narrow ? { width: 'auto', flex: 1, padding: '12px 12px' } : {}) }}>
              <p>{tile.value}</p>
              <span className="sb-label sb-verdict" style={{ fontSize: 11, gap: 4, whiteSpace: 'nowrap' }}>{tile.label}
                {i === 0 ? <span data-target="info" style={{ display: 'inline-flex', color: pointer ? 'var(--sb-strong)' : undefined }}>{Icon.info}</span> : !narrow && Icon.info}
              </span>
            </div>)}
          </div>
        </div>
      </Page>
      <HowItsMeasured open={open} narrow={narrow} />
      <Pointer at={pointer ? t.at('info') : null} visible={pointer} pressing={step === 2} reduced={scene.reduced} />
    </Camera>
  </SceneFrame>;
}
