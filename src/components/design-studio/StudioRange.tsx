import type { CSSProperties } from 'react';
import { DemoFrame, useScene } from '../case-study/scene';
import './studio-shapes.css';

// Where Design Studio sits, as points on a two-by-two: flexibility to explore across, truth to your product up. Each quadrant is
// named, each point says what it is in plain words (no product names), and Design Studio lands where the line up from one-off
// prototypes meets the line across from the production repo: the flexibility of one, the truth of the other. Drawn in the site's
// own line work (hairlines, square marks) and its ink and gold, at real type sizes so it reads on a phone too.
const timings = [2400, 2400, 4600];
const captions = [
  'One-off prototypes are flexible, but connect to nothing',
  'The production repo is true to the product, but slow to explore in',
  'Design Studio takes flexibility from one and the product from the other',
];

// `at` places the label clear of the guide lines: beside the mark, or under or over it.
type Point = { x: number; y: number; name: string; note: string; at: 'right' | 'left' | 'below' | 'above' };
// Positions in percent of the plot, from the top left.
const ONE: Point = { x: 80, y: 84, name: 'One-off prototypes', note: 'Quick to make, connected to nothing', at: 'left' };
const PROD: Point = { x: 16, y: 30, name: 'The production repo', note: 'Built to ship, slow to explore in', at: 'below' };
const MOCK: Point = { x: 24, y: 56, name: 'Static mockups', note: 'Drawn by hand, out of date fast', at: 'right' };
const DS: Point = { x: 80, y: 30, name: 'Design Studio', note: 'Your product’s real parts, easy to explore', at: 'above' };

const quadrants = [
  { name: 'True, but rigid', at: 'is-tl' },
  { name: 'True and flexible', at: 'is-tr' },
  { name: 'Rigid and made up', at: 'is-bl' },
  { name: 'Flexible, but made up', at: 'is-br' },
];

function Mark({ p, state, main = false }: { p: Point; state: string; main?: boolean }) {
  return <div className={`rg-point is-${p.at} ${main ? 'is-main' : ''} ${state}`} style={{ left: `${p.x}%`, top: `${p.y}%` } as CSSProperties}>
    <i />
    <span><b>{p.name}</b><em>{p.note}</em></span>
  </div>;
}

/** Four named quadrants, three familiar ways to prototype, and Design Studio in the corner none of them reach. */
export default function StudioRange() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  // The payoff is the poster: with reduced motion the chart shows its finished state, not the first beat.
  const joined = step >= 2 || scene.reduced;
  const state = (i: number) => joined ? '' : step === i ? 'is-lit' : 'is-dim';
  return <DemoFrame scene={scene} caption={false} stage="rg-stage" title="where Design Studio sits"
    label="A two-by-two with flexibility to explore across and truth to your product up. Static mockups are rigid and made up. One-off prototypes are flexible but connect to nothing. The production repo is true to the product but slow to explore in. Design Studio sits in the corner none of them reach: true to the product and flexible to explore">
    <div className="rg">
      <div className="rg-plot">
        {quadrants.map(q => <span key={q.at} className={`rg-quad ${q.at} ${q.at === 'is-tr' && !joined ? 'is-dim' : ''}`}>{q.name}</span>)}
        <span className="rg-guide is-up" style={{ left: `${ONE.x}%`, top: `${DS.y}%`, height: `${ONE.y - DS.y}%` }} data-on={joined || undefined} />
        <span className="rg-guide is-across" style={{ left: `${PROD.x}%`, top: `${PROD.y}%`, width: `${DS.x - PROD.x}%` }} data-on={joined || undefined} />
        <Mark p={MOCK} state={joined ? '' : 'is-dim'} />
        <Mark p={ONE} state={state(0)} />
        <Mark p={PROD} state={state(1)} />
        <Mark p={DS} state={joined ? 'is-lit' : 'is-off'} main />
      </div>
      <span className="rg-axis-y">True to your product</span>
      <span className="rg-axis-x">Flexibility to explore</span>
    </div>
  </DemoFrame>;
}
