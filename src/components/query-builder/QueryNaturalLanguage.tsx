import type { ReactNode } from 'react';
import { SourceIcon } from './NativeUI';
import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

// A plain-language question, then its J1QL translation one clause at a time; each clause lights the words it came from.
const segments: { text: string; clause?: number }[] = [
  { text: 'Show ' }, { text: 'production', clause: 1 }, { text: ' ' }, { text: 'data stores', clause: 0 },
  { text: ' and the ' }, { text: 'access policies that allow them', clause: 2 },
];
const question = segments.map(s => s.text).join('');

function Kw({ children }: { children: string }) { return <span className="q-code-keyword">{children}</span>; }
function Arrow({ children }: { children: string }) { return <span className="q-code-arrow">{children}</span>; }
const clauses: ReactNode[] = [
  <><Kw>FIND</Kw> DataStore</>,
  <><Kw>WITH</Kw> tag.pltfm_env <Arrow>=</Arrow> “production”</>,
  <><Kw>THAT</Kw> ALLOWS <Arrow>&lt;&lt;</Arrow> AccessPolicy</>,
];

type Frame = { typed: number; shown: number; active: number; ms: number };
const frames: Frame[] = [{ typed: 0, shown: 0, active: -1, ms: 900 }];
for (let i = 1; i <= question.length; i++) frames.push({ typed: i, shown: 0, active: -1, ms: i === question.length ? 700 : 38 });
for (let c = 0; c < clauses.length; c++) frames.push({ typed: question.length, shown: c + 1, active: c, ms: 1500 });
frames.push({ typed: question.length, shown: clauses.length, active: -1, ms: 3200 });
const durations = frames.map(f => f.ms);
const clauseCaptions = ['“Data stores” becomes what to find', '“Production” becomes a property filter', '“Access policies that allow them” becomes a relationship'];
const captions = frames.map(f => (f.active >= 0 ? clauseCaptions[f.active] : f.shown ? 'The question and its whole query' : 'A question in plain language'));

/** Today's entry point: natural language in, the query language out, taught through the translation. */
export default function QueryNaturalLanguage() {
  const scene = useScene(durations, captions);
  const { typed, shown, active } = frames[scene.step];
  const complete = typed === question.length;
  return <DemoFrame scene={scene} title="the translation" label="A plain-language question translated into J1QL"><div className="cs-demo qb-nl">
    <div className="qb-film-stage"><NativeStage width={960} height={400}>
      <div className="q-nl-canvas">
        <div className="q-blank-field q-nl-field">
          <SourceIcon name="Search" size={24} />
          <span className="q-nl-question">{complete
            ? segments.map((s, i) => s.clause === undefined ? <span key={i}>{s.text}</span> : <span key={i} className={`q-nl-phrase ${s.clause === active ? 'is-active' : ''} ${s.clause < shown && s.clause !== active ? 'is-done' : ''}`}>{s.text}</span>)
            : <>{question.slice(0, typed)}<i className="q-blank-caret" /></>}</span>
        </div>
        <div className="q-nl-output">
          <code>{clauses.map((clause, i) => <span key={i} className={`q-nl-clause ${i === 2 ? 'q-code-indent' : ''} ${i < shown ? 'is-shown' : ''} ${i === active ? 'is-active' : ''}`}>{clause}</span>)}</code>
        </div>
      </div>
    </NativeStage></div>
  </div></DemoFrame>;
}
