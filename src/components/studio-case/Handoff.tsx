import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowRight01Icon, CodeIcon, File01Icon, MoreVerticalIcon, Presentation01Icon } from '@hugeicons/core-free-icons';
import { SceneFrame, Screens, useScene, useStage } from '../case-study/scene';
import { Rail, icon } from './StudioUI';

// How engineering builds from a prototype: every prototype ends with a design handoff, an entry guide that names the views and
// files to build from (the archive's write-design-handoff skill). Engineers' agents read it with skills engineering wrote to port
// the prototype to production code (Patrick, 2026-10-30). This is Patrick's real handoff for Vendor Management (Beta)
// (archive: src/prototypes/patrick/vendor-management-hifi/documents/design-handoff.mdx), and the Setup / enable gate it points to
// (_components/setup-gate/GateFullPage.jsx and VendorListShot.jsx), with their real copy.
// Liberties: the vendors shot shows letter tiles (the component's own fallback) in place of the vendors' logos; the gate's mint
// bloom is softened to sit on the site; the sidebar keeps Getting Started open and the other groups closed.
const timings = [3200, 1600, 4000];
const captions = [
  'Every prototype ends with a handoff for engineering',
  'It names the exact views and files to build from',
  'Each link opens the working view',
];

const groups = ['Vendor List', 'Vendor Detail', 'Create/Edit Vendors', 'Import Vendors', 'Message Triage'];
const vendors = [
  ['Salesforce', 'salesforce.com'],
  ['Microsoft', 'microsoft.com'],
  ['Slack', 'slack.com', '2 recent impersonations'],
  ['Zoom', 'zoom.us', '1 recent impersonation'],
  ['DocuSign', 'docusign.com'],
] as const;

function Side({ view }: { view: boolean }) {
  return <aside className="sc-side" aria-hidden="true">
    <h4>Vendor Management (Beta)</h4>
    <h5>Context</h5>
    <ul>
      <li className={view ? '' : 'is-on'}>{icon(File01Icon, 15)}Design handoff</li>
      <li>{icon(Presentation01Icon, 15)}Vendor foundation</li>
    </ul>
    <h5>Code</h5>
    <ul>
      <li className="is-group">{icon(ArrowDown01Icon, 13)}Getting Started</li>
      <li className={`is-child ${view ? 'is-on' : ''}`}>{icon(CodeIcon, 14)}Setup / enable gate</li>
      <li className="is-child">{icon(CodeIcon, 14)}Enterprise availability gate</li>
      <li className="is-child">{icon(CodeIcon, 14)}First run vendors</li>
      {groups.map(g => <li key={g} className="is-group">{icon(ArrowRight01Icon, 13)}{g}</li>)}
    </ul>
  </aside>;
}

function Doc({ hover }: { hover: boolean }) {
  return <article className="sc-hand">
    <h1>Design handoff: Vendor Management (Beta)</h1>
    <p className="sc-hand-lede">Entry guide for eng — start with setup and enterprise in this pass.</p>
    <h2>Setup and enterprise gates</h2>
    <p>Two full-page gates when Vendors isn’t usable yet: <b>setup / enable</b> (entitled, not on) and <b>enterprise</b> (not entitled).</p>
    <h3>Build from</h3>
    <ul>
      <li><a className={hover ? 'is-hover' : ''}>Setup / enable</a> — <code>onboarding/index-setup.jsx</code> (CTA: <b>Enable</b>)</li>
      <li><a>Enterprise</a> — <code>onboarding/index-enterprise.jsx</code> (CTA: <b>Learn More</b>)</li>
    </ul>
    <p>Shared implementation (copy, layout, CTAs, product shot):</p>
    <ul>
      <li><code>_components/setup-gate/GateFullPage.jsx</code> — layout, copy constants, Enable / Learn More</li>
      <li><code>_components/setup-gate/VendorListShot.jsx</code> — decorative vendors list shot</li>
    </ul>
  </article>;
}

function Gate() {
  return <div className="sc-gate">
    <div className="sc-gate-crumb">Vendors</div>
    <div className="sc-gate-body">
      <div className="sc-gate-copy">
        <h2>Your organization has Vendor Management and Impersonation Detection.</h2>
        <p>Once enabled, this feature helps you identify and manage vendors and detect impersonation attempts.</p>
        <span className="sc-gate-cta">Enable</span>
      </div>
      <div className="sc-gate-shot">
        <div className="sc-gate-glow" />
        <div className="sc-vendors">
          <div className="sc-vendors-head"><b>Vendors</b><span><i>Import</i><i className="is-dark">Add</i></span></div>
          {vendors.map(([name, domain, detail]) => <div key={name} className="sc-vendor">
            <span className="sc-vendor-logo">{name[0]}</span>
            <span className="sc-vendor-name"><b>{name}</b><small>{domain}{detail && <> · {detail}</>}</small></span>
            <span className="sc-vendor-status">{detail && <i>Suggested</i>}</span>
            <HugeiconsIcon icon={MoreVerticalIcon} size={12} strokeWidth={1.8} className="sc-vendor-more" />
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}

/** A prototype's design handoff in the internal Studio, then the working view its first link opens. */
export default function Handoff() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  const view = step >= 2;
  return <SceneFrame scene={scene} stage={stage} title="the engineering handoff" focus={view ? null : { x: 284, y: 40, w: 680, align: 'start', zoom: 1.3 }}
    label="Patrick's design handoff for Vendor Management (Beta) in Sublime's Design Studio: an entry guide for engineering that names the views to build from, Setup / enable and Enterprise, with their source files. The Setup / enable link opens the working gate: a heading, a line of copy and an Enable button beside a vendors list">
    <div className="sc-app" style={{ height: stage.box.height }}>
      <Rail on="prototypes" />
      <Side view={view} />
      <div className="sc-main" aria-hidden="true">
        <Screens id={view ? 'view' : 'doc'}>
          <div style={{ position: 'relative', height: stage.box.height, overflow: 'hidden' }}>
            {view ? <Gate /> : <Doc hover={step === 1} />}
          </div>
        </Screens>
      </div>
    </div>
  </SceneFrame>;
}
