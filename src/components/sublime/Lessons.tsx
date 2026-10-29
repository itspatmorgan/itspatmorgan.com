import type { ReactNode } from 'react';
import { ART } from './SublimeUI';

// The closing principles, each beside a small drawing on the case study's textured backdrop. These are ideas rather than screens, so the
// drawings are quiet diagrams in the page's neutrals, not product UI: the autonomy levels' rising bars (from the product's How ADÉ works
// graphic), the two agents' own marks with the hand-off between them, and the three things a reviewer sees before deciding.

function Stage({ label, children }: { label: string; children: ReactNode }) {
  return <div className="sb-lesson-stage texture-bg" role="img" aria-label={label}><div className="sb-lesson-art">{children}</div></div>;
}

/** Manual, Auto-start, Auto-accept: each level lights one more bar. */
function Levels() {
  const levels = ['Manual', 'Auto-start', 'Auto-accept'];
  return <div className="sb-art-levels">
    {levels.map((l, i) => <div key={l} className="sb-art-tile">
      <span className="sb-art-bars" aria-hidden="true">{[10, 16, 22].map((h, n) => <i key={n} style={{ height: h }} className={n <= i ? 'is-on' : ''} />)}</span>
      <span>{l}</span>
    </div>)}
  </div>;
}

/** ASA's verdict passes to ADÉ, out of sight, and leaves a trail. */
function Handoff() {
  return <div className="sb-art-handoff">
    <div className="sb-art-agent"><img src={ART.asa} alt="" draggable={false} className="sb-art" /><span>ASA</span><small>Verdict</small></div>
    <span className="sb-art-trail" aria-hidden="true"><i /><i /><i /><i /><i /></span>
    <div className="sb-art-agent"><img src={ART.ade} alt="" draggable={false} className="sb-art" /><span>ADÉ</span><small>Rule</small></div>
  </div>;
}

/** The rule, the hunt that tested it and its result come together at one decision. */
function Decision() {
  return <div className="sb-art-decision">
    <div className="sb-art-stack">{['The rule', 'The hunt that tested it', 'Its result'].map(s => <span key={s} className="sb-art-tile">{s}</span>)}</div>
    <svg className="sb-art-join" viewBox="0 0 40 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20 C 22 20, 18 60, 40 60 M0 60 L 40 60 M0 100 C 22 100, 18 60, 40 60" fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" /></svg>
    <span className="sb-art-tile is-strong">Your call</span>
  </div>;
}

const lessons = [
  {
    title: 'Autonomy is earned in steps',
    body: 'Nobody hands an agent the keys on day one. Teams start ADÉ by hand, let it start on its own, then let it accept rules that clear their bar, each step earned by the one before.',
    art: <Stage label="Three levels: Manual, Auto-start and Auto-accept, each with one more bar lit"><Levels /></Stage>,
  },
  {
    title: 'Background work needs a visible trail',
    body: 'When one agent hands work to another while no one watches, the product’s job is to show where that work is and what it did.',
    art: <Stage label="ASA's verdict passes to ADÉ, which returns a rule"><Handoff /></Stage>,
  },
  {
    title: 'Keep a person at the decision',
    body: 'Review works when it is a deliberate moment: the rule, the hunt that tested it and its result in one place, and then a person decides.',
    art: <Stage label="The rule, the hunt that tested it and its result lead to your call"><Decision /></Stage>,
  },
];

/** Principles for agents people trust, each beside a small drawing. */
export default function Lessons() {
  return <ol className="sb-lessons">
    {lessons.map(l => <li key={l.title}>
      <div className="sb-lesson-copy"><h3>{l.title}</h3><p>{l.body}</p></div>
      {l.art}
    </li>)}
  </ol>;
}
