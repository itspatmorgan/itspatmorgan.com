import { NativeStage, DemoControls } from '../case-study/NativeStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { T, Tag } from './ExpansionUI';
import { SigSciLogo } from './SigSciLogo';

// Frames 300, 500 and 600: a templated Signal, the rule that acts on it, and the timeline it leaves. Card-relative positions from the source.

const rows = [
  { tag: 'Search Engine', text: 'Known search engine bot activity.', count: 43, spark: [19.27, 38.54, 15.42, 38.54, 7.71, 43.68, 23.12, 38.54, 6.42, 10.28, 34.69, 7.71] },
  { tag: 'Scraper', text: 'A bot that has taken action to scrape content.', count: 58, spark: [38.54, 38.54, 29.55, 38.54, 30.83, 33.4, 23.12, 29.55, 6.42, 17.98, 34.69, 7.71] },
  { tag: 'Scanner', text: 'Known scanners like Nessus, Metasploit, etc...', count: 50, spark: [19.27, 38.54, 29.55, 38.54, 15.42, 33.4, 23.12, 29.55, 6.42, 17.98, 34.69, 7.71] },
  { tag: 'Bad Bot', text: 'A bot that has taken a malicious action such as XSS, SQLI, directory traversal, etc...', count: 12, spark: [19.27, 15.42, 10.28, 7.71, 15.42, 11.56, 23.12, 10.28, 6.42, 17.98, 11.56, 7.71] },
];
const rowTop = [137.46, 282.62, 427.78, 572.94];
const header = { fontSize: 12.84, lineHeight: '21px', letterSpacing: 1.02, textTransform: 'uppercase' } as const;

function SignalsTable() {
  const o = 30.83;
  return <>
    <T x={o} y={o} size={20.55} lh={21} weight={500} sf>8 Bot Signals</T>
    <i className="xp-rule" style={{ left: o, top: o + 41.11, width: 958.34, height: 2.57 }} />
    <T x={o} y={o + 64.23} size={12.84} lh={21} style={header}>Tag</T>
    <T x={o + 488.16} y={o + 64.23} size={12.84} lh={21} style={header}>Requests (-1D)</T>
    <T x={o + 719.4} y={o + 64.23} size={12.84} lh={21} style={header}>Status</T>
    <i className="xp-hair" style={{ left: o, top: o + 105.35, width: 958.34, height: 1.28 }} />
    {rows.map((row, i) => {
      const y = o + rowTop[i];
      return <div key={row.tag} style={{ left: o, top: y, width: 958.34, height: 90 }}>
        <Tag x={0} y={0} size={12.61}>{row.tag}</Tag>
        <T x={0} y={41.11} size={17.98} lh={24} sf style={{ width: 463.75, whiteSpace: 'normal' }}>{row.text}</T>
        {row.spark.map((h, b) => <i key={b} className="xp-spark" style={{ left: 490.73 + b * 7.71, top: 1.28 + 51.39 - h, height: h }} />)}
        <T x={489.45} y={57.81} size={15.41} lh={24} sf>{row.count} requests</T>
        <i className="xp-dot" style={{ position: 'absolute', left: 718.11, top: 35.97, width: 10.28, height: 10.28, background: 'var(--x-indigo)' }} />
        <T x={738.66} y={28.26} size={15.41} lh={24} sf>Enabled</T>
        <T x={901.81} y={29.55} size={15.41} lh={24} weight={600} sf>View</T>
        <i className="xp-hair" style={{ position: 'absolute', left: 0, top: (i === 3 ? 89.92 : 82.22) + 30.83, width: 958.34, height: 1.28 }} />
      </div>;
    })}
    <T x={o} y={o + 725.8 + 7.55} size={15.41} lh={26} ls={-.1}>1-6 of 33</T>
    <span className="xp-buttons" style={{ left: o + 838.87, top: o + 725.8, width: 54.55, height: 41.11, fontSize: 15.41, lineHeight: '26px' }}><span>Prev</span></span>
    <span className="xp-buttons" style={{ left: o + 903.1, top: o + 725.8, width: 55.55, height: 41.11, fontSize: 15.41, lineHeight: '26px' }}><span>Next</span></span>
  </>;
}

