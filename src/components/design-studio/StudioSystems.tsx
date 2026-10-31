import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';
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

const TW = 272, TH = 170, SCALE = TW / 1120, TOP = 316;
const protos: { x: number; title: string; system: 'product' | 'marketing'; screen: 'inbox' | 'overview' | 'launch' }[] = [
  { x: 40, title: 'Feedback inbox', system: 'product', screen: 'inbox' },
  { x: 344, title: 'Overview', system: 'product', screen: 'overview' },
  { x: 648, title: 'Launch page', system: 'marketing', screen: 'launch' },
];
const systems = {
  product: { x: 148, w: 300, name: 'Product', path: 'src/systems/product', theme: 'green' as Theme, radius: 0, note: 'Echo green, dense UI, square corners' },
  marketing: { x: 512, w: 300, name: 'Marketing', path: 'src/systems/marketing', theme: 'echo-marketing' as Theme, radius: 12, note: 'Echo green, warm paper, round corners' },
};

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

function Thumb({ screen, theme, dark }: { screen: 'inbox' | 'overview' | 'launch'; theme: Theme; dark: boolean }) {
  return <div className="sy-thumb" style={{ width: TW, height: TH }}>
    <div className="sc-os ss-os dx-os" style={{ ...themeStyle(theme, dark), width: 1120, height: 700, transform: `scale(${SCALE})`, transformOrigin: '0 0' }}>
      <div className="ss-panes"><div className="ss-pane"><div className="ss-app">{screen === 'inbox' ? <Inbox /> : screen === 'overview' ? <Overview /> : <Launch />}</div></div></div>
    </div>
  </div>;
}

/** Two design systems, each wired to the prototypes that build with it. */
export default function StudioSystems() {
  const scene = useScene(timings, captions, { loop: false });
  const step = scene.step;
  const dark = useDark();
  const lit = (s: 'product' | 'marketing') => step === 0 || step === 3 || (s === 'product' ? step === 1 : step === 2);
  const wired = (s: 'product' | 'marketing') => step === 3 || (s === 'product' ? step === 1 : step === 2);
  return <DemoFrame scene={scene} caption={false} stage="sc-plain" title="how systems and prototypes fit together"
    label="Two design systems in Design Studio, Product and Marketing, each in its own folder with its own theme, components and rules. The feedback inbox and overview prototypes build with the Product system; the launch page builds with the Marketing system. Both systems sit side by side without conflicting">
    <div className="cs-demo">
      <NativeStage width={960} height={570}>
        <div className="sc-dia sy-dia">
          <svg className="sc-line" viewBox="0 0 960 570" aria-hidden="true">
            {protos.map(p => {
              const s = systems[p.system], from = s.x + s.w / 2, to = p.x + TW / 2;
              const d = `M${from} 226 C ${from} 270, ${to} 266, ${to} ${TOP - 6}`;
              return <g key={p.title}>
                <path className="is-dash" d={d} />
                <path className={`is-accent is-draw ${wired(p.system) ? 'is-on' : ''}`} pathLength={1} d={d} />
              </g>;
            })}
          </svg>
          {(Object.keys(systems) as ('product' | 'marketing')[]).map(k => {
            const s = systems[k];
            return <div key={k} className={`sc-node sy-system ${wired(k) ? 'is-accent' : ''} ${lit(k) ? '' : 'is-dim'}`} style={{ left: s.x, top: 40, width: s.w, height: 186 }}>
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
          {protos.map(p => <figure key={p.title} className={`sy-proto ${lit(p.system) ? '' : 'is-dim'} ${wired(p.system) ? 'is-wired' : ''}`} style={{ left: p.x, top: TOP }}>
            <Thumb screen={p.screen} theme={systems[p.system].theme} dark={dark} />
            <figcaption><b>{p.title}</b><span>{systems[p.system].name} system</span></figcaption>
          </figure>)}
        </div>
      </NativeStage>
    </div>
  </DemoFrame>;
}
