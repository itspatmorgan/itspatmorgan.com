import { StudioWindow, useAutoplay, type Key } from './explore/StudioWindow';
import './studio-hero.css';

// How you work in Design Studio: you ask your agent, and it writes the artifact into the prototype. One request per kind of artifact,
// each with the file it becomes in the Feedback Inbox sample (src/prototypes/parker/feedback-inbox), and that file opened beside it.
// The requests teach the move; they aren't prompts to copy.

const asks: { key: Key; kind: string; ask: string; file: string }[] = [
  { key: 'inbox', kind: 'A screen', ask: 'Prototype a feedback inbox with our Product system: a table with status and priority, filters, and a panel to add feedback.', file: 'app/feedback-inbox.tsx' },
  { key: 'lofi', kind: 'A lo-fi version', ask: 'Make a lo-fi copy of the inbox so we can settle the layout before the polish.', file: 'discovery/lofi-inbox.tsx' },
  { key: 'flow', kind: 'A diagram', ask: 'Map how feedback moves from recorded to resolved.', file: 'discovery/feedback-flow.mermaid' },
  { key: 'handoff', kind: 'A canvas', ask: 'Lay out every screen and state of the inbox on a canvas for engineering.', file: 'eng-handoff.excalidraw' },
  { key: 'context', kind: 'A document', ask: 'Write up the problem, who it’s for, our assumptions and the open questions.', file: 'discovery/project-context.md' },
];

export default function StudioAsk() {
  const play = useAutoplay(asks.length, 4800);
  const on = asks[play.index];
  return <div className="hx-ask" ref={play.ref}>
    <ol className="hx-asks" role="tablist" aria-label="Ask for an artifact">
      {asks.map((a, i) => <li key={a.key}>
        <button type="button" role="tab" aria-selected={i === play.index} className={i === play.index ? 'is-on' : ''} onClick={() => play.pick(i)}>
          <span className="hx-kind">{a.kind}</span>
          <span className="hx-bubble">{a.ask}</span>
          <code className="hx-file">{a.file}</code>
          <i className="hx-progress">{i === play.index && play.playing && <b key={play.index} />}</i>
        </button>
      </li>)}
    </ol>
    <StudioWindow shown={on.key} min={0.5} crop="pane" className="hx-ask-window" />
  </div>;
}
