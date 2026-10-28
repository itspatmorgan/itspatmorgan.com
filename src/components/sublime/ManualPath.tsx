import type { ReactNode } from 'react';
import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { VerdictIcon, Zoom } from './SublimeUI';

// Before ADÉ: the manual path from a missed threat to a deployed rule, drawn in the product's own type and surfaces.
// Each step's bar starts where the last one ended, so the analyst's time stacks up. Bar lengths are illustrative, not measured.
const line = (w: number, tone = 'var(--sb-border)') => <i style={{ display: 'block', height: 4, width: w, borderRadius: 2, background: tone }} />;
const art: ReactNode[] = [
  <span className="sb-mini" style={{ gap: 4 }}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><VerdictIcon verdict="malicious" size={11} />{line(22, 'var(--sb-weak)')}</span>{line(36)}{line(28)}</span>,
  <span className="sb-mini" style={{ gap: 4, position: 'relative' }}>{line(36)}{line(30)}{line(36)}<svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', right: -6, bottom: -6 }} aria-hidden="true"><circle cx="7.5" cy="7.5" r="5" fill="var(--sb-card)" stroke="var(--sb-strong)" strokeWidth="1.6" /><path d="M11.2 11.2l4.5 4.5" stroke="var(--sb-strong)" strokeWidth="1.8" strokeLinecap="round" /></svg></span>,
  <span className="sb-mini is-code" style={{ gap: 4 }}><span style={{ display: 'flex', gap: 3 }}>{line(10, 'var(--sb-code-keyword)')}{line(18, 'var(--sb-code-fn)')}</span><span style={{ display: 'flex', gap: 3, paddingLeft: 5 }}>{line(14, 'var(--sb-code-path)')}{line(12, 'var(--sb-code-string)')}</span><span style={{ display: 'flex', gap: 3 }}>{line(10, 'var(--sb-code-keyword)')}{line(22, 'var(--sb-code-path)')}</span></span>,
  <span className="sb-mini" style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, paddingBottom: 6 }}>{[14, 22, 10, 26, 18].map((h, i) => <i key={i} style={{ width: 5, height: h, borderRadius: 1, background: i === 3 ? 'var(--sb-malicious)' : 'var(--sb-border-strong)' }} />)}</span>,
  <span className="sb-mini" style={{ alignItems: 'center', justifyContent: 'center' }}><i style={{ position: 'relative', width: 28, height: 16, borderRadius: 8, background: 'var(--sb-strong)' }}><b style={{ position: 'absolute', right: 2, top: 2, width: 12, height: 12, borderRadius: 6, background: 'var(--sb-card)' }} /></i></span>,
];
const steps = [
  { title: 'Notice the miss', body: 'Spot a threat your rules didn’t catch.', time: 1 },
  { title: 'Investigate it', body: 'Work out what made it malicious.', time: 2 },
  { title: 'Write a rule', body: 'Express the pattern in MQL.', time: 3 },
  { title: 'Test it', body: 'Hunt past mail for hits and false positives.', time: 2.4 },
  { title: 'Deploy it', body: 'Turn the rule on, then watch it.', time: .8 },
];
const total = steps.reduce((sum, s) => sum + s.time, 0);
const starts = steps.map((_, i) => steps.slice(0, i).reduce((sum, s) => sum + s.time, 0));
const timings = [700, ...steps.slice(1).map(() => 1300), 3200]; // frame n shows n steps done; the last holds all five

/** One missed threat, worked by hand. */
export default function ManualPath() {
  const loop = useDemoLoop(timings, timings.length - 1);
  const done = loop.step; // steps completed so far; the last frame holds every step
  return <figure className={`qb-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="By hand, a missed threat meant five steps for the analyst: notice the miss, investigate it, write a rule, test it, and deploy it, adding up to hours of work">
    <NativeStage width={1240} height={900}>
      <div className="sb-card" style={{ background: 'var(--sb-subtle)' }}>
        <Zoom width={720}>
          <div style={{ padding: '36px 32px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', columnGap: 28, alignItems: 'end', paddingBottom: 12 }}>
              <span className="sb-label">Step</span>
              <span className="sb-label" style={{ display: 'flex', justifyContent: 'space-between' }}><span>Analyst time</span><span>→</span></span>
            </div>
            <ol style={{ display: 'grid', gap: 12 }}>
              {steps.map((step, i) => <li key={step.title} className={`sb-dim ${i < done ? '' : 'is-dim'}`} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', columnGap: 28, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 76, padding: '0 14px', background: 'var(--sb-card)', border: '1px solid var(--sb-border)', borderRadius: 4 }}>
                  {art[i]}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px' }}>{step.title}</p>
                    <p style={{ fontSize: 12, fontWeight: 500, lineHeight: '16px', color: 'var(--sb-weak)' }}>{step.body}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--sb-weak)' }}>You</span>
                </div>
                <div style={{ position: 'relative', height: 76 }}>
                  <i className="sb-gantt" style={{ left: `${starts[i] / total * 100}%`, width: i < done ? `${step.time / total * 100}%` : 0 }} />
                </div>
              </li>)}
            </ol>
            <div className={`sb-fade ${done === steps.length ? '' : 'is-out'}`} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', columnGap: 28, marginTop: 20 }}>
              <span />
              <span style={{ justifySelf: 'end', fontSize: 14, fontWeight: 600 }}>Hours of work, for every missed threat</span>
            </div>
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <DemoControls loop={loop} title="the manual path" caption={done === steps.length ? 'Five steps, all by hand, adding up to hours' : done ? `Step ${done}: ${steps[done - 1].title}` : 'A threat gets past the rules'} />
  </figure>;
}
