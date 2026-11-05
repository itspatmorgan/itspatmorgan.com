import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowReloadHorizontalIcon, PauseIcon, PlayIcon } from '@hugeicons/core-free-icons';

// The case studies' controls under a stage (SceneTour in case-study/scene.tsx), for demos on this page that run their own steps:
// the caption on the left, then a segment per step that fills while it plays, and the play, pause or replay button. Same classes,
// so it looks and behaves the same. Without a caption the controls sit alone at the right.

type Props = {
  title: string;
  caption?: string;
  steps: { label: string; ms: number }[];
  current: number;
  /** Every step has played (the bar shows them all filled, and the button replays). */
  done: boolean;
  playing: boolean;
  /** Changes whenever the current step starts over, so its segment refills from empty. */
  cut: number;
  reduced: boolean;
  onJump: (i: number) => void;
  onToggle: () => void;
};

export default function StepBar({ title, caption, steps, current, done, playing, cut, reduced, onJump, onToggle }: Props) {
  const label = done ? `Replay ${title}` : `${playing ? 'Pause' : 'Play'} ${title}`;
  return <div className={`cs-tour ${caption === undefined ? 'is-quiet' : ''}`}>
    {caption !== undefined && <p className="cs-tour-caption" aria-live="polite"><span>{caption}</span></p>}
    <div className="cs-tour-controls">
      <ol className="cs-beats">
        {steps.map((s, i) => <li key={i}>
          <button type="button" className={done || i < current ? 'is-done' : i === current ? 'is-current' : ''} aria-current={i === current ? 'step' : undefined}
            aria-label={`Step ${i + 1} of ${steps.length}: ${s.label}`} onClick={() => onJump(i)}>
            <i key={i === current ? `on-${cut}` : 'idle'} style={i === current && !done ? { animationDuration: `${s.ms}ms`, animationPlayState: playing ? 'running' : 'paused' } : undefined} />
          </button>
        </li>)}
      </ol>
      {!reduced && <button type="button" className="cs-tour-play" aria-label={label} title={label} onClick={onToggle}>
        <HugeiconsIcon icon={done ? ArrowReloadHorizontalIcon : playing ? PauseIcon : PlayIcon} size={14} strokeWidth={1.8} />
      </button>}
    </div>
  </div>;
}
