import type { ReactNode } from 'react';
import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';

function Kw({ children }: { children: string }) { return <span className="q-code-keyword">{children}</span>; }
function Arrow({ children }: { children: string }) { return <span className="q-code-arrow">{children}</span>; }

// Every J1QL query has the same shape; each part maps to one of the builder moves that follow.
const parts: { code: ReactNode; label: string }[] = [
  { code: <><Kw>FIND</Kw> DataStore</>, label: 'What to find' },
  { code: <><Kw>WITH</Kw> tag.pltfm_env <Arrow>=</Arrow> “production”</>, label: 'Which ones' },
  { code: <><Kw>THAT</Kw> ALLOWS <Arrow>&lt;&lt;</Arrow> AccessPolicy</>, label: 'How it connects' },
];
const timings = [1400, 1800, 1800, 1800, 3400];

/** The shape of a J1QL query, read part by part. */
export default function QuerySentence() {
  const loop = useDemoLoop(timings, timings.length - 1);
  const active = loop.step >= 1 && loop.step <= parts.length ? loop.step - 1 : -1;
  const labelled = loop.step === 0 ? 0 : Math.min(loop.step, parts.length);
  return <figure className={`cs-demo qb-sentence ${loop.resetting ? 'cs-loop-reset' : ''}`} ref={loop.ref} aria-label="A J1QL query split into three parts: what to find, which ones, and how it connects">
    <div className="qb-film-stage"><NativeStage width={1160} height={300}>
      <div className="q-sentence">
        {parts.map((part, i) => <div key={part.label} className={`q-part ${i === active ? 'is-active' : ''} ${i < labelled ? 'is-labelled' : ''}`}>
          <code>{part.code}</code>
          <span className="q-part-bracket" aria-hidden="true" />
          <span className="q-part-label">{part.label}</span>
        </div>)}
      </div>
    </NativeStage></div>
    <DemoControls loop={loop} title="query structure" caption={active >= 0 ? parts[active].label : 'A complete J1QL query'} />
  </figure>;
}
