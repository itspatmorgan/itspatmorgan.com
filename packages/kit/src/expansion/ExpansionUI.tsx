import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { barColors, type Bar } from './figma-bars';

// Primitives for the Signal Sciences screens. Every number is a position or size from the Figma source, in the frame's own units.

type TextProps = { x: number; y: number; size: number; lh: number; weight?: number; ls?: number; mono?: boolean; sf?: boolean; color?: string; className?: string; style?: CSSProperties; children: ReactNode };
export function T({ x, y, size, lh, weight = 400, ls, mono, sf, color, className = '', style, children }: TextProps) {
  return <span className={`xp-t ${mono ? 'xp-mono' : ''} ${sf ? 'xp-sf' : ''} ${className}`} style={{ left: x, top: y, fontSize: size, lineHeight: `${lh}px`, fontWeight: weight, letterSpacing: ls, color, ...style }}>{children}</span>;
}

export function Box({ x, y, w, h, className = '', style, children }: { x: number; y: number; w?: number; h?: number; className?: string; style?: CSSProperties; children?: ReactNode }) {
  return <div className={className} style={{ position: 'absolute', left: x, top: y, width: w, height: h, ...style }}>{children}</div>;
}

export function Tag({ x, y, size, tone = 'orange', children }: { x: number; y: number; size: number; tone?: 'orange' | 'blue' | 'red'; children: string }) {
  return <span className={`xp-tag ${tone === 'orange' ? '' : `is-${tone}`}`} style={{ left: x, top: y, fontSize: size }}><span>{children}</span></span>;
}

export function Select({ x, y, w, mono, children }: { x: number; y: number; w: number; mono?: boolean; children: ReactNode }) {
  return <Box x={x} y={y} w={w} className={`xp-field ${mono ? 'xp-mono' : ''}`}>{children}<HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={2} /></Box>;
}

export function IconButton({ x, y }: { x: number; y: number }) {
  return <Box x={x} y={y} w={41.07} h={41.07} style={{ border: '.85px solid var(--x-line)', display: 'grid', placeItems: 'center' }}><HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.8} /></Box>;
}

/**
 * Overlapping bars from the source chart, grouped into columns that rise together; `grow` (0 or 1) raises them, staggered left to right.
 * The source spaces 4.1-unit bars on a 5.12-unit step, which lands between device pixels once scaled, so the plot measures
 * its rendered size and snaps widths, gaps, heights and one shared baseline to whole device pixels.
 * `count` averages the source columns down to that many bars across `span` (left and right edge), so small charts can share one
 * bar count and width instead of showing every source column.
 */
export function Bars({ bars, grow = 1, count, span }: { bars: Bar[]; grow?: number; count?: number; span?: [number, number] }) {
  const plot = useRef<HTMLSpanElement>(null);
  const [snap, setSnap] = useState<{ k: number; ox: number; oy: number } | null>(null);
  const source = [...bars.reduce((map, bar) => map.set(Math.round(bar[0] * 10), [...(map.get(Math.round(bar[0] * 10)) ?? []), bar]), new Map<number, Bar[]>()).values()].sort((a, b) => a[0][0] - b[0][0]);
  const n = count ?? source.length;
  const [left, right] = span ?? [source[0][0][0], source[source.length - 1][0][0] + source[0][0][2]];
  const top = Math.min(...bars.map(b => b[1]));
  const baseline = Math.max(...bars.map(b => b[1] + b[3]));
  // Source columns are stacks drawn as overlapping bars: each color's top is a running total. Read each column as segments
  // from the bottom up, average every color's segment across the merged columns, restack in legend order,
  // and return [height, color] layers tallest first so shorter layers draw in front.
  const columns: [number, number][][] = [];
  for (let j = 0; j < n; j++) {
    const chunk = source.slice(Math.floor(j * source.length / n), Math.floor((j + 1) * source.length / n));
    const size = new Map<number, number>();
    for (const col of chunk) {
      const stack = col.map(b => [baseline - b[1], b[4]] as const).sort((a, b) => a[0] - b[0]);
      stack.forEach(([h, c], i) => {
        size.set(c, (size.get(c) ?? 0) + (h - (i ? stack[i - 1][0] : 0)) / chunk.length);
      });
    }
    const order = [...size.keys()].sort((a, b) => a - b);
    let total = 0;
    columns.push(order.map(c => [(total += size.get(c)!), c] as [number, number]).reverse());
  }
  // Bars keep the source's width; fewer of them leaves the difference as space between.
  const width = source[0][0][2];
  const gap = n > 1 ? (right - left - n * width) / (n - 1) : 0;
  const step = width + gap;

  useLayoutEffect(() => {
    const node = plot.current;
    const stage = node?.closest('.cs-native-stage');
    if (!node || !stage) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const k = rect.width / ((columns.length - 1) * step + width) * dpr;
      if (!k) return;
      setSnap({ k, ox: Math.round(rect.left * dpr) - rect.left * dpr, oy: rect.bottom * dpr - Math.round(rect.bottom * dpr) });
    };
    measure();
    // The stage rescales its canvas by transform, which a ResizeObserver can't see, so watch the canvas style too.
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    const rescale = new MutationObserver(measure);
    const canvas = stage.querySelector('.cs-canvas');
    if (canvas) rescale.observe(canvas, { attributes: true, attributeFilter: ['style'] });
    return () => { observer.disconnect(); rescale.disconnect(); };
  }, [columns.length, step, width]);

  // Device-pixel layout when measured, kept inside the plot's width; the source's own units before that.
  const plotWidth = (columns.length - 1) * step + width;
  const barPx = snap ? Math.max(1, Math.round(width * snap.k)) : 0;
  const gapPx = snap ? Math.max(1, columns.length > 1 ? Math.floor((plotWidth * snap.k - columns.length * barPx) / (columns.length - 1)) : 0) : 0;
  const barW = snap ? barPx / snap.k : width;
  const pitch = snap ? (barPx + gapPx) / snap.k : step;
  const px = (v: number) => (snap ? Math.round(v * snap.k) / snap.k : v);
  return <span ref={plot} className="xp-plot" style={{ left, top, width: plotWidth, height: baseline - top }}>
    {columns.map((column, i) => {
      const height = px(column[0][0]);
      return <span key={i} className="xp-bar" style={{ left: (snap ? snap.ox / snap.k : 0) + i * pitch, bottom: snap ? snap.oy / snap.k : 0, width: barW, height, transform: `scaleY(${grow})`, transitionDelay: `${Math.round(i / (columns.length - 1) * 700)}ms`, transitionDuration: grow ? undefined : '0ms' }}>
        {column.map(([h, c], j) => <i key={j} style={{ top: height - px(h), bottom: 0, background: barColors[c] }} />)}
      </span>;
    })}
  </span>;
}

