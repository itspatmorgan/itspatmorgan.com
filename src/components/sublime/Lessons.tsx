import type { ReactNode } from 'react';
import { Icon, StatusPill, Switch, VerdictIcon, verdictName, type Status } from './SublimeUI';

// The closing lessons, each beside the piece of the product it came from. Static excerpts of screens shown earlier, at their own size:
// the ADÉ Automation rows (with the sample settings the automation slide ends on; on a phone the thresholds read as their short values), jobs ADÉ started from its page's list, and the head of a
// recommendation with its hunt result. Liberty taken: each is cropped out of its page and set on its own.

function Excerpt({ children }: { children: ReactNode }) {
  return <div className="sb-lesson-stage texture-bg"><div className="sb-card qb-native sb-lesson-card">{children}</div></div>;
}

const automation = [
  { verdict: 'malicious', on: true, threshold: 'Recommended (90%)', short: '90%' },
  { verdict: 'spam', on: true, threshold: 'Recommended (85%)', short: '85%' },
  { verdict: 'graymail', on: false, threshold: 'Require review', short: 'Review' },
] as const;

const jobs: { subject: string; status: Status | null }[] = [
  { subject: 'Invoice payment confirmation required today', status: null },
  { subject: 'Benefits enrollment form from rare sender', status: 'auto' },
  { subject: 'Urgent wire transfer details for review', status: 'auto' },
];

const lessons: { title: string; body: string; ui: ReactNode }[] = [
  {
    title: 'Autonomy is an on‑ramp',
    body: 'Teams start ADÉ by hand, then let it start on its own, then let it accept rules that clear their bar. Each step is earned by the one before.',
    ui: <div className="sb-cells">
      <div className="sb-row is-head sb-lesson-auto"><span>Verdict</span><span>Auto-start</span><span><span className="sb-wide-only">Auto-accept threshold</span><span className="sb-narrow-only">Threshold</span></span></div>
      {automation.map(r => <div key={r.verdict} className="sb-row sb-lesson-auto" style={{ minHeight: 52 }}>
        <span className="sb-chip" style={{ width: 'fit-content', gap: 6 }}><VerdictIcon verdict={r.verdict} size={14} />{verdictName[r.verdict]}</span>
        <Switch on={r.on} />
        <span className="sb-select"><span><span className="sb-wide-only">{r.threshold}</span><span className="sb-narrow-only">{r.short}</span></span>{Icon.chevron('down')}</span>
      </div>)}
    </div>,
  },
  {
    title: 'Agents hand off in the background',
    body: 'ASA’s verdict leads to ADÉ’s job while no one watches, so the product has to show where the work is and what it did.',
    ui: <div className="sb-cells">
      <div className="sb-row is-head" style={{ gridTemplateColumns: 'minmax(0, 1fr) 132px', padding: '0 16px' }}><span>Started by ADÉ</span><span>Recommendation</span></div>
      {jobs.map(j => <div key={j.subject} className="sb-row" style={{ gridTemplateColumns: 'minmax(0, 1fr) 132px', padding: '0 16px', minHeight: 52 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.subject}</span>
        {j.status ? <StatusPill status={j.status} /> : <span className="sb-verdict sb-label"><span className="sb-spin" style={{ display: 'inline-flex' }}>{Icon.progress}</span>Running</span>}
      </div>)}
    </div>,
  },
  {
    title: 'Review is a deliberate moment',
    body: 'A person sees the rule, the hunt that tested it and its result in one place, and then decides.',
    ui: <div className="sb-cells">
      <div style={{ display: 'grid', gap: 16, padding: 20, background: 'var(--sb-cell-head)' }}>
        <div>
          <p className="sb-body" style={{ fontWeight: 600 }}>ADÉ Recommended Rule</p>
          <p className="sb-body" style={{ marginTop: 4 }}><b style={{ fontWeight: 600 }}>93% match</b> in a 14-day hunt, with 40 malicious matches and 2 possible false positives.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}><span className="sb-btn">Accept</span><span className="sb-btn is-secondary">Reject</span></div>
      </div>
    </div>,
  },
];

/** What the agents taught me, each lesson beside the product it shaped. */
export default function Lessons() {
  return <ol className="sb-lessons">
    {lessons.map(l => <li key={l.title}>
      <div className="sb-lesson-copy"><h3>{l.title}</h3><p>{l.body}</p></div>
      <Excerpt>{l.ui}</Excerpt>
    </li>)}
  </ol>;
}
