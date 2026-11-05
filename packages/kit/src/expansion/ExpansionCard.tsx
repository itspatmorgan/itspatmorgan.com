import { ProjectCardStage } from '../case-study/ProjectCardStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { barColors, botSignalBars } from './figma-bars';

// The project card: bot traffic, sorted by ready-made signals and visible at a glance, which is where the case study ends. Behind, the
// Bot Signals chart; in front, the card's title and its two largest signals with their counts, each in its chart color. The chart rises
// up from the baseline and rest. It keeps the source's stacked bars, averaged down to 20 so they read at card size, and shows only the two
// signals listed, in the source's colors and stacking order, so each bar's segments match the legend. Only these two: the source mock-up's chart and legend agree for them (about 4 to 1 in both), but not for its smaller
// signals (its legend gives Search Engine 45.60k while its chart draws it at a fifteenth of Anonymous Bot). Values and colors are the source's (Portfolio Website 2025 › SS Expansion, the Bot Signals card); the layout follows
// ProjectCardStage.
const timings = [500, 2400];
// The source legend's first two signals, in its order (bottom of the stack first), with their color index in barColors.
const signals = [['Anonymous Bot', '105.60k', 0], ['Bad Bot', '25.68k', 1]] as const;

// Each source column is a stack drawn as overlapping bars, each color's top a running total. Sorting a column's bars by height and taking
// the differences gives each color's own segment.
const columns = [...botSignalBars.reduce((map, [x, , , height, color]) => {
  const key = Math.round(x * 10);
  return map.set(key, [...(map.get(key) ?? []), { x, height, color }]);
}, new Map<number, { x: number; height: number; color: number }[]>()).values()]
  .sort((a, b) => a[0].x - b[0].x)
  .map(bars => {
    const sorted = [...bars].sort((a, b) => a.height - b.height);
    return new Map(sorted.map((bar, i) => [bar.color, bar.height - (i ? sorted[i - 1].height : 0)]));
  });
const POINTS = 20;
// Running totals per point, bottom band first: layers[k][j] is the top of band k at point j.
const layers = signals.map((_, k) => Array.from({ length: POINTS }, (_, j) => {
  const chunk = columns.slice(Math.floor(j * columns.length / POINTS), Math.floor((j + 1) * columns.length / POINTS));
  return chunk.reduce((sum, column) => sum + signals.slice(0, k + 1).reduce((s, [, , color]) => s + (column.get(color) ?? 0), 0), 0) / chunk.length;
}));
const peak = Math.max(...layers[layers.length - 1]);

/** Requests with bot signals, in stacked bars by signal, and the signals behind them. */
export default function ExpansionCard() {
  const loop = useDemoLoop(timings, timings.length - 1, false, true);
  const step = loop.reduced ? 1 : loop.step;
  return <ProjectCardStage loop={loop} className="xp xc" label="The Bot Signals stacked bar chart: Anonymous Bot at 105.60k and Bad Bot at 25.68k requests">
    <div className="pc-bg xc-chart">
      <div className={`xc-bars ${step >= 1 ? 'is-up' : ''}`}>
        {layers[0].map((_, j) => <span key={j} style={{ height: `${layers[layers.length - 1][j] / peak * 100}%`, transitionDelay: `${j * 22}ms` }}>
          {/* Segments top down, each its share of the bar: the last signal on top, the first at the base. */}
          {[...signals].reverse().map(([name, , color], r) => {
            const k = signals.length - 1 - r;
            return <i key={name} style={{ flexGrow: layers[k][j] - (k ? layers[k - 1][j] : 0), background: barColors[color] }} />;
          })}
        </span>)}
      </div>
    </div>
    <div className="pc-fg xc-signals">
      <p className="pc-title xc-title">Bot Signals</p>
      {signals.map(([name, value, color]) => <p key={name} className="xc-row">
        <span className="xc-name"><i style={{ background: barColors[color] }} />{name}</span><b>{value}</b>
      </p>)}
    </div>
  </ProjectCardStage>;
}
