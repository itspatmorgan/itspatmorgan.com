import { SourceIcon } from './NativeUI';
import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';

// Two false starts at J1QL syntax (the box only accepted queries), then back to an empty box.
const attempts = ['FIND User THAT', 'FIND aws_'];
const frames: { text: string; ms: number }[] = [{ text: '', ms: 1400 }];
for (const attempt of attempts) {
  for (let i = 1; i <= attempt.length; i++) frames.push({ text: attempt.slice(0, i), ms: i === attempt.length ? 1300 : 75 });
  for (let i = attempt.length - 1; i >= 0; i--) frames.push({ text: attempt.slice(0, i), ms: i ? 28 : 700 });
}
const durations = frames.map(f => f.ms);

/** The original starting point: a free-form search box with no guidance. */
export default function QuerySearchBlank() {
  const loop = useDemoLoop(durations, 0, false);
  const text = frames[loop.step].text;
  return <figure className="qb-demo qb-search-blank" ref={loop.ref} aria-label="The original free-form search box">
    <div className="qb-film-stage"><NativeStage width={720} height={200}>
      <div className="q-blank-search">
        <div className="q-blank-field">
          <SourceIcon name="Search" size={24} />
          <span className="q-blank-input">{text && <span>{text}</span>}<i className={`q-blank-caret ${text ? '' : 'q-blank-idle'}`} />{!text && <span className="q-blank-placeholder">Search</span>}</span>
        </div>
      </div>
    </NativeStage></div>
    <DemoControls loop={loop} title="search attempt" caption={text ? `Typing “${text}”` : 'An empty search box'} />
  </figure>;
}
