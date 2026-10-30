import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, DashboardSquare01Icon, File01Icon, Menu01Icon, SquareIcon } from '@hugeicons/core-free-icons';
import { SceneFrame, Screens, useScene, useStage } from '../case-study/scene';
import { Filters, PrototypeCard, Rail, icon, type Prototype } from './StudioUI';

// Day one, then today. The first gallery (Drive: sublime-humble-beginning.jpg) held one project, Agent Configuration, in a list view
// under a Sublime header; today's (Drive: sublime-team-prototypes.png) is the catalog every teammate publishes to, newest first,
// with team tabs. The scene crossfades from one to the other.
// Liberties: the first gallery's card is dated Jan 26, 2026; its meta.json reads 2025, a typo, since the initial commit names a model
// released in late 2025. Descriptions end where the screenshot's two-line clamp does.
const timings = [3000, 4200];
const captions = ['Day one: one project in one folder', 'Today: the whole product team publishes here'];

const today: Prototype[] = [
  { who: 'Patrick', title: 'Mailbox Takeover Signals', desc: 'Patrick’s simplified iteration of AJ’s Mailbox Takeover Signals, private beta first. Scaffolded…', date: 'Updated Oct 29, 2026' },
  { who: 'Joe', title: 'DLP Unblock Request Management', desc: 'Review outbound DLP unblock requests, inspect message details, and approve or deny individua…', date: 'Oct 27, 2026' },
  { who: 'Joe', title: 'Product Ideation Pilot', desc: 'Owner-scoped pilot for turning product feedback into approved briefs, concept rounds, solution…', date: 'Updated Oct 27, 2026' },
  { who: 'Ahry', title: 'Sub-org hub and parent org mode', desc: 'Private beta cut: the lean sub-organizations hub (license and trial visibility, single-org license…', date: 'Updated Oct 26, 2026' },
  { who: 'Ahry', title: 'Value Summary Report', desc: 'One-page monthly value summary a CISO sends to leadership. Each block answers a question…', date: 'Updated Oct 26, 2026' },
  { who: 'AJ', title: 'Mailbox Takeover Signals', desc: 'Identify potentially compromised mailboxes from mailbox-specific behavior and share risk…', date: 'Updated Oct 26, 2026' },
  { who: 'Joe', title: 'Link Preview: Failure State', desc: 'Final Design OS direction: clear reasons for URL preview failures, contextual retry, and collapsed…', date: 'Oct 26, 2026' },
  { who: 'Joe', title: 'MDV Link Text Mapping', desc: 'Identify the email link text behind each URL in Links in body and Link Preview. Focused on tick…', date: 'Oct 26, 2026' },
  { who: 'Joe', title: 'Activity Row Dialog', desc: 'Independent exploration of Patrick’s recipient activity row-click dialog. Close the dialog and…', date: 'Updated Oct 23, 2026' },
  { who: 'Samantha', title: 'Custom Training Builder', desc: 'Timeline editor for custom security awareness training. Add sections three ways: a custom…', date: 'Oct 23, 2026' },
  { who: 'Samantha', title: 'Phish Sims for Email Agents', desc: 'Agent campaign type in Phish Sims: pick mailboxes, send a link hidden from the human…', date: 'Oct 23, 2026' },
  { who: 'Samantha', title: 'Phishing Sim Post-Click', desc: 'Credential pages and attachment lures added to the current phishing sims campaign builder, wit…', date: 'Oct 23, 2026' },
];

const pages: [string, typeof SquareIcon][] = [
  ['Ade Design Future Wireframe', SquareIcon], ['Ade Design Launch', File01Icon], ['Ade Design', File01Icon], ['Ade Prototype', DashboardSquare01Icon],
  ['Asa Design Future Wireframe', SquareIcon], ['Asa Design Launch', File01Icon], ['Asa Design', File01Icon], ['Asa Prototype', DashboardSquare01Icon],
];

function FirstGallery() {
  return <div className="sc-first">
    <div className="sc-first-head"><img src="/images/studio-case/logo-light-mode.svg" alt="" /><i />Design Prototypes</div>
    <div className="sc-first-body">
      <div className="sc-first-bar">Filter: <b>All authors {icon(ArrowDown01Icon, 14)}</b><span className="sc-views">1 projects <span style={{ display: 'inline-flex', border: '1px solid var(--sc-line)', borderRadius: 6, overflow: 'hidden' }}><span style={{ display: 'flex', padding: 6, background: '#3b82f6', color: '#fff' }}>{icon(Menu01Icon, 14)}</span><span style={{ display: 'flex', padding: 6, background: 'var(--sc-bg)' }}>{icon(DashboardSquare01Icon, 14)}</span></span></span></div>
      <div className="sc-first-card">
        <h3>Agent Configuration</h3>
        <p>Configuration interfaces for ASA (Automated Security Analyst) and ADE (Automated Detection Engineer) agents. Includes high-fidelity designs, launch views, and wireframes.</p>
        <small>Patrick &nbsp;•&nbsp; Jan 26, 2026</small>
        <hr />
        <p className="sc-pages">PAGES</p>
        <ul>{pages.map(([t, i]) => <li key={t}><HugeiconsIcon icon={i} size={15} strokeWidth={1.5} />{t}</li>)}</ul>
      </div>
    </div>
  </div>;
}

function TodayGallery() {
  return <div className="sc-app">
    <Rail on="prototypes" />
    <div className="sc-main">
      <div>
        <div className="sc-gallery">
          <h2 className="sc-title">Prototypes</h2>
          <p className="sc-desc">Every prototype in the gallery, newest first.</p>
          <Filters />
          <div className="sc-grid">{today.map(p => <PrototypeCard key={p.who + p.title} p={p} />)}</div>
        </div>
      </div>
    </div>
  </div>;
}

/** Sublime's first gallery, then the team catalog today. */
export default function GalleryGrowth() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  return <SceneFrame scene={scene} stage={stage} title="the gallery, then and now"
    label="Sublime's Design Studio on day one: a list with one project, Agent Configuration, by Patrick, January 2026. Then today: a catalog of prototypes from Patrick, Joe, Ahry, AJ and Samantha across product design, product management and creative, newest first">
    <div style={{ position: 'relative', height: stage.box.height }} aria-hidden="true">
      <Screens id={step === 0 ? 'first' : 'today'}>
        <div style={{ position: 'relative', height: stage.box.height, overflow: 'hidden' }}>
          {step === 0 ? <FirstGallery /> : <TodayGallery />}
        </div>
      </Screens>
    </div>
  </SceneFrame>;
}
