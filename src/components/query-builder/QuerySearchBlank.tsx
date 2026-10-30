import { SourceIcon } from './NativeUI';
import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, usePhone, useScene } from '../case-study/scene';

// Two false starts at J1QL syntax (the box only accepted queries), then back to an empty box.
const attempts = ['FIND User THAT', 'FIND aws_'];
const frames: { text: string; ms: number }[] = [{ text: '', ms: 1400 }];
for (const attempt of attempts) {
  for (let i = 1; i <= attempt.length; i++) frames.push({ text: attempt.slice(0, i), ms: i === attempt.length ? 1300 : 75 });
  for (let i = attempt.length - 1; i >= 0; i--) frames.push({ text: attempt.slice(0, i), ms: i ? 28 : 700 });
}
const durations = frames.map(f => f.ms);
const captions = frames.map((f, i) => (i === 0 ? 'An empty box, with no hint of what to ask' : 'A new customer guesses at the syntax, then deletes it'));

/** The original starting point: a free-form search box with no guidance. */
export default function QuerySearchBlank() {
  const scene = useScene(durations, captions);
  const text = frames[scene.step].text;
  // A phone crops to the field's start, where the typing happens.
  const phone = usePhone();
  return <DemoFrame scene={scene} caption={false} title="the search box" label="The original free-form search box"><div className="cs-demo qb-search-blank">
    <div className="qb-film-stage"><NativeStage width={720} height={200} crop={phone ? { x: 40, y: 40, width: 520, height: 120 } : undefined}>
      <div className="q-blank-search">
        <div className="q-blank-field">
          <SourceIcon name="Search" size={24} />
          <span className="q-blank-input">{text && <span>{text}</span>}<i className={`q-blank-caret ${text ? '' : 'q-blank-idle'}`} />{!text && <span className="q-blank-placeholder">Search</span>}</span>
        </div>
      </div>
    </NativeStage></div>
  </div></DemoFrame>;
}
