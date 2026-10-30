import { AnimatePresence, motion } from 'motion/react';
import { SourceIcon, NativeBuilder, EntityPill, AddConnection, menuMotion, type SourceGlyph } from './NativeUI';
import { NativeStage, DemoCursor } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';

type Flow = 'select' | 'filter' | 'direction';
const flowTitles = { select: 'the entity picker', filter: 'the property filter', direction: 'the relationship direction' };
const timings = {
  select: [450, 500, 1900, 1100, 2400, 650, 700, 450],
  filter: [550, 550, 1000, 550, 450, 850, 1400, 700, 600, 1200, 500, 700, 3200],
  direction: [1700, 800, 2200, 2200, 2200, 1500],
};
const cursors = {
  select: [[195, 70], [210, 70], [430, 150], [270, 228], [270, 228], [525, 70], [126, 65], [126, 65]],
  filter: [[220, 71], [480, 69], [515, 69], [450, 120], [450, 120], [112, 138], [114, 138], [100, 170], [265, 138], [265, 138], [265, 141], [350, 138], [355, 138]],
  direction: [[240, 230], [105, 226], [69, 227], [69, 227], [69, 227], [235, 290]],
};
// One caption per step; steps that share a caption form one chapter in the tour.
const captions = {
  select: ['The query starts from a plain prompt', 'The query starts from a plain prompt', 'Asset types sit in categories, with a preview of each', 'Asset types sit in categories, with a preview of each', 'Choosing Channel selects it and its four types', 'Choosing Channel selects it and its four types', 'Choosing Channel selects it and its four types', 'Choosing Channel selects it and its four types'],
  filter: ['Hovering the data store shows its actions', 'Hovering the data store shows its actions', 'Hovering the data store shows its actions', 'Add filter starts a property filter', 'Add filter starts a property filter', 'The property menu lists what can be filtered', 'The property menu lists what can be filtered', 'The property menu lists what can be filtered', 'The property menu lists what can be filtered', 'Each operator says how it compares', 'Each operator says how it compares', 'A value finishes it: only production data stores', 'A value finishes it: only production data stores'],
  direction: ['Hovering a relationship shows its controls', 'Hovering a relationship shows its controls', 'The arrow reads both ways', 'The arrow points toward the source', 'The arrow points toward the target', 'The relationship keeps its direction in view'],
};
const categories: { name: string; icon: SourceGlyph; color: string }[] = [
  { name: 'Applications & Services', icon: 'Dns', color: '#26a69a' }, { name: 'Compute', icon: 'Memory', color: '#0d47a1' },
  { name: 'Configuration', icon: 'Tune', color: '#ff8f00' }, { name: 'Data', icon: 'DataObject', color: '#9575cd' },
  { name: 'Development', icon: 'Code', color: '#8bc34a' }, { name: 'Devices', icon: 'Smartphone', color: '#039be5' },
  { name: 'My Organization', icon: 'Business', color: '#5e35b1' }, { name: 'Network', icon: 'SettingsEthernet', color: '#fbc02d' },
  { name: 'Policy & Documentation', icon: 'DescriptionOutlined', color: '#8d6e63' }, { name: 'Risks & Monitoring', icon: 'OutlinedFlag', color: '#c2185b' },
  { name: 'Secrets & Vaults', icon: 'VpnKey', color: '#2e7d32' }, { name: 'Users & Identities', icon: 'Fingerprint', color: '#c0ca33' },
  { name: 'Other', icon: 'HelpOutline', color: '#bdbdbd' },
];
const types = ['aws_sns_topic', 'google_pubsub_topic', 'microsoft_teams_channel', 'slack_channel'];
function Checkbox({ checked, mixed = false }: { checked: boolean; mixed?: boolean }) { return <SourceIcon name={mixed ? 'IndeterminateCheckBox' : checked ? 'CheckBox' : 'CheckBoxOutlineBlank'} size={18} className={checked || mixed ? 'q-checked' : 'q-unchecked'} />; }

