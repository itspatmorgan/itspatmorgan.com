import { ART, Icon, Page } from './SublimeUI';
import { Camera, Pointer, SceneFrame, frame, useScene, useShot, useStage, useTargets } from './scene';

// The result: ADÉ's page just after it is turned on (patrick/mttc ade-detail, state "empty"), where Time to Coverage is never blank. With no
// recommended rule of its own yet, the tile shows the platform average, and its info popover says so. The value, tile labels and popover copy
// are the source's (mttc _lib/mttc.js); the under-two-hour average is the real figure. The page stops after the Performance row, as the
// source's empty jobs state below it says nothing about coverage.
const timings = [1500, 900, 4200];
const captions = [
  'ADÉ’s page, the moment it is turned on',
  'Time to Coverage is never blank',
  'Until a team has rules of its own, it shows the average across customers: under two hours',
];
const tiles = [
  { value: '< 2 hrs', label: 'Time to Coverage' },
  { value: '0', label: 'Hours Saved' },
  { value: '0', label: 'Attacks Blocked' },
];

/** The outcome, as the product states it. */
export default function Coverage() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 670, contained: true });
  const narrow = stage.narrow;
  const step = scene.step;
  const t = useTargets(step, narrow);
  const open = step === 2 || scene.reduced;
  const pointer = step >= 1 && !scene.reduced;
  const view = useShot(narrow ? 'perf' : null, narrow ? frame(t.rect('perf'), { ...stage.box, bottom: t.height }, { scale: 1, pad: 16, y: 'start' }) : null);
  return <SceneFrame scene={scene} stage={stage} title="time to coverage" label="ADÉ's page just after it is turned on: Performance shows Time to Coverage under 2 hours, 0 Hours Saved and 0 Attacks Blocked. Time to Coverage's info explains it is the average time from a missed threat reaching ADÉ to a recommended rule ready to accept, and that this is the platform average: customers using ADÉ get missed threats covered in under 2 hours">
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
              <span className="sb-label sb-verdict" style={{ fontSize: 11, gap: 4, whiteSpace: 'nowrap', position: 'relative' }}>{tile.label}
                {i === 0 ? <span data-target="info" style={{ display: 'inline-flex', color: open ? 'var(--sb-strong)' : undefined }}>{Icon.info}</span> : !narrow && Icon.info}
                {i === 0 && <span className={`sb-popover ${open ? '' : 'is-out'}`} role="tooltip" style={{ left: narrow ? -12 : -16, right: 'auto', width: narrow ? 318 : 413, transformOrigin: 'top left' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '22px' }}>Time to Coverage</span>
                  <span>Average time from a missed threat reaching ADÉ to a recommended rule ready to accept.</span>
                  <span style={{ height: 1, background: 'var(--sb-border)' }} />
                  <span className="sb-label">This is the platform average: customers using ADÉ get missed threats covered in under 2 hours. It becomes your own value after ADÉ’s first recommended rule.</span>
                </span>}
              </span>
            </div>)}
          </div>
        </div>
      </Page>
      <Pointer at={pointer ? t.at('info') : null} visible={pointer} reduced={scene.reduced} />
    </Camera>
  </SceneFrame>;
}
