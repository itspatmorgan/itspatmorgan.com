import { NativeStage, DemoControls, DemoCursor } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { Icon, Page, VerdictIcon, Zoom, useAim } from './SublimeUI';

// ADÉ Automation (patrick/ade-workflow ade/ade-automation-config): per disposition, whether ADÉ starts a job on its own and the rule
// auto-acceptance threshold. The demo walks one customer up the on-ramp for malicious mail. Recommended thresholds are the source's defaults.
const W = 980;
const timings = [1600, 900, 1000, 900, 700, 900, 800, 900, 3600];
const captions = [
  'Manual: ADÉ runs only when someone triggers it',
  'Auto-start for malicious messages',
  'Auto-start for malicious messages',
  'Set when ADÉ may accept its own rules',
  'Set when ADÉ may accept its own rules',
  'Set when ADÉ may accept its own rules',
  'Auto-accept at the recommended 90% match',
  'Turn the automation on',
  'ADÉ now starts and accepts on its own, within the bar you set',
];
const rows = [
  { verdict: 'malicious', label: 'Malicious', recommended: 90 },
  { verdict: 'spam', label: 'Spam', recommended: 85 },
  { verdict: 'graymail', label: 'Graymail', recommended: 95 },
] as const;
const cols = '150px 190px minmax(0, 1fr) 230px';

function Switch({ on }: { on: boolean }) {
  return <span className={`sb-switch ${on ? 'is-on' : ''}`}><i>{on ? Icon.check : Icon.x}</i></span>;
}

/** The on-ramp to autonomy, as settings. */
export default function AutomationConfig() {
  const loop = useDemoLoop(timings, timings.length - 1);
  const step = loop.step;
  const aim = useAim(step);
  const autoStart = step >= 2;
  const menuOpen = step === 4 || step === 5;
  const threshold = step >= 6;
  const active = step >= 8;
  const target = step === 0 ? 'rest' : step <= 2 ? 'switch' : step <= 4 ? 'threshold' : step <= 6 ? 'option' : 'status';
  const cursor = aim.at(target);
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="ADÉ Automation settings: for malicious messages, Automatically start ADÉ job is switched on, the rule auto-acceptance threshold changes from Require review to Recommended (90%), and the automation is set to Active">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={W} zoomRef={aim.ref}>
          <Page crumbs={['Agents', 'ADÉ', 'ADÉ Automation']}>
            <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', borderBottom: '1px solid var(--sb-border)' }}>
              <div style={{ display: 'grid', gap: 20, padding: '24px 32px', borderRight: '1px solid var(--sb-border)' }}>
                <div><p style={{ fontSize: 20, fontWeight: 600, lineHeight: '28px' }}>ADÉ Automation</p><p className="sb-label" style={{ marginTop: 2 }}>Automatically run ADÉ and accept generated rules when validation meets your threshold.</p></div>
                <div className="sb-field"><span>Trigger</span><span className="sb-input" style={{ maxWidth: 435, background: 'var(--sb-secondary)' }}>Unflagged Message Classified, Manually Triggered</span></div>
                <div className="sb-field"><span>Author</span><span className="sb-body">Sublime Security <span className="sb-label" style={{ marginLeft: 6 }}>Created on Apr 14, 2026 • Last updated Jul 2, 2026</span></span></div>
              </div>
              <div style={{ padding: '24px 32px' }}>
                <div className="sb-field" style={{ maxWidth: 170 }}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Current Status {Icon.info}</span>
                  <span className="sb-select" data-target="status"><span className="sb-verdict"><i className={`sb-status-dot ${active ? 'is-on' : ''}`} />{active ? 'Active' : 'Inactive'}</span>{Icon.chevron('down')}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12, padding: '24px 32px' }}>
              <p style={{ fontSize: 15, fontWeight: 600 }} data-target="rest">Configure ADÉ Jobs</p>
              <p className="sb-body" style={{ maxWidth: 820 }}>ADÉ can run automatically when a message group is unflagged but has a disposition of Malicious, Spam, or Graymail. It can also automatically accept a new generated Rule based on how well its Hunt results match the disposition of the originating message group.</p>
              <div className="sb-cells" style={{ marginTop: 8, overflow: 'visible' }}>
                <div className="sb-row is-head" style={{ gridTemplateColumns: cols, background: 'var(--sb-cell-head)', borderRadius: '4px 4px 0 0' }}>
                  <span className="sb-verdict" style={{ fontSize: 11 }}>Disposition {Icon.info}</span><span>Automatically start ADÉ job</span><span>Alerts</span><span className="sb-verdict" style={{ fontSize: 11 }}>Rule auto-acceptance threshold {Icon.info}</span>
                </div>
                {rows.map((row, i) => {
                  const first = i === 0;
                  return <div key={row.verdict} className="sb-row" style={{ gridTemplateColumns: cols, minHeight: 60, borderTop: '1px solid var(--sb-border-strong)', overflow: 'visible' }}>
                    <span className="sb-chip" style={{ width: 'fit-content', gap: 6 }}><VerdictIcon verdict={row.verdict} size={14} />{row.label}</span>
                    <span data-target={first ? 'switch' : undefined} style={{ width: 'fit-content' }}><Switch on={first && autoStart} /></span>
                    <span className="sb-select" style={{ maxWidth: 220 }}>No Alert{Icon.chevron('down')}</span>
                    <span style={{ position: 'relative' }}>
                      <span className={`sb-select ${first && menuOpen ? 'is-open' : ''}`} data-target={first ? 'threshold' : undefined}>{first && threshold ? `Recommended (${row.recommended}%)` : 'Require review'}{Icon.chevron('down')}</span>
                      {first && <span className={`sb-menu ${menuOpen ? '' : 'is-out'}`} style={{ display: 'block' }}>
                        <div className={step === 5 || step === 6 ? 'is-hover' : ''} data-target="option">Recommended ({row.recommended}%)</div>
                        <div>Custom</div>
                        <div>Require review</div>
                      </span>}
                    </span>
                  </div>;
                })}
              </div>
            </div>
          </Page>
          <DemoCursor x={cursor.x} y={cursor.y} visible={!loop.reduced} reduced={loop.reduced} pressing={step === 2 || step === 4 || step === 6 || step === 8} />
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title="the automation settings" caption={captions[step]} />
  </figure>;
}
