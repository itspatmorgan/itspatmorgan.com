import { ArrowDown01Icon, CanvasIcon, CodeSquareIcon, LockPasswordIcon, Menu01Icon, Note01Icon, SecurityWarningIcon, Shield01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';
import { SceneFrame, Screens, useScene, useStage } from '../case-study/scene';
import { Rail, icon } from './StudioUI';

// The hero: Patrick's Phishing Training Beta prototype in the internal Studio (archive: src/prototypes/patrick/phishing-training-beta),
// chosen because one prototype holds every kind of artifact: documents, a canvas, lo-fi views and hi-fi views. Its Landing page canvas
// (canvases/landing-page-flow.json) opens on the handoff and the design context, then the hi-fi screens, then the lo-fi storyboard of
// the same flow. Frame labels and notes are the canvas's own; the views are rebuilt from the prototype's code
// (private-beta-product/private-beta-flow-v1.jsx for hi-fi, landing-page/private-beta-flow-v1.jsx and _components/ProductLofi.jsx for
// lo-fi) with the product's own type scale and palette, and scaled as the canvas scales a 1440 × 900 view.
// Liberties: the canvas stacks its sections; here "1. Start here" sits beside the other two so all three fit one screen. Each section
// shows one row (Private beta), its label beside the section title, "1. Start here" its two documents (Sam's two source prototypes are left out), and the section notes
// are shortened. Captions are drawn at reading size, not at the canvas's zoom. The prototype's views are light only;
// here they follow the page's theme. Product icons stand in with the closest Hugeicons. The sidebar is simplified to tell the story in
// order: the canvas, its two documents, then the lo-fi and hi-fi private-beta screens by their canvas labels (the real one also lists
// the archive canvas, the public-beta groups and the archive, and names views by their meta.json descriptions).
const timings = [4800, 3800, 3400, 4200];
const captions = [
  'One canvas holds the brief, the lo-fi sketch and the hi-fi flow',
  'Documents carry the why',
  'Lo-fi sketches the structure',
  'Hi-fi uses the product’s own components',
];

const VW = 1440, VH = 900, FRAME = 140, S = FRAME / VW;
const MAIN_W = 1000 - 48 - 236, OPEN_W = 880;

function Live({ children, scale, width = VW, height = VH }: { children: ReactNode; scale: number; width?: number; height?: number }) {
  return <div className="sc-live" style={{ width: width * scale, height: height * scale }}>
    <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{children}</div>
  </div>;
}

// ── The recipient flow ───────────────────────────────────────────────────────────────────────
function Notice() {
  const bullets: [typeof Shield01Icon, string][] = [
    [Shield01Icon, 'You clicked a link in a simulated phishing email.'],
    [LockPasswordIcon, 'This was a test, your account and data are safe.'],
    [Tick02Icon, 'You have a new assigned training you need to complete.'],
  ];
  return <div className="pt-card is-narrow pt-notice">
    <div className="pt-rings"><i /><i /><i>{icon(SecurityWarningIcon, 22, 2)}</i></div>
    <h2>This was a phishing simulation</h2>
    <p>This email was part of an internal security awareness campaign. No real threat was involved and no data was compromised.</p>
    <p>Because you clicked the link, your security team has assigned a short training.</p>
    <ul>{bullets.map(([i, t]) => <li key={t}>{icon(i, 16)}{t}</li>)}</ul>
    <span className="pt-button">Start training · 2 min</span>
    <small>Closing this page leaves training incomplete and may trigger a follow-up reminder.</small>
  </div>;
}

function Learn({ lofi }: { lofi: boolean }) {
  return <div className="pt-learn">
    <div className="pt-card">
      <h3>Why this email was suspicious</h3>
      <p>Review what made this message risky, one warning sign at a time.</p>
      <div className="pt-email">
        <div className="pt-email-head">
          <div><span>From</span><b>Microsoft Account Team</b><code>microsoft-alerts@secure-login-verify.net</code></div>
          <div><span>To</span><b>you@yourcompany.com</b></div>
          <div><span>Subject</span><b className="is-strong">Action Required: Verify your account to avoid suspension</b></div>
        </div>
        <div className="pt-email-body">
          <p>Dear User,</p>
          <p>We have detected unusual activity on your account. <strong>Your account will be suspended in 24 hours</strong> unless you verify your identity immediately.</p>
          <p>To keep your account active, please confirm your details using the button below.</p>
          <span className="pt-email-cta">Verify My Account</span>
          <p className="pt-email-sign">The Microsoft Team</p>
        </div>
      </div>
      <div className="pt-signs">
        <div className="pt-signs-head"><b>Warning signs</b><span>{[1, 2, 3].map(n => <i key={n}>{icon(Tick02Icon, 10, 2.4)}</i>)}<i className="is-on">4</i></span></div>
        {lofi
          ? <div className="pt-sign"><b>Suspicious link</b><p>Hovering the button reveals a destination that does not match Microsoft or the expected domain.</p></div>
          : <div className="pt-sign"><small>Suspicious link</small><b>“ms-verify-acct.ru/login”</b><p>Hovering the button reveals a destination that does not match Microsoft or the expected domain.</p></div>}
      </div>
      <span className="pt-button">{lofi ? 'Submit training' : 'Complete training'}</span>
    </div>
    <p className="pt-legal"><strong>Legal disclaimer:</strong> Any brand names, logos, or trademarks referenced in this simulation (including Microsoft, DocuSign, Google, and others) are used solely for educational and security awareness purposes. This simulation was not authorized by, affiliated with, or endorsed by those organizations. No data was collected or transmitted to any third party.</p>
  </div>;
}

function Done() {
  return <div className="pt-card is-narrow pt-done">
    <span className="pt-done-mark">{icon(Tick02Icon, 22, 2.2)}</span>
    <h2>Training complete</h2>
    <p>Thanks for completing this short security awareness training.</p>
    <div className="pt-attrib">
      <p>This simulation and training were conducted using Sublime Security. For questions, contact your security team.</p>
      <img className="is-light" src="/images/studio-case/logo-light-mode.svg" alt="" /><img className="is-dark" src="/images/studio-case/logo-dark-mode.svg" alt="" />
    </div>
  </div>;
}

function Page({ lofi, open, children }: { lofi: boolean; open?: boolean; children: ReactNode }) {
  return <div className={`pt ${lofi ? 'is-lofi' : ''} ${open ? 'is-open' : ''}`}>{children}</div>;
}

// ── The Design context document (documents/design-context.mdx in Studio's DocLayout) ────────────
function Doc() {
  return <article className="pt-doc">
    <h1>Design context</h1>
    {/* The doc's description, cut to its first clause so it sits on one line (Patrick, 2026-10-30). */}
    <p className="pt-doc-desc">Why recipient training is a stepped flow.</p>
    <p>This prototype is the <strong>recipient</strong> experience after someone clicks a simulated phishing email. For what to build, start with <a>Design handoff</a>. Admin create and campaign detail live in <a>Phishing Training Campaign Integration</a>.</p>
    <h2>Problem</h2>
    <p>A click is a stressful “was this real?” moment. The page has to:</p>
    <ul>
      <li>Tell the recipient it was a simulation</li>
      <li>Teach them quickly enough to finish (about 30 seconds to 2 minutes)</li>
      <li>Give the security team a completion signal, and in public beta a knowledge-check score</li>
    </ul>
    <p>Two audiences: the recipient (anxious, little patience) and the security team (evidence, optional org instructions, follow-up).</p>
    <h2>Source</h2>
    <p>Sam’s PM prototypes established the content. They stacked notice, training, org content, and a quiz on one page.</p>
  </article>;
}

// ── The Landing page canvas ─────────────────────────────────────────────────────────────────
type Frame = [string, string, ReactNode];
const docs: Frame[] = [
  ['Handoff: start here', 'What to build for the recipient training landing. Older explorations are on Archive - landing page.', <article className="pt-doc">
    <h1>Design handoff: Phishing Training Beta</h1>
    <p className="pt-doc-desc">Start here. Recipient training after a simulated phish: Notice, Learn, Done (private); plus optional Team note and knowledge check (public).</p>
    <h2>Build from</h2>
    <p>This prototype is the <strong>recipient-facing</strong> training landing after someone clicks a simulated phishing email. Build the hi-fi screens below. Lo-fi on the canvas is the same structure.</p>
    <p><strong>Private beta.</strong> Notice → Learn → Done.</p>
    <ul><li><a>Notice</a></li><li><a>Learn</a></li><li><a>Done</a></li></ul>
  </article>],
  ['Design context', 'Why this shape: problem, Sam’s source, direction, and open questions.', <Doc />],
];
const hifi: Frame[] = [
  ['1. Notice', 'Training Page enabled on a neutral customer training surface.', <Page lofi={false}><Notice /></Page>],
  ['2. Learn', 'Product-blue teaching accent for warning signs/highlights; muted email evidence.', <Page lofi={false}><Learn lofi={false} /></Page>],
  ['3. Done', 'Success treatment + Sublime attribution as infrastructure.', <Page lofi={false}><Done /></Page>],
];
const lofi: Frame[] = [
  ['1. Notice', 'Training Page enabled: assigns short training and Start training · 2 min.', <Page lofi><Notice /></Page>],
  ['2. Learn', 'All warning signs reviewed; Complete training finishes the flow.', <Page lofi><Learn lofi /></Page>],
  ['3. Done', 'Short completion confirmation.', <Page lofi><Done /></Page>],
];

function Card({ frame: [label, note, view], doc }: { frame: Frame; doc?: boolean }) {
  return <div className="sc-flow-card pt-frame">
    <Live scale={S}>{doc ? <div className="pt-doc-page">{view}</div> : view}</Live>
    <div className="sc-flow-caption"><b>{label}</b><p>{note}</p></div>
  </div>;
}

function Section({ title, note, row, frames, doc }: { title: string; note: string; row?: string; frames: Frame[]; doc?: boolean }) {
  return <section className="pt-sec">
    <header><h3>{title}</h3>{row && <h4>{row}</h4>}</header>
    <p>{note}</p>
    <div className={`pt-row ${doc ? 'is-stack' : ''}`}>{frames.map(f => <Card key={f[0]} frame={f} doc={doc} />)}</div>
  </section>;
}

function Canvas() {
  return <div className="sc-canvas">
    <span className="sc-canvas-menu">{icon(Menu01Icon, 16)}</span>
    <div className="pt-board">
      <Section title="1. Start here" note="Handoff first (what to build), then why this shape" frames={docs} doc />
      <div className="pt-col">
        <Section title="2. Hi-fi" note="Product-fidelity translations." row="Private beta" frames={hifi} />
        <Section title="3. Lo-fi" note="Baseline click landing first, then private and public training storyboards." row="Private beta" frames={lofi} />
      </div>
    </div>
    <div className="sc-zoomctl"><span>−</span><span style={{ minWidth: 34, textAlign: 'center' }}>30%</span><span>+</span></div>
  </div>;
}

const flow = ['Notice', 'Learn', 'Done'];

/** Ordered as the scene tells it: the canvas, the documents behind it, then the lo-fi flow and the hi-fi flow. */
function Side({ step }: { step: number }) {
  const group = (name: string, at: number) => <>
    <li className="is-group">{icon(ArrowDown01Icon, 13)}{name}</li>
    {flow.map(v => <li key={v} className={`is-child ${step === at && v === 'Learn' ? 'is-on' : ''}`}>{icon(CodeSquareIcon, 14)}{v}</li>)}
  </>;
  return <aside className="sc-side" aria-hidden="true">
    <h4>Phishing Training Beta</h4>
    <h5>Context</h5>
    <ul>
      <li className={step === 0 ? 'is-on' : ''}>{icon(CanvasIcon, 15)}Landing page</li>
      <li>{icon(Note01Icon, 15)}Design handoff</li>
      <li className={step === 1 ? 'is-on' : ''}>{icon(Note01Icon, 15)}Design context</li>
    </ul>
    <h5>Code</h5>
    <ul>
      {group('Lo-fi · Private beta', 2)}
      {group('Hi-fi · Private beta', 3)}
    </ul>
  </aside>;
}

function Opened({ step, height }: { step: number; height: number }) {
  if (step === 1) return <div className="pt-doc-page is-open" style={{ height }}><Doc /></div>;
  const s = MAIN_W / OPEN_W;
  return <Live scale={s} width={OPEN_W} height={height / s}><Page lofi={step === 2} open><Learn lofi={step === 2} /></Page></Live>;
}

/** Phishing Training Beta in the internal Studio: its canvas of documents, hi-fi and lo-fi views, then one of each opened. */
export default function Workspace() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  const h = stage.box.height;
  return <SceneFrame scene={scene} stage={stage} title="the project workspace"
    focus={step === 1 ? { x: 330, y: 10, w: 620, align: 'start', zoom: 1.7 } : step >= 2 ? { x: 400, y: 240, w: 485, align: 'start', zoom: 2 } : null}
    label="Patrick's Phishing Training Beta prototype in Sublime's Design Studio. Its Landing page canvas holds the handoff and design context documents, the hi-fi private beta flow, and the lo-fi storyboard of the same flow, with a note under every frame. Then the Design context document opens, then the lo-fi Learn screen, then the hi-fi one">
    <div className="sc-app" style={{ height: h }}>
      <Rail on="prototypes" />
      <Side step={step} />
      <div className="sc-main" aria-hidden="true">
        <Screens id={`s${step}`}>
          <div style={{ position: 'relative', height: h, overflow: 'hidden' }}>
            {step === 0 ? <Canvas /> : <Opened step={step} height={h} />}
          </div>
        </Screens>
      </div>
    </div>
  </SceneFrame>;
}