function ScraperRule() {
  const o = 42.72, f = 176.39;
  const mono = (x: number, y: number, text: string, extra: { weight?: number; size?: number; lh?: number; color?: string; width?: number } = {}) =>
    <T x={o + x} y={f + y} size={extra.size ?? 21.36} lh={extra.lh ?? 37} weight={extra.weight} mono color={extra.color} style={extra.width ? { width: extra.width, whiteSpace: 'normal' } : undefined}>{text}</T>;
  const label = (y: number, text: string) => <T x={o} y={f + y} size={21.36} lh={37} weight={600} ls={-.32}>{text}</T>;
  return <>
    <T x={o} y={o} size={32.04} lh={43} weight={800} ls={-.43}>Scraper Rule Definition</T>
    <i className="xp-rule" style={{ left: o, top: o + 67, width: 934.55, height: 2.67 }} />
    {label(0, 'Conditions')}{mono(169.55, 5.34, 'Conditions defined by Signal Sciences®')}
    {label(96.74, 'Actions')}{mono(169.55, 96.74, 'Tag with')}
    <Tag x={o + 282.97} y={f + 102.08} size={13.14}>Scraper</Tag>
    <i className="xp-hair" style={{ left: o + 169.56, top: f + 155.49, width: 2.67, height: 142.85 }} />
    {mono(182.91, 155.49, 'if 50 signals in 1 minute', { color: 'var(--x-ink-2)' })}
    <i className="xp-hair" style={{ left: o + 182.91, top: f + 204.89, width: 2.67, height: 93.46 }} />
    {mono(196.26, 203.55, 'Flag IP and Block', { weight: 700 })}
    {mono(196.26, 240.93, 'Flag IP and block all subsequent requests tagged with attack signals from that IP', { size: 18.69, lh: 32, width: 738.3 })}
    {label(359.34, 'Status')}
    <i className="xp-dot" style={{ left: o + 169.55, top: f + 372.69, width: 10.68, height: 10.68, background: 'var(--x-indigo)' }} />
    <T x={o + 190.92} y={f + 359.34} size={21.36} lh={37} ls={-.32}>Enabled</T>
    {label(450.74, 'Expiration')}
    <T x={o + 169.55} y={f + 450.74} size={21.36} lh={37} ls={-.32}>Never expire</T>
  </>;
}

const events = [
  { y: 130.1, dot: 'var(--x-gray)', line: 109.29, lineTop: 140.51 },
  { y: 249.8, dot: 'var(--x-yellow)', line: 119.69 },
  { y: 369.49, dot: 'var(--x-gray)', line: 124.9 },
  { y: 494.39, dot: 'var(--x-gray)', line: 119.69 },
  { y: 614.08, dot: 'var(--x-green)', line: 124.9 },
  { y: 738.98, dot: 'var(--x-gray)', line: 85.87 },
];