const legend = [['Anonymous Bot', '105.60k', 0], ['Bad Bot', '25.68k', 1], ['Search Engine', '45.60k', 2], ['Imposter', '5.68k', 3], ['Scraper', '45.60k', 4], ['Scanner', '25.60k', 5]] as const;

/** The Bot Signals dashboard card (308 × 467 units), used at hero scale and on the dashboard. */
export function BotSignalsCard({ bars, grow = 1, count, span, style }: { bars: Bar[]; grow?: number; count?: number; span?: [number, number]; style?: CSSProperties }) {
  return <div className="xp-dash" style={{ position: 'absolute', width: 308.05, height: 467.21, ...style }}>
    <CardHeader title="Bot Signals" subtitle="Requests with bot signals" />
    <Axis labels={['179.5k', '89.7k', '0']} />
    <Bars bars={bars} grow={grow} count={count} span={span} />
    {legend.map(([name, value, color], i) => <div key={name} style={{ left: 20.54, top: 241.31 + i * 27.38, width: 266.98, height: 21 }}>
      <i style={{ position: 'absolute', left: 0, top: 6.84, width: 6.85, height: 6.85, background: barColors[color] }} />
      <T x={13.69} y={0} size={11.97} lh={21} ls={-.13}>{name}</T>
      <T x={205.37} y={0} size={11.97} lh={21} mono style={{ width: 61.61, textAlign: 'right' }}>{value}</T>
    </div>)}
    <ButtonGroup />
  </div>;
}

export function CardHeader({ title, subtitle, wrap }: { title: string; subtitle: string; wrap?: number }) {
  return <>
    <T x={20.54} y={20.54} size={13.69} lh={21} weight={800} ls={-.06}>{title}</T>
    <i className="xp-rule" style={{ left: 20.54, top: 47.92, width: 266.98, height: 1.71 }} />
    <T x={20.54} y={63.32} size={11.97} lh={21} ls={-.13} color="var(--x-ink-2)" style={wrap ? { width: wrap, whiteSpace: 'normal' } : undefined}>{subtitle}</T>
  </>;
}

export function Axis({ labels }: { labels: [string, string, string] }) {
  return <>
    {[124.93, 172.85, 220.77].map(y => <i key={y} className="xp-dotted" style={{ left: 58.19, top: y, width: 229.33, borderTopWidth: .85 }} />)}
    {labels.map((label, i) => <T key={i} x={20.54} y={118.09 + i * 47.92} size={8.55} lh={14} mono>{label}</T>)}
  </>;
}

export function ButtonGroup() {
  return <div className="xp-buttons" style={{ left: 20.54, bottom: 20.54, width: 266.98, height: 34.23 }}><span>Quick view</span><span>View requests</span></div>;
}
