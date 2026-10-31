import { useEffect, useState } from 'react';
import {
  ArrowDown01Icon, ArrowExpand01Icon, ArrowRight01Icon, Compass01Icon, CubeIcon, LibraryIcon, Mail01Icon, MoreHorizontalIcon, Search01Icon,
} from '@hugeicons/core-free-icons';
import { Pointer, SceneFrame, Screens, useScene, useStage, useTargets } from '../case-study/scene';
import { OsRail, icon } from '../studio-case/StudioUI';
import './studio-shapes.css';

// A design system in the open-source Studio: the Product system that ships with it (src/systems/product), open on its components.
// The section nav is SystemsPage's SystemNav (Overview, Libraries, then Theme, Assets and Components; Theme and Assets folded here);
// each component page is ComponentDocPage: its title and description, the prose from its .md file, then every export in its
// .examples.tsx rendered live in the system's theme. Copy and examples are the files' own (button.md, button.examples.tsx,
// card.md, card.examples.tsx). Liberties: Hugeicons' mail icon stands in for Lucide's; Geist stands in for Space Grotesk.
const components = ['Avatar', 'Badge', 'Button', 'Card', 'Checkbox', 'Dialog', 'Dropdown Menu', 'Input', 'Label', 'Select', 'Separator', 'Sheet', 'Table', 'Tabs', 'Textarea', 'Tooltip'];

function SystemNav({ on }: { on: string }) {
  const branch = (label: string, open: boolean) => <li className="ss-branch">{icon(open ? ArrowDown01Icon : ArrowRight01Icon, 14)}{label}</li>;
  return <aside className="sc-side ss-side ss-sysnav">
    <h4>Product <span>{icon(MoreHorizontalIcon, 16)}</span></h4>
    <p className="ss-side-system">Default system</p>
    <h5>Resources <span>{icon(Search01Icon, 15)}{icon(ArrowExpand01Icon, 15)}</span></h5>
    <ul>
      <li>{icon(Compass01Icon, 15)}Overview</li>
      <li>{icon(LibraryIcon, 15)}Libraries</li>
      {branch('Theme', false)}
      {branch('Assets', false)}
      {branch('Components', true)}
      {components.map(c => <li key={c} className={`is-child ${c === on ? 'is-on' : ''}`}>{icon(CubeIcon, 15)}{c}<i className="ss-aim" data-target={c} /></li>)}
    </ul>
  </aside>;
}

/** A component's page: header, its Markdown, then each example rendered in a frame. */
function ComponentPage({ title, description, prose, examples }: { title: string; description: string; prose: string[]; examples: [string, React.ReactNode][] }) {
  return <div className="ss-pane ss-sys"><div className="ss-sys-page">
    <h1>{title}</h1>
    <p className="ss-sys-desc">{description}</p>
    <h2>When to use</h2>
    {prose.map(p => <p key={p}>{p}</p>)}
    <h2>Examples</h2>
    {examples.map(([name, node]) => <section key={name}><h3>{name}</h3><div className="ss-sys-frame">{node}</div></section>)}
  </div></div>;
}

const Btn = ({ v = 'default', s = 'default', children, off = false }: { v?: string; s?: string; children: React.ReactNode; off?: boolean }) =>
  <span className={`ss-sbtn is-${v} is-size-${s} ${off ? 'is-off' : ''}`}>{children}</span>;

const button = <ComponentPage title="Button" description="Starts an action. This is the placeholder product button; replace it with your product's."
  prose={['Use a button for the main action on a screen or in a dialog, and for actions that change something. Use a link to go to another page.', 'Keep one primary button per view, so it is clear what the main action is. Use the secondary, outline, or ghost variants for the actions around it.']}
  examples={[
    ['Variants', <><Btn>Primary</Btn><Btn v="secondary">Secondary</Btn><Btn v="outline">Outline</Btn><Btn v="ghost">Ghost</Btn><Btn v="destructive">Destructive</Btn><Btn v="link">Link</Btn></>],
    ['Sizes', <><Btn s="xs">Extra small</Btn><Btn s="sm">Small</Btn><Btn>Default</Btn><Btn s="lg">Large</Btn></>],
    ['With icon', <Btn>{icon(Mail01Icon, 16)}With icon</Btn>],
    ['Disabled', <Btn off>Disabled</Btn>],
  ]} />;
/** The Product system's Card (card.tsx): a ring instead of a border, square corners, a muted footer. */
const SCard = ({ title, description, action, children, footer }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }) =>
  <div className={`ss-scard ${footer ? 'has-footer' : ''}`}>
    <div className={`ss-scard-head ${action ? 'has-action' : ''}`}><b>{title}</b><span>{description}</span>{action && <i>{action}</i>}</div>
    <div className="ss-scard-body">{children}</div>
    {footer && <div className="ss-scard-foot">{footer}</div>}
  </div>;
const card = <ComponentPage title="Card" description="A bordered container that groups related content and actions under a heading."
  prose={['Use a card to group a small set of related information, such as a summary or a settings block, so it reads as one unit. Use a table for long lists of comparable rows.', 'Don’t nest cards inside cards.']}
  examples={[
    ['Basic', <SCard title="Notifications" description="Choose what you hear about." footer={<Btn s="sm">Mark as read</Btn>}>You have 3 unread messages.</SCard>],
    ['With action', <SCard title="Team" description="Members with access." action={<Btn v="outline" s="sm">Invite</Btn>}>4 members</SCard>],
  ]} />;

const timings = [3000, 900, 3000];
const captions = ['Every component documented, with live examples', 'Every component documented, with live examples', 'Every component documented, with live examples'];

/** The Product system's Button page, then its Card page, which uses the buttons just shown. */
export default function StudioSystem() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1120, height: 760 });
  const step = scene.reduced ? 0 : scene.step;
  const t = useTargets(step);
  const [pressing, setPressing] = useState(false);
  useEffect(() => {
    if (step !== 2) return;
    setPressing(true);
    const timer = window.setTimeout(() => setPressing(false), 160);
    return () => window.clearTimeout(timer);
  }, [step, scene.take]);
  const page = step < 2 ? 'Button' : 'Card';
  return <SceneFrame scene={scene} stage={stage} title="a design system's components"
    label="The Product design system in Design Studio: a sidebar with its overview, libraries, theme, assets and sixteen components. The Button page shows when to use it and live examples of every variant and size; then the Card page, whose examples use the same buttons">
    <div ref={t.ref} style={{ position: 'relative', height: stage.box.height }} aria-hidden="true">
      <div className="sc-os ss-os">
        <OsRail on="systems" />
        <SystemNav on={page} />
        <div className="ss-panes"><Screens id={page}>{page === 'Button' ? button : card}</Screens></div>
      </div>
      <Pointer at={step > 0 ? t.at('Card') : null} visible={step > 0} pressing={pressing} reduced={scene.reduced} />
    </div>
  </SceneFrame>;
}
