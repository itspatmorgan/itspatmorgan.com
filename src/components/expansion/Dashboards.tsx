import type { ReactNode } from 'react';
import { NativeStage } from '../case-study/NativeStage';
import { T, Tag, Bars, BotSignalsCard, CardHeader, Axis, ButtonGroup } from './ExpansionUI';
import { DemoFrame, useScene } from '../case-study/scene';
import { barColors, botSignalBars, badBotBars, botScoreBars } from './figma-bars';

// Frame 400: six dashboard cards in a 3 × 2 grid. Card-relative positions from the source; cards are 308 units wide.
const col = [20, 355.43, 690.86];
const row = [20, 503.21];
// Every bar chart on the dashboard shows the same number of thin source-width bars across the same plot width (the source's guide lines).
const chart = { count: 23, span: [58.19, 287.52] as [number, number] };

type Trend = { tag: string; value: string; dir?: 'up' | 'down'; tone?: string; muted?: boolean; y: number; rule: number };
function TrendList({ items }: { items: Trend[] }) {
  return <div style={{ left: 20.54, top: 118.09, width: 266.98, height: 280 }}>
    {items.map(item => <div key={item.tag}>
      <Tag x={0} y={item.y} size={8.55}>{item.tag}</Tag>
      <span className={`xp-trend ${item.dir === 'down' ? 'is-down' : ''}`} style={{ position: 'absolute', right: 0, top: item.y - 1.7, color: item.muted ? 'var(--x-ink-2)' : 'var(--x-ink)' }}>
        <i style={{ background: item.tone ?? 'transparent' }} />{item.value}
      </span>
      <i className="xp-hair" style={{ position: 'absolute', left: 0, top: item.rule, width: 266.98, height: .86 }} />
    </div>)}
  </div>;
}

function Legend({ items }: { items: [string, string, number][] }) {
  return <>{items.map(([name, value, color], i) => <div key={name} style={{ left: 20.54, top: 241.31 + i * 27.85, width: 266.98, height: 21 }}>
    <i style={{ position: 'absolute', left: 0, top: 6.85, width: 6.85, height: 6.85, background: barColors[color] }} />
    <T x={13.69} y={0} size={11.97} lh={21} ls={-.13}>{name}</T>
    <T x={205.37} y={0} size={11.97} lh={21} mono style={{ width: 61.61, textAlign: 'right' }}>{value}</T>
  </div>)}</>;
}

const card = (x: number, y: number, h: number, children: ReactNode) => <div className="xp-dash" style={{ left: x, top: y, width: 308.05, height: h }}>{children}</div>;
const red = 'var(--x-red)', green = 'var(--x-green)', gray = 'var(--x-ink-2)';
// Bot vs. Non-Bot lines, card-relative.
const lines: [string, string][] = [
  ['58.2,196.02 123.08,186.55 156.71,193.11 188.36,188.01 220.8,186.55 285.39,210.08', barColors[1]],
  ['58.2,219.44 92.98,202.81 124.56,215.07 157.74,218.09 189.72,207.41 222.5,221.63', barColors[2]],
  ['58.2,158.23 123.82,173.71 157.06,148.65 188.25,165.97 220.66,159.71 252.28,139.06 286.67,125.79', barColors[0]],
];

const timings = [400, 3600];
const captions = ['Ready-made dashboards for bot activity', 'Ready-made dashboards for bot activity'];

/** Monitoring: the dashboards that showed whether the defense was working. */
export default function Dashboards() {
  const scene = useScene(timings, captions, { loop: false });
  const grow = scene.step;
  return <DemoFrame scene={scene} caption={false} stage="xp-frame" title="the dashboards" label="Bot dashboards: bot signal trends, bot signals by type, bad bots, bot score trends, bot score, and bot versus non-bot traffic"><div className="cs-demo xp-dashboards">
    <NativeStage width={1240} height={900}>
      <div className="xp-card is-bare">
        {card(col[0], row[0], 463.79, <>
          <CardHeader title="Bot Signal Trends" subtitle="Bot signal activity compared to previous period" wrap={266.98} />
          <TrendList items={[
            { tag: 'Anonymous Bot', value: '1.53%', dir: 'down', tone: red, y: 1.94, rule: 34.46 },
            { tag: 'Bad Bot', value: '0.00%', muted: true, y: 50.72, rule: 83.24 },
            { tag: 'Search Engine', value: '4.23%', dir: 'up', tone: green, y: 99.49, rule: 132.01 },
            { tag: 'Imposter', value: '-.--%', dir: 'up', tone: gray, muted: true, y: 148.27, rule: 180.79 },
            { tag: 'Scraper', value: '23.21%', dir: 'down', tone: red, y: 197.28, rule: 228.08 },
            { tag: 'Scanner', value: '100.00%', dir: 'down', tone: red, y: 243.72, rule: 276.23 },
          ]} />
        </>)}
        <BotSignalsCard bars={botSignalBars} grow={grow} {...chart} style={{ left: col[1], top: row[0] }} />
        {card(col[2], row[0], 445.82, <>
          <CardHeader title="Bad Bots" subtitle="Requests with bad bot signals" wrap={167} />
          <Axis labels={['16', '8', '0']} />
          <Bars bars={badBotBars} grow={grow} {...chart} />
          <Legend items={[['Bad Bot', '25.68k', 0]]} />
          <ButtonGroup />
        </>)}
        {card(col[0], row[1], 395.34, <>
          <CardHeader title="Bot Score Trends" subtitle="Bot score activity compared to previous period" wrap={266.98} />
          <TrendList items={[
            { tag: 'Bot Score: Low', value: '0.58%', dir: 'down', tone: red, y: 1.94, rule: 34.46 },
            { tag: 'Bot Score: Medium', value: '0.58%', dir: 'up', tone: green, y: 49.01, rule: 79.81 },
            { tag: 'Bot Score: High', value: '0.58%', dir: 'up', tone: green, y: 94.36, rule: 125.17 },
          ]} />
        </>)}
        {card(col[1], row[1], 364.53, <>
          <CardHeader title="Bot Score" subtitle="Requests by bot score" wrap={125} />
          <Axis labels={['160', '80', '0']} />
          <Bars bars={botScoreBars} grow={grow} {...chart} />
          <Legend items={[['Bot Score: Low', '100.00', 0], ['Bot Score: Medium', '40.00', 1], ['Bot Score: High', '20.00', 2]]} />
          <ButtonGroup />
        </>)}
        {card(col[2], row[1], 364.53, <>
          <CardHeader title="Bot vs. Non-Bot" subtitle="Automated request comparison" wrap={175} />
          <Axis labels={['179.5k', '89.7k', '0']} />
          <svg width={308} height={364} style={{ left: 0, top: 0, overflow: 'visible' }} aria-hidden="true">
            {lines.map(([points, color]) => <polyline key={points} points={points} fill="none" stroke={color} strokeWidth={1.71} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - grow} style={{ transition: 'stroke-dashoffset 1200ms cubic-bezier(.22, 1, .36, 1)' }} />)}
          </svg>
          <Legend items={[['Not Bots', '105.60k', 0], ['All Bots', '25.68k', 1], ['Bad Bot', '45.60k', 2]]} />
        </>)}
      </div>
    </NativeStage>
  </div></DemoFrame>;
}
