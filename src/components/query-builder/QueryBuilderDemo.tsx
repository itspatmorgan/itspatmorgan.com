import { NativeBuilder, NativeStage, DemoControls } from './NativeUI';
import { useDemoLoop } from './useDemoLoop';
import './query-builder.css';

const durations = [1800, 2200, 2600, 2100, 2100, 2100, 4200] as const;
const captions = ['Start with a graph entity.', 'Filter based on its properties.', 'Add a graph relationship.', 'Follow an optional connection.', 'Continue through the graph.', 'Keep optional paths distinct.', 'One question, expressed as code and UI.'];
function Kw({ children }: { children: string }) { return <span className="q-code-keyword">{children}</span>; }
function Arrow({ children }: { children: string }) { return <span className="q-code-arrow">{children}</span>; }

export default function QueryBuilderDemo() {
  const loop = useDemoLoop(durations, 6);
  const step = loop.step;
  return <figure className={`qb-demo qb-query-demo ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="Query builder walkthrough" data-step={step}>
    <div className="qb-query-stage"><NativeStage width={1000} height={716} interactive={false}>
      <div className="q-query-comparison">
        <div className="q-query-code" aria-label="J1QL query"><code>
          <div className="q-code-line"><Kw>FIND</Kw> DataStore</div>
          <div className={`q-code-line q-code-appearing ${step >= 1 ? 'q-code-shown' : ''}`}><Kw>WITH</Kw> tag.pltfm_env <Arrow>=</Arrow> “production”</div>
          <div className={`q-code-line q-code-indent q-code-appearing ${step >= 2 ? 'q-code-shown' : ''}`}><Kw>THAT</Kw> ALLOWS <Arrow>&lt;&lt;</Arrow> AccessPolicy</div>
          <div className={`q-code-line q-code-indent q-code-appearing ${step >= 3 ? 'q-code-shown' : ''}`}>(<Kw>THAT</Kw> ASSIGNED <Arrow>&gt;&gt;</Arrow> AccessRole)?</div>
          <div className={`q-code-line q-code-indent q-code-appearing ${step >= 4 ? 'q-code-shown' : ''}`}>(<Kw>THAT</Kw> USES <Arrow>&lt;&lt;</Arrow> google_iam_binding)?</div>
          <div className={`q-code-line q-code-indent q-code-appearing ${step >= 5 ? 'q-code-shown' : ''}`}>(<Kw>THAT</Kw> ASSIGNED <Arrow>&gt;&gt;</Arrow> UserGroup)?</div>
          <div className={`q-code-line q-code-indent q-code-appearing ${step >= 6 ? 'q-code-shown' : ''}`}><Kw>THAT</Kw> (ASSIGNED|HAS) <Arrow>&gt;&gt;</Arrow> User <Kw>WITH</Kw> _type <Arrow>!=</Arrow> “google_iam_service_account”</div>
        </code></div>
        <div className="q-query-builder"><NativeBuilder queryStep={step} filterPhase={step >= 1 ? 12 : -1} relation={step >= 2} /></div>
      </div>
    </NativeStage></div>
    <DemoControls loop={loop} title="query walkthrough" caption={captions[step]} />
  </figure>;
}
