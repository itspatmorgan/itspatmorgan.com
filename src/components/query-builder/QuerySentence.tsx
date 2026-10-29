import type { ReactNode } from 'react';
import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

function Kw({ children }: { children: string }) { return <span className="q-code-keyword">{children}</span>; }
function Arrow({ children }: { children: string }) { return <span className="q-code-arrow">{children}</span>; }

// Every J1QL query has the same shape; each part maps to one of the builder moves that follow.
const parts: { code: ReactNode; label: string }[] = [
  { code: <><Kw>FIND</Kw> DataStore</>, label: 'What to find' },
  { code: <><Kw>WITH</Kw> tag.pltfm_env <Arrow>=</Arrow> “production”</>, label: 'Which ones' },
  { code: <><Kw>THAT</Kw> ALLOWS <Arrow>&lt;&lt;</Arrow> AccessPolicy</>, label: 'How it connects' },
];
const timings = [1400, 1800, 1800, 1800, 3400];
const captions = ['Every J1QL query has the same three parts', 'What to find: a type of asset', 'Which ones: a property and its value', 'How it connects: a relationship to another asset', 'Each part maps to one move in the builder'];

/** The shape of a J1QL query, read part by part. */
export default function QuerySentence() {
  const scene = useScene(timings, captions);
  const active = scene.step >= 1 && scene.step <= parts.length ? scene.step - 1 : -1;
  const labelled = scene.step === 0 ? 0 : Math.min(scene.step, parts.length);
  return <DemoFrame scene={scene} title="the query's parts" label="A J1QL query split into three parts: what to find, which ones, and how it connects"><div className="cs-demo qb-sentence">
    <div className="qb-film-stage"><NativeStage width={1160} height={300}>
      <div className="q-sentence">
        {parts.map((part, i) => <div key={part.label} className={`q-part ${i === active ? 'is-active' : ''} ${i < labelled ? 'is-labelled' : ''}`}>
          <code>{part.code}</code>
          <span className="q-part-bracket" aria-hidden="true" />
          <span className="q-part-label">{part.label}</span>
        </div>)}
      </div>
    </NativeStage></div>
  </div></DemoFrame>;
}
