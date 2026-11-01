import { useEffect, useState, type ReactNode } from 'react';
import { formats, type FormatId } from './formats';
import { products, visuals, type Visual } from './library';
import { VisualFrame } from './VisualFrame';

const PREVIEW = 520;

/** A visual at its true size, scaled down to fit a preview column. The stage lays out at full size, so it looks as it records. Its
 *  caption links to it alone (the screens hold links of their own, so the preview itself can't be one). */
function Preview({ width, height, href, caption, children }: { width: number; height: number; href: string; caption: ReactNode; children: ReactNode }) {
  const k = PREVIEW / width;
  return <figure>
    <div className="vl-preview" style={{ width: PREVIEW, height: height * k }}>
      <div style={{ width, transform: `scale(${k})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
    <figcaption><a href={href}>{caption}</a></figcaption>
  </figure>;
}

function link(visual: Visual, format: FormatId, detail?: string) {
  return `?id=${visual.id}&format=${format}${detail ? `&detail=${detail}` : ''}`;
}

/** The library: every visual in every format, and its details, grouped by project. `?id=…&format=…[&detail=…]` shows one visual alone
 *  at its true size, for recording (scripts/visuals-record.mjs) or a closer look. */
export default function Gallery() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => setParams(new URLSearchParams(window.location.search)), []);
  if (!params) return null;
  const visual = visuals.find(v => v.id === params.get('id'));
  if (visual) {
    const format = (params.get('format') ?? 'slide') as FormatId;
    const detail = visual.details?.find(d => d.id === params.get('detail'));
    return <main className="vl-single"><VisualFrame visual={visual} format={format} detail={detail} /></main>;
  }
  return <main className="vl-gallery">
    <header>
      <h1>Visual library</h1>
      <p>Each product scene from the case studies, drawn for formats beyond the site: {Object.values(formats).map(f => `${f.label.toLowerCase()} (${f.note})`).join(', ')}. Details are close looks drawn natively at a larger size. Open one to see it alone at its true size; <code>node scripts/visuals-record.mjs</code> records it.</p>
    </header>
    {(Object.keys(products) as Visual['project'][]).map(project => <section key={project}>
      <h2>{products[project].name}</h2>
      {visuals.filter(v => v.project === project).map(v => <article key={v.id}>
        <h3>{v.title} <code>{v.id}</code></h3>
        <div className="vl-row">
          {(Object.keys(formats) as FormatId[]).map(f => <Preview key={f} width={formats[f].width} height={formats[f].height} href={link(v, f)} caption={formats[f].label}>
            <VisualFrame visual={v} format={f} />
          </Preview>)}
          {v.details?.map(d => <Preview key={d.id} width={d.width} height={d.width * .4} href={link(v, 'slide', d.id)} caption={<>Detail: {d.title} <code>{d.id}</code></>}>
            <VisualFrame visual={v} format="slide" detail={d} />
          </Preview>)}
        </div>
      </article>)}
    </section>)}
  </main>;
}
