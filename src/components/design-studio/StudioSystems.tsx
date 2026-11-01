import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, usePhone, useScene } from '../case-study/scene';
import { Inbox, Overview } from './StudioShapes';
import { themeStyle, useDark, type Theme } from './explore/StudioWindow';
import './studio-shapes.css';

// Systems in the open-source Studio: each lives in its own folder (src/systems/<name>) with its theme, components and rules, and
// each prototype names the one it builds with. The Studio ships two, Product and Marketing. The drawing lights each system with the
// prototypes that use it, then both at once, since they sit side by side without touching. The thumbnails are the real sample
// screens (Echo's inbox and overview) in the Product system, and a launch page in Echo's Marketing system: the same brand green as
// Product, tuned for a different audience, as two systems at one company would be.
const timings = [2400, 2800, 2800, 3600];
const captions = [
  'Each system holds its own theme, components and rules',
  'Product prototypes build with the Product system',
  'Marketing pages build with the Marketing system',
  'One brand, two systems for two jobs, and none of them conflict',
];

const TW = 272, TH = 170, TOP = 316;
type Proto = { title: string; system: 'product' | 'marketing'; screen: 'inbox' | 'overview' | 'launch' };
type Box = { x: number; y: number; w: number };
const protos: Proto[] = [
  { title: 'Feedback inbox', system: 'product', screen: 'inbox' },
  { title: 'Overview', system: 'product', screen: 'overview' },
  { title: 'Launch page', system: 'marketing', screen: 'launch' },
];
const systems = {
  product: { name: 'Product', path: 'src/systems/product', theme: 'green' as Theme, radius: 0, note: 'Echo green, dense UI, square corners' },
  marketing: { name: 'Marketing', path: 'src/systems/marketing', theme: 'echo-marketing' as Theme, radius: 12, note: 'Echo green, warm paper, round corners' },
};
// Desktop: both systems in a row over the three prototypes, wired across. Phones: the same arrangement redrawn for a square frame
// (every phone visual on this page is square), with larger type for its smaller scale, so names and notes stay readable and the
// drawing sits inside the frame with even margins.
const desk = {
  w: 960, h: 570, thumb: TW, cardH: 186,
  systems: { product: { x: 148, y: 40, w: 300 }, marketing: { x: 512, y: 40, w: 300 } } as Record<'product' | 'marketing', Box>,
  protos: [{ x: 40, y: TOP, w: TW }, { x: 344, y: TOP, w: TW }, { x: 648, y: TOP, w: TW }] as Box[],
};
const PT = 176;
const mobile = {
  w: 600, h: 600, thumb: PT, cardH: 196,
  systems: { product: { x: 24, y: 48, w: 264 }, marketing: { x: 312, y: 48, w: 264 } } as Record<'product' | 'marketing', Box>,
  protos: [{ x: 24, y: 334, w: PT }, { x: 212, y: 334, w: PT }, { x: 400, y: 334, w: PT }] as Box[],
};

/** A wire from under a system to the top of a prototype that builds with it. */
function wire(s: Box, b: Box, cardH: number) {
  const from = s.x + s.w / 2, to = b.x + b.w / 2, top = s.y + cardH;
  return `M${from} ${top} C ${from} ${top + 44}, ${to} ${top + 40}, ${to} ${b.y - 6}`;
}

/** A launch page in the Marketing system's tokens, at the Studio's native prototype size. */
function Launch() {
  return <div className="ss-echo ss-mk">
    <header className="ss-mk-top"><b><i />Echo</b><span>Product</span><span>Pricing</span><span>Customers</span><em>Start free</em></header>
    <section className="ss-mk-hero">
      <h1>Hear every customer, in one place</h1>
      <p>Echo gathers feedback from email, chat and calls, so your team sees what matters and acts on it.</p>
      <div><span className="is-primary">Start free</span><span>Book a demo</span></div>
    </section>
    <div className="ss-mk-shot"><i /><i /><i /></div>
  </div>;
}

function Thumb({ screen, theme, dark, w }: { screen: 'inbox' | 'overview' | 'launch'; theme: Theme; dark: boolean; w: number }) {
  return <div className="sy-thumb" style={{ width: w, height: w * TH / TW }}>
    <div className="sc-os ss-os dx-os" style={{ ...themeStyle(theme, dark), width: 1120, height: 700, transform: `scale(${w / 1120})`, transformOrigin: '0 0' }}>
      <div className="ss-panes"><div className="ss-pane"><div className="ss-app">{screen === 'inbox' ? <Inbox /> : screen === 'overview' ? <Overview /> : <Launch />}</div></div></div>
    </div>
  </div>;
}

/** Two design systems, each wired to the prototypes that build with it. */
export default function StudioSystems() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const dark = useDark();
  const phone = usePhone();
  const L = phone ? mobile : desk;
  const lit = (s: 'product' | 'marketing') => step === 0 || step === 3 || (s === 'product' ? step === 1 : step === 2);
  const wired = (s: 'product' | 'marketing') => step === 3 || (s === 'product' ? step === 1 : step === 2);
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="how systems and prototypes fit together"
    label="Two design systems in Design Studio, Product and Marketing, each in its own folder with its own theme, components and rules. The feedback inbox and overview prototypes build with the Product system; the launch page builds with the Marketing system. Both systems sit side by side without conflicting">
    <div className="cs-demo">
      <NativeStage width={L.w} height={L.h}>
        <div className={`sc-dia sy-dia ${phone ? 'is-phone' : ''}`}>
          <svg className="sc-line" viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true">
            {protos.map((p, i) => {
              const d = wire(L.systems[p.system], L.protos[i], L.cardH);
              return <g key={p.title}>
                <path className="is-dash" d={d} />
                <path className={`is-accent is-draw ${wired(p.system) ? 'is-on' : ''}`} pathLength={1} d={d} />
              </g>;
            })}
          </svg>
          {(Object.keys(systems) as ('product' | 'marketing')[]).map(k => {
            const s = systems[k], b = L.systems[k];
            return <div key={k} className={`sc-node sy-system ${wired(k) ? 'is-accent' : ''} ${lit(k) ? '' : 'is-dim'}`} style={{ left: b.x, top: b.y, width: b.w, height: L.cardH }}>
              <h3>{s.name}</h3>
              <p className="sy-path">{s.path}</p>
              <div className="sy-tokens ss-os" style={themeStyle(s.theme, dark)}>
                <i style={{ background: 'var(--e-primary)', borderRadius: s.radius }} />
                <i style={{ background: 'var(--e-accent)', borderRadius: s.radius }} />
                <i style={{ background: 'var(--e-bg)', borderRadius: s.radius }} />
                <i style={{ background: 'var(--e-fg)', borderRadius: s.radius }} />
                <span className="sy-btn" style={{ borderRadius: s.radius }}>Button</span>
              </div>
              <p className="sy-note">{s.note}</p>
            </div>;
          })}
          {protos.map((p, i) => <figure key={p.title} className={`sy-proto ${lit(p.system) ? '' : 'is-dim'} ${wired(p.system) ? 'is-wired' : ''}`} style={{ left: L.protos[i].x, top: L.protos[i].y, width: L.protos[i].w }}>
            <Thumb screen={p.screen} theme={systems[p.system].theme} dark={dark} w={L.thumb} />
            <figcaption><b>{p.title}</b><span>{systems[p.system].name} system</span></figcaption>
          </figure>)}
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
