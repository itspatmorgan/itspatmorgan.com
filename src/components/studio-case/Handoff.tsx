import { ArrowDown01Icon, ArrowRight01Icon, CodeIcon } from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';
import { Pointer, SceneFrame, useScene, useStage, useTargets } from '../case-study/scene';
import { AgentsHub } from '../sublime/AgentsHub';
import { Page } from '../sublime/SublimeUI';
import { Rail, icon } from './StudioUI';

// How engineering builds from a prototype: Patrick's dev handoff for the Agents hub (archive: src/prototypes/patrick/mttc), the work
// behind the Sublime agents case study. The handoff is the prototype itself: one clickable flow of live pages per phase, each page
// carrying a note on what dev builds for it, tagged New, Changed, Existing or No change (components/HandoffNote.jsx, HandoffPages.jsx).
// Engineers' agents build from it with skills engineering wrote (Patrick, 2026-10-30). The note is the hub's real phase 1 note.
// Liberties: the hub shows its both-agents-with-data state (the site's AgentsHub rebuild); view and group names are meta.json's,
// shortened to fit the sidebar; the page is scaled to the Studio's main area, while the note keeps its own size, as it is pinned to the
// Studio's window rather than the page, and it sits just under the cards so the frame's fade doesn't cover it.
const timings = [2600, 4600, 3400];
const captions = [
  'The handoff is the prototype, split into phases',
  'A note on each screen says what to build',
  'Every screen keeps its real behavior',
];

// The page renders 1320 wide and scales to the main area, so the cards end high enough to leave the note room below them.
const MAIN_W = 1000 - 48 - 236, SRC_W = 1320, S = MAIN_W / SRC_W;
const flow = ['Agents hub', 'ADÉ page', 'ADÉ automation', 'ASA page', 'ASA automation'];

function Side() {
  return <aside className="sc-side" aria-hidden="true">
    <h4>MTTC</h4>
    <h5>Code</h5>
    <ul>
      <li>{icon(CodeIcon, 14)}Agents Hub</li>
      <li>{icon(CodeIcon, 14)}ADÉ Detail</li>
      <li>{icon(CodeIcon, 14)}ASA Detail</li>
      <li className="is-group">{icon(ArrowRight01Icon, 13)}Dev handoff: start each phase</li>
      <li className="is-group">{icon(ArrowDown01Icon, 13)}Flow screens</li>
      {flow.map((v, i) => <li key={v} className={`is-child ${i === 0 ? 'is-on' : ''}`}>{icon(CodeIcon, 14)}Phase 1 · {v}</li>)}
      <li className="is-group">{icon(ArrowRight01Icon, 13)}Archive</li>
    </ul>
  </aside>;
}

function Note({ show }: { show: boolean }) {
  return <aside className={`sc-note ${show ? '' : 'is-off'}`}>
    <div className="sc-note-head">
      <span className="sc-note-tag">Changed</span>
      <span className="sc-note-phase">Phase 1</span>
      <span className="sc-note-hide">Hide</span>
    </div>
    <p className="sc-note-title">Agents hub</p>
    <p className="sc-note-body">The two cards split the width 50/50 with a one-line caption each. ASA shows Hrs Saved and Investigations. ADÉ shows Time to Coverage: it is the only stat until ADÉ has data, then it comes first. It shows the platform average until ADÉ’s first recommended rule.</p>
  </aside>;
}

function Live({ children, height }: { children: ReactNode; height: number }) {
  return <div className="sc-live" style={{ width: MAIN_W, height }}>
    <div className="sb sb-embed" style={{ width: SRC_W, height: height / S, transform: `scale(${S})` }}>{children}</div>
  </div>;
}

/** The Agents hub's dev handoff in the internal Studio: the live page, its phase note, then the page's own hover. */
export default function Handoff() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1000, height: 760 });
  const step = scene.step;
  const t = useTargets(step);
  const hover = step >= 2 ? 'ade' : null;
  return <SceneFrame scene={scene} stage={stage} title="the engineering handoff" focus={step >= 1 ? { x: 600, y: 520, w: 384, align: 'end', zoom: 1.5 } : null}
    label="Patrick's dev handoff for Sublime's Agents hub, in Design Studio. The handoff is the prototype itself, split into phases: the live Agents hub, with a note pinned to the corner for engineering. The note is tagged Changed, phase 1, and says what to build: the two agent cards split the width, and ADÉ shows Time to Coverage first. The page keeps its real behavior: hovering the ADÉ card lifts it">
    <div className="sc-app" ref={t.ref} style={{ height: stage.box.height }}>
      <Rail on="prototypes" />
      <Side />
      <div className="sc-main" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden' }}>
        <Live height={stage.box.height}>
          <Page crumbs={['Agents']}><AgentsHub hover={hover} /></Page>
        </Live>
        <Note show={step >= 1} />
      </div>
      <Pointer at={step >= 2 ? t.at('card-ade') : null} visible={step >= 2} reduced={scene.reduced} />
    </div>
  </SceneFrame>;
}
