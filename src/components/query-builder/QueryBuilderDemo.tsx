import type { ReactNode } from 'react';
import { NativeBuilder, NativeStage, DemoControls } from './NativeUI';
import { useDemoLoop } from './useDemoLoop';
import './query-builder.css';

function Kw({ children }: { children: string }) { return <span className="q-code-keyword">{children}</span>; }
function Arrow({ children }: { children: string }) { return <span className="q-code-arrow">{children}</span>; }
function Clause({ part, indent = false, children }: { part: string; indent?: boolean; children: ReactNode }) {
  return <span className={`q-code-clause ${indent ? 'q-code-indent' : ''}`} data-query-part={part}>{children}</span>;
}

const views = ['Code', 'Visual'] as const;
const timings = [4200, 5200];

/** One query, one view at a time: clauses translate in order between code and controls. */
export default function QueryBuilderDemo() {
  const loop = useDemoLoop(timings, 0, false);
  const view = loop.step;
  return <figure className="qb-demo qb-query-demo qb-query-toggle" ref={loop.ref} data-view={views[view]} aria-label="The same query as J1QL and as visual controls">
    <div className="qb-view-toggle" role="group" aria-label="Query view">
      {views.map((label, i) => <button type="button" key={label} aria-pressed={view === i} onClick={() => loop.choose(i)}>{label}</button>)}
    </div>
    <div className="qb-query-stage"><NativeStage width={960} height={600}>
      <div className="q-toggle-canvas">
        <div className="q-toggle-view q-toggle-code" data-active={view === 0} aria-hidden={view !== 0}><code>
          <Clause part="0"><Kw>FIND</Kw> DataStore</Clause>
          <Clause part="1"><Kw>WITH</Kw> tag.pltfm_env <Arrow>=</Arrow> “production”</Clause>
          <Clause part="2" indent><Kw>THAT</Kw> ALLOWS <Arrow>&lt;&lt;</Arrow> AccessPolicy</Clause>
          <Clause part="optional" indent>(<Kw>THAT</Kw> ASSIGNED <Arrow>&gt;&gt;</Arrow> AccessRole)?</Clause>
        </code></div>
        <div className="q-toggle-view q-toggle-builder q-query-builder" data-active={view === 1} aria-hidden={view !== 1} inert><NativeBuilder queryStep={3} filterPhase={12} relation /></div>
      </div>
    </NativeStage></div>
    <DemoControls loop={loop} title="query translation" caption={`Showing the ${views[view].toLowerCase()} view of the query`} />
  </figure>;
}
