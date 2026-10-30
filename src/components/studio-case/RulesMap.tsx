import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// How every agent learns the team's rules: the map Patrick drew of the internal Studio's agent setup (Drive: sublime-agent-rules.jpg;
// the archive's AGENTS.md and agent/rules/agent-architecture.md). Each harness's own file points at AGENTS.md, the shared entry index;
// it loads a small set of rules on every task, opens system and platform rules only when the task calls for them, and links skills
// for one-off procedures. File and skill names are the archive's. The map builds level by level, then holds.
// Liberties: the source's filled blue and orange boxes are drawn as outlines in quieter tones, to sit with the site's other diagrams.
const timings = [900, 1000, 1100, 1300, 3600];
const captions = ['Each coding agent’s own file points to one place', 'AGENTS.md, the shared entry index', 'Rules load always, on demand, or as skills', 'Each group names its files', 'Each group names its files'];

const C = [108, 294, 480, 666, 852];
const LEAF_Y = [398, 464, 530, 596, 662];
const always = ['systems.md', 'fidelity.md', 'conventions.md', 'prototype-workflow.md', 'contributor-scope.md'];
const systems = ['product-prototyping.md', 'brand-design.md', 'studio-development.md'];
const platform = ['documents.md', 'canvases.md', 'blueprints.md', 'agent-architecture.md'];
const workflow = ['fork-blueprint', 'critique-design', 'explore-designs', 'write-design-handoff'];
const setup = ['setup-contributor', 'migrate-vault-component', 'clarify-platform', 'promote-tool', 'author-guide-page'];

function Box({ x, y, w = 176, h = 40, kind = '', on, title, sub }: { x: number; y: number; w?: number; h?: number; kind?: string; on: boolean; title: string; sub?: string }) {
  return <div className={`sc-rule ${kind} ${on ? '' : 'is-off'}`} style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}>
    <b>{title}</b>{sub && <span>{sub}</span>}
  </div>;
}

/** CLAUDE.md, Cursor and Copilot point at AGENTS.md, which loads rules always, on demand, or as skills. */
export default function RulesMap() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.reduced ? timings.length - 1 : scene.step;
  const curve = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="the agent rules map"
    label="CLAUDE.md, Cursor rules and Copilot instructions all point at AGENTS.md, the shared entry index. It loads five rules on every task (systems, fidelity, conventions, prototype workflow, contributor scope), opens system and platform rules when relevant, and links skills such as critique-design and setup-contributor when a request matches">
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia sc-rules">
          <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true">
            {[C[0], C[2], C[4]].map(x => <path key={x} className={step >= 1 ? '' : 'is-off'} d={curve(x, 58, 480, 112)} />)}
            <path className={`is-blue ${step >= 2 ? '' : 'is-off'}`} d={curve(480, 150, C[0], 206)} />
            <path className={step >= 2 ? '' : 'is-off'} d={curve(480, 150, 387, 206)} />
            <path className={`is-warm ${step >= 2 ? '' : 'is-off'}`} d={curve(480, 150, 759, 206)} />
            <path className={`is-dash ${step >= 3 ? '' : 'is-off'}`} d={curve(387, 244, C[1], 290)} />
            <path className={`is-dash ${step >= 3 ? '' : 'is-off'}`} d={curve(387, 244, C[2], 290)} />
            <path className={`is-warm is-dash ${step >= 3 ? '' : 'is-off'}`} d={curve(759, 244, C[3], 290)} />
            <path className={`is-warm is-dash ${step >= 3 ? '' : 'is-off'}`} d={curve(759, 244, C[4], 290)} />
            <path className={`is-blue ${step >= 3 ? '' : 'is-off'}`} d={`M${C[0]} 244 L${C[0]} 646`} />
            {[C[1], C[2]].map(x => <path key={x} className={`is-dash ${step >= 3 ? '' : 'is-off'}`} d={`M${x} 330 L${x} 646`} />)}
            {[C[3], C[4]].map(x => <path key={x} className={`is-warm is-dash ${step >= 3 ? '' : 'is-off'}`} d={`M${x} 330 L${x} 646`} />)}
          </svg>
          <Box x={C[0]} y={38} w={170} h={44} on title="CLAUDE.md" sub="points at AGENTS.md" />
          <Box x={C[2]} y={38} w={170} h={44} on title=".cursor/rules/*.mdc" sub="points at AGENTS.md" />
          <Box x={C[4]} y={38} w={190} h={44} on title="copilot-instructions.md" sub="points at AGENTS.md" />
          <Box x={480} y={131} w={180} h={40} kind="is-entry" on={step >= 1} title="AGENTS.md" sub="shared entry index" />
          <Box x={C[0]} y={225} w={150} h={40} kind="is-group" on={step >= 2} title="Always-loaded" sub="every task" />
          <Box x={387} y={225} w={150} h={40} kind="is-group" on={step >= 2} title="On-demand rules" sub="when relevant" />
          <Box x={759} y={225} w={150} h={40} kind="is-group" on={step >= 2} title="Skills" sub="when the ask matches" />
          <Box x={C[1]} y={310} h={40} kind="is-group" on={step >= 3} title="Systems" sub="after systems.md" />
          <Box x={C[2]} y={310} h={40} kind="is-group" on={step >= 3} title="Platform & tools" sub="specialist work" />
          <Box x={C[3]} y={310} h={40} kind="is-group" on={step >= 3} title="Design workflow" sub="linked from Skills" />
          <Box x={C[4]} y={310} h={40} kind="is-group" on={step >= 3} title="Setup & platform" sub="ask the agent" />
          {always.map((t, i) => <Box key={t} x={C[0]} y={LEAF_Y[i] - 16} h={30} kind="is-blue" on={step >= 3} title={t} />)}
          {systems.map((t, i) => <Box key={t} x={C[1]} y={LEAF_Y[i] - 16} h={30} kind="is-quiet" on={step >= 3} title={t} />)}
          {platform.map((t, i) => <Box key={t} x={C[2]} y={LEAF_Y[i] - 16} h={30} kind="is-quiet" on={step >= 3} title={t} />)}
          {workflow.map((t, i) => <Box key={t} x={C[3]} y={LEAF_Y[i] - 16} h={30} kind="is-warm" on={step >= 3} title={t} />)}
          {setup.map((t, i) => <Box key={t} x={C[4]} y={LEAF_Y[i] - 16} h={30} kind="is-warm" on={step >= 3} title={t} />)}
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