function Timeline({ shown }: { shown: number }) {
  const text = (x: number, y: number, s: string, weight = 400, className = '') => <T x={x} y={y} size={20.81} lh={36} ls={-.31} weight={weight} className={className}>{s}</T>;
  const date = (y: number, s: string) => <T x={78.06} y={y} size={15.61} lh={26} ls={-.1} color="var(--x-ink-2)">{s}</T>;
  const lines = [
    <>{text(78.06, 130.1, 'IP was flagged with')}<Tag x={270.72} y={135.34} size={12.71}>Scraper</Tag>{text(342.17, 130.1, 'on the')}
      <span style={{ position: 'absolute', left: 410.72, top: 133.31, width: 157.71, height: 32.82, borderRadius: 4, background: 'var(--x-block)' }}><SigSciLogo /></span>{text(575.05, 130.1, 'network')}{date(171.73, 'Sept 23, 2019')}</>,
    <>{text(78.06, 249.8, 'IP marked suspicious on this site with')}<Tag x={441.15} y={255.03} size={12.71}>Scraper</Tag>{date(291.43, 'Sept 23, 2019 7:25:55 AM PDT')}</>,
    <>{text(78.06, 369.49, '50 requests', 600, 'xp-link')}{text(201.66, 369.49, 'tagged on this site from this IP with')}<Tag x={545.23} y={374.72} size={12.71}>Scraper</Tag>{text(619.29, 369.49, 'within 1 minute')}
      {text(78.06, 405.92, '100% site threshold')}{text(277.12, 405.92, 'Edit alert', 600, 'xp-link')}</>,
    <>{text(78.06, 494.39, 'Flag applied to IP')}{date(536.02, 'Sept 23, 2019 7:25:55 AM PDT')}</>,
    <>{text(78.06, 614.08, 'Blocking malicious attacks from this IP')}{text(78.06, 655.71, 'Site in blocking mode')}</>,
    <>{text(78.06, 738.98, 'No new relevant attacks from this IP were flagged')}</>,
  ];
  return <>
    <T x={41.63} y={41.63} size={26.02} lh={36} weight={800} ls={-.31}>Timeline</T>
    <i className="xp-rule" style={{ left: 41.63, top: 78.06, width: 936.73, height: 2.6 }} />
    {events.map((e, i) => <div key={i} className={`xp-event ${i < shown ? '' : 'is-hidden'}`} style={{ inset: 0 }}>
      <i className="xp-hair" style={{ position: 'absolute', left: 48.14, top: e.lineTop ?? e.y, width: 2.6, height: e.line }} />
      <i className="xp-dot" style={{ position: 'absolute', left: 41.63, top: e.y + 10.41, width: 15.61, height: 15.61, background: e.dot }} />
      <div style={{ position: 'absolute', inset: 0 }}>{lines[i]}</div>
    </div>)}
  </>;
}

const screens = ['signals', 'rule', 'timeline'] as const;
// Signals, then the rule, then the timeline filling in one event at a time.
const steps: { screen: number; events: number; ms: number }[] = [
  { screen: 0, events: 0, ms: 3200 },
  { screen: 1, events: 0, ms: 3600 },
  ...events.map((_, i) => ({ screen: 2, events: i + 1, ms: i === events.length - 1 ? 3600 : 700 })),
];
const captions = ['Templated Signals tag common bots', 'A rule flags and blocks scraper IPs', 'The timeline records each step'];

/** Detection connected to response: a Signal, the rule that acts on it, and the record it leaves. */
export default function SignalChain() {
  const loop = useDemoLoop(steps.map(s => s.ms), steps.length - 1);
  const step = steps[loop.step];
  return <figure className={`cs-demo xp-chain ${loop.resetting ? 'cs-loop-reset' : ''}`} ref={loop.ref} aria-label="Bot Signals for search engines, scrapers, scanners and bad bots; a Scraper rule that flags and blocks IPs over 50 signals a minute; and the timeline of one IP being flagged and blocked">
    <NativeStage width={1240} height={900}>
      <div className="xp-card">{screens.map((name, i) => <div key={name} className={`xp-fade xp-seq ${i === step.screen ? '' : 'xp-off'}`} style={{ inset: 0 }} aria-hidden={i !== step.screen}>
        {i === 0 && <SignalsTable />}{i === 1 && <ScraperRule />}{i === 2 && <Timeline shown={step.screen === 2 ? step.events : events.length} />}
      </div>)}</div>
    </NativeStage>
    <DemoControls loop={loop} title="signal, rule and timeline" caption={captions[step.screen]} />
  </figure>;
}
