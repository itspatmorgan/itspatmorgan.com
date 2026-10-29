import type { ReactNode } from 'react';
import { NativeStage } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';

// The deck's "Defining the System" diagram: each bot defense question resolves to a piece the platform already had.
const pieces: { question: ReactNode; piece: string }[] = [
  { question: <>How do I <b>detect</b> bot anomalies & attacks?</>, piece: 'Signals' },
  { question: <>How do I <b>take action</b> to stop bots?</>, piece: 'Rules & Alerts' },
  { question: <>How do I <b>monitor</b> bot activity?</>, piece: 'Dashboards' },
];
const timings = [900, 1400, 1400, 1400, 3600];

/** Bot defense, decomposed into pieces the platform already had. */
export default function ThreePieces() {
  const loop = useDemoLoop(timings, 0, true, true);
  const answered = loop.step;
  return <figure className={`cs-demo xp-pieces ${loop.resetting ? 'cs-loop-reset' : ''}`} ref={loop.ref} aria-label="Three questions, each answered by an existing platform piece: detect with Signals, take action with Rules and Alerts, monitor with Dashboards">
    <NativeStage width={960} height={697}>
      <div className="xp-center"><div className="xp-pieces">{pieces.map((row, i) => {
        const shown = i < answered;
        return <div key={row.piece}>
          <span className="xp-pill"><span>{row.question}</span></span>
          <div className="xp-answer">
            <i className={`xp-elbow ${shown ? '' : 'xp-off'}`} />
            <span className={`xp-chip-white ${shown ? '' : 'xp-off'}`}>{row.piece}</span>
          </div>
        </div>;
      })}</div></div>
    </NativeStage>
    <figcaption className="sr-only">{answered >= pieces.length ? 'Signals, Rules & Alerts, and Dashboards already existed' : answered ? `${pieces[answered - 1].piece} already existed` : 'Three questions customers asked'}</figcaption>
  </figure>;
}
