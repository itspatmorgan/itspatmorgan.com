import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// How every agent learns the team's rules, drawn from Patrick's map of the internal Studio's agent setup (Drive:
// sublime-agent-rules.jpg; the archive's AGENTS.md and agent/rules/agent-architecture.md). Every coding agent the team uses (Codex,
// Claude Code, Cursor) is pointed at AGENTS.md by its own small file, named here by the agent rather than the file (Patrick, 2026-10-30). AGENTS.md which loads some rules on every task, opens others only when a task calls for them, and links skills for set
// procedures. File and skill names are the archive's.
// Liberties, for clarity: each group shows three of its files (the archive has 5 always-loaded rules, 7 on-demand rules and 9
// skills), and the source's sub-groups (systems, platform and tools, workflow, setup) are folded into their parents.
const timings = [1200, 1400, 3800];
const captions = ['Every coding agent starts from the same place', 'AGENTS.md, the shared entry point', 'Rules load always, on demand, or as skills'];

const agents = [[200, 'Codex'], [480, 'Claude Code'], [760, 'Cursor']] as const;
const groups = [
  [190, 'Always loaded', 'On every task', ['systems.md', 'fidelity.md', 'conventions.md']],
  [480, 'On demand', 'When the task calls for it', ['product-prototyping.md', 'canvases.md', 'documents.md']],
  [770, 'Skills', 'When an ask matches', ['critique-design', 'explore-designs', 'write-design-handoff']],
] as const;

/** Every coding agent reads AGENTS.md, which loads rules always, on demand, or as skills. */
export default function RulesMap() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const curve = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="the agent rules map"
    label="Codex, Claude Code and Cursor all read AGENTS.md, the shared entry point. It loads some rules on every task, such as systems and conventions; opens others when a task calls for them, such as product prototyping; and links skills such as critique-design when an ask matches">
    <div className="cs-demo">
      <NativeStage width={960} height={697}>
        <div className="sc-dia sc-rules">
          <svg className="sc-line" viewBox="0 0 960 697" aria-hidden="true">
            {agents.map(([x]) => <path key={x} className={step >= 1 ? '' : 'is-off'} d={curve(x, 146, 480, 226)} />)}
            {groups.map(([x]) => <path key={x} className={step >= 2 ? '' : 'is-off'} d={curve(480, 290, x, 376)} />)}
          </svg>
          {agents.map(([x, name]) => <div key={name} className="sc-rule is-agent" style={{ left: x - 110, top: 94, width: 220, height: 52 }}><b>{name}</b></div>)}
          <div className={`sc-rule is-entry ${step >= 1 ? '' : 'is-off'}`} style={{ left: 360, top: 226, width: 240, height: 64 }}><b>AGENTS.md</b><span>The shared entry point</span></div>
          {groups.map(([x, title, when, files]) => <div key={title} className={`sc-rule-group ${step >= 2 ? '' : 'is-off'}`} style={{ left: x - 130, top: 376, width: 260 }}>
            <h3>{title}</h3>
            <p>{when}</p>
            <ul>{files.map(f => <li key={f}>{f}</li>)}</ul>
          </div>)}
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
