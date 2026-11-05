import { Cancel01Icon, HashtagIcon } from '@hugeicons/core-free-icons';
import { DemoFrame, Screens, useScene } from '../case-study/scene';
import { Board, Chip, chipTones, Icon, ramps, typeScale } from './JunoUI';

const timings = [2600, 2600, 3400];
const captions = ['Color ramps with light, main and dark steps', 'A type scale in Lato', 'A spec page for each component'];
const roles: Record<string, string> = { 100: 'light', 500: 'main', 700: 'dark' };

const close = <Icon icon={Cancel01Icon} size={13} />;
const tag = <Icon icon={HashtagIcon} size={13} />;
const initial = <b className="jc-av">C</b>;
const variants: [string, React.ReactNode][] = [['Default', 'Chip'], ['avatar', <>{initial}Chip</>], ['icon', <>{tag}Chip</>], ['deleteIcon', <>Chip{close}</>], ['icon + deleteIcon', <>{tag}Chip{close}</>], ['avatar + deleteIcon', <>{initial}Chip{close}</>]];

/** The Chip page from the Juno: Material Figma library: the status, the component set and its example instances. */
function ChipSpec() {
  return <div className="jc">
    <header><h3>Chip</h3><span className="jo-pill" style={{ background: '#00C07F' }}>Healthy</span></header>
    <div className="jc-cols">
      <section><h5>Component</h5><div className="jc-set">{[false, true].map(small => <div key={String(small)}>{chipTones.map(t => <Chip key={t} tone={t} small={small} />)}</div>)}</div></section>
      <section><h5>Example instances</h5><div className="jc-table">{variants.map(([name, content]) => <div key={name}><small>{name}</small><Chip tone="navy">{content}</Chip><Chip tone="navy" small>{content}</Chip></div>)}</div></section>
    </div>
  </div>;
}

export default function Primitives() {
  const scene = useScene(timings, captions);
  const step = scene.reduced ? 2 : scene.step;
  return <DemoFrame scene={scene} stage="cs-frame" title="Juno's color, type and components" label="Juno's navy and teal color ramps, its type scale, then the spec page for its chip component">
    <Board><Screens id={String(step)}>
      {step === 0 && <div className="jp-color">{Object.entries(ramps).map(([name, ramp]) => <div key={name}><h5>{name}</h5><div>{ramp.map(([s, hex]) => <span key={s}><i style={{ background: `#${hex}` }} /><b>{s}{roles[s] && <em> {roles[s]}</em>}</b><small>{hex}</small></span>)}</div></div>)}</div>}
      {step === 1 && <div className="jp-type">{typeScale.map(([name, weight, size, lh, ls, w]) => <div key={name}><span style={{ fontSize: size, fontWeight: w, letterSpacing: ls }}>{name}</span><small>{weight}</small><small>{size}</small><small>{lh}</small><small>{ls}</small></div>)}</div>}
      {step === 2 && <ChipSpec />}
    </Screens></Board>
  </DemoFrame>;
}