function EntityPicker({ selected, hover, onSelect }: { selected: boolean; hover: boolean; onSelect: () => void }) {
  return <motion.div className="q-picker" {...menuMotion}>
    <div className="q-picker-search"><input aria-label="Search for entity classes or types" placeholder="Search for entity classes of types" readOnly tabIndex={-1} /><SourceIcon name="Search" size={22} /></div>
    <div className="q-model-columns">
      <div className="q-model-categories">{categories.map(c => <div className="q-model-category" key={c.name}><span className="q-category-glyph" style={{ background: c.color }}><SourceIcon name={c.icon} size={16} /></span><span>{c.name}</span></div>)}</div>
      <div className="q-model-tree">
        <div className="q-tree-row q-tree-root"><Checkbox checked={false} mixed={selected} /><span className="q-tree-square q-teal"><SourceIcon name="Dns" size={18} /></span><span>Applications &amp; Services</span></div>
        <div className="q-tree-row q-tree-class"><Checkbox checked={false} /><span className="q-tree-square q-teal"><SourceIcon name="CubeOutline" size={18} /></span><span>ApplicationEndpoint</span></div>
        <button type="button" className={`q-tree-row q-tree-class q-channel-choice ${hover ? 'q-tree-hovered' : ''}`} aria-label="Select Channel and its four types" aria-pressed={selected} onClick={onSelect}><Checkbox checked={selected} /><span className="q-tree-square q-teal"><SourceIcon name="Tag" size={18} /></span><span>Channel</span></button>
        {types.map(t => <div className="q-tree-row q-tree-type" key={t}><Checkbox checked={selected} /><span>{t}</span></div>)}
        <div className="q-tree-row q-tree-class"><Checkbox checked={false} /><span className="q-tree-square q-teal"><SourceIcon name="Functions" size={18} /></span><span>Function</span></div>
        <div className="q-tree-row q-tree-class"><Checkbox checked={false} /><span className="q-tree-square q-teal"><SourceIcon name="CropSquare" size={18} /></span><span>Group</span></div>
      </div>
      <div className="q-model-summary"><h4><span className="q-tree-square q-teal"><SourceIcon name="Tag" size={20} /></span>Channel</h4><p>A communication channel, such as a Slack channel or AWS SNS topic</p><hr /><strong>Types</strong><ul>{types.map(t => <li key={t}>{t}</li>)}</ul></div>
    </div>
  </motion.div>;
}

function SelectionScene({ phase, choose }: { phase: number; choose: (phase: number) => void }) {
  const selected = phase >= 4;
  const open = phase >= 2 && phase <= 5;
  return <div className="q-selection-scene"><span className="q-keyword">FIND</span><div className="q-selection-root"><div className={`q-selection-row ${phase === 1 || phase === 4 || phase === 5 || phase === 7 ? 'q-selection-hovered' : ''}`}>
    {selected ? <EntityPill name="Channel" onRemove={() => choose(0)} /> : <div className="q-selection-prompt"><span>Start by selecting</span><button type="button" className={`q-specific-entities ${phase === 1 ? 'q-specific-hovered' : ''}`} onClick={() => choose(2)}>specific entities</button><span>or</span><span className="q-query-anything">query anything</span></div>}
    {selected && open && <button type="button" className="q-picker-dismiss" aria-label="Close entity picker with Channel selected" onClick={() => choose(6)} />}
    {selected && (phase === 5 || phase === 7) && <span className="q-selection-actions"><SourceIcon name="CallSplit" size={18} /><SourceIcon name="FilterList" size={18} /></span>}
  </div></div><AnimatePresence initial={false}>{open && <EntityPicker key="picker" selected={selected} hover={phase === 3} onSelect={() => choose(4)} />}</AnimatePresence>{!open && <AddConnection disabled={!selected} />}</div>;
}

export default function FigmaFlow({ sequence }: { sequence: Flow }) {
  const scene = useScene(timings[sequence], captions[sequence]);
  const phase = scene.step;
  const [width, height] = sequence === 'select' ? [932, 565] : [600, 400];
  const [sourceX, sourceY] = cursors[sequence][phase];
  const direction = phase === 3 ? 1 : phase >= 4 ? 2 : 0;
  const tooltip = phase === 2 ? 'Bidirectional' : phase === 3 ? 'Toward source' : phase === 4 ? 'Toward target' : undefined;
  const nextDirection = () => scene.choose(direction === 0 ? 3 : direction === 1 ? 4 : 2);
  return <DemoFrame scene={scene} title={flowTitles[sequence]} label={`Design demo: ${flowTitles[sequence]}`}><div className={`cs-demo qb-flow qb-flow-${sequence}`} data-step={phase} onKeyDown={e => { if (e.key === 'Escape') scene.choose(sequence === 'select' ? (phase >= 4 ? 6 : 0) : sequence === 'filter' ? (phase < 5 ? 0 : phase < 8 ? 5 : 8) : 0); }}>
    <div className="qb-film-stage"><NativeStage width={width} height={height} crop={sequence === 'select' ? undefined : { x: 0, y: 12, width: 588, height: 360 }} interactive={!scene.playing}>
      {sequence === 'select' ? <SelectionScene phase={phase} choose={scene.choose} /> : <NativeBuilder filterPhase={sequence === 'filter' ? phase : 12} onFilterPhase={sequence === 'filter' ? scene.choose : undefined} hoverRoot={sequence === 'filter' && phase >= 1 && phase <= 4} tooltip={sequence === 'filter' && phase === 2} filterMenu={sequence === 'filter' && (phase === 3 || phase === 4)} menuHover={phase === 4} animated={sequence === 'filter' && scene.playing} relation={sequence === 'direction'} direction={direction} directionTooltip={sequence === 'direction' ? tooltip : undefined} relationHover={sequence === 'direction' && phase >= 1 && phase <= 4} onDirection={nextDirection} />}
      <DemoCursor x={sourceX} y={sourceY} visible={scene.playing} reduced={scene.reduced} pressing={sequence === 'filter' ? [4, 7, 10].includes(phase) : sequence === 'select' ? phase === 4 : phase === 3 || phase === 4} />
    </NativeStage></div>
  </div></DemoFrame>;
}
