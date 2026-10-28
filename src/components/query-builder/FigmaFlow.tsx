import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { SourceIcon, NativeStage, NativeBuilder, EntityPill, AddConnection, DemoControls, DemoCursor, menuMotion, type SourceGlyph } from './NativeUI';
import { useDemoLoop } from './useDemoLoop';

type Flow = 'select' | 'filter' | 'direction';
const flowTitles = { select: 'entity selection', filter: 'property filtering', direction: 'relationship direction' };
const timings = {
  select: [450, 500, 2500, 850, 2400, 650, 700, 450],
  filter: [550, 550, 1000, 950, 450, 850, 1600, 600, 800, 1600, 600, 700, 3200],
  direction: [1700, 800, 2200, 2200, 2200, 1500],
};
const cursors = {
  select: [[195, 70], [210, 70], [278, 228], [270, 228], [270, 228], [525, 70], [126, 65], [126, 65]],
  filter: [[220, 71], [480, 69], [515, 69], [450, 120], [450, 120], [112, 138], [114, 138], [100, 170], [265, 138], [265, 138], [265, 141], [350, 138], [355, 138]],
  direction: [[240, 230], [105, 226], [69, 227], [69, 227], [69, 227], [235, 290]],
};
const captions = {
  select: ['A recognizable starting point.', 'Choose specific entities.', 'Categories, classes, and context.', 'Preview a class and its types.', 'Select Channel and its four types.', 'The selection follows you.', 'A concrete first step.', 'Remove the selection to start again.'],
  filter: ['Start with a data store.', 'Actions appear in context.', 'A label makes the action clear.', 'Add a property filter.', 'Choose the filter action.', 'Property, operator, value.', 'Discover available properties.', 'Choose pltfm_env.', 'The property is in place.', 'Operators explain the comparison.', 'Choose “Equal to”.', 'Finish with a value.', 'Only production data stores.'],
  direction: ['A connection between two entities.', 'Actions appear on hover.', 'Bidirectional.', 'Toward the source.', 'Toward the target.', 'The direction remains visible.'],
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
  const loop = useDemoLoop(timings[sequence], sequence === 'select' ? 2 : 0);
  const phase = loop.step;
  const [width, height] = sequence === 'select' ? [932, 565] : [600, 400];
  const crop = sequence === 'select' ? undefined : { x: sequence === 'filter' && phase >= 1 && phase <= 4 ? 88 : 12, y: 16, width: 480, height: 340 };
  const [sourceX, sourceY] = cursors[sequence][phase];
  const closeup = sequence === 'select' && [0, 1, 6, 7].includes(phase);
  const x = closeup ? 42 + sourceX * 1.55 : sourceX;
  const y = closeup ? 110 + sourceY * 1.55 : sourceY;
  const direction = phase === 3 ? 1 : phase >= 4 ? 2 : 0;
  const tooltip = phase === 2 ? 'Bidirectional' : phase === 3 ? 'Toward source' : phase === 4 ? 'Toward target' : undefined;
  const nextDirection = () => loop.choose(direction === 0 ? 3 : direction === 1 ? 4 : 2);
  return <figure className={`qb-demo qb-flow qb-flow-${sequence} ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} data-step={phase} aria-label={`${flowTitles[sequence]} design demo`} onKeyDown={e => { if (e.key === 'Escape') loop.choose(sequence === 'select' ? (phase >= 4 ? 6 : 0) : sequence === 'filter' ? (phase < 5 ? 0 : phase < 8 ? 5 : 8) : 0); }}>
    <div className="qb-film-stage"><NativeStage width={width} height={height} crop={crop} interactive={!loop.playing}>
      {sequence === 'select' ? <SelectionScene phase={phase} choose={loop.choose} /> : <NativeBuilder filterPhase={sequence === 'filter' ? phase : 12} onFilterPhase={sequence === 'filter' ? loop.choose : undefined} hoverRoot={sequence === 'filter' && phase >= 1 && phase <= 4} tooltip={sequence === 'filter' && (phase === 2 || phase === 3)} filterMenu={sequence === 'filter' && (phase === 3 || phase === 4)} menuHover={phase === 4} animated={sequence === 'filter' && loop.playing} relation={sequence === 'direction'} direction={direction} directionTooltip={sequence === 'direction' ? tooltip : undefined} relationHover={sequence === 'direction' && phase >= 1 && phase <= 4} onDirection={nextDirection} />}
      <DemoCursor x={x} y={y} visible={loop.playing} reduced={loop.reduced} pressing={sequence === 'filter' ? [4, 7, 10].includes(phase) : sequence === 'select' ? phase === 4 : phase === 3 || phase === 4} />
    </NativeStage></div>
    <DemoControls loop={loop} title={flowTitles[sequence]} caption={captions[sequence][phase]} />
  </figure>;
}

type Concept = 'words' | 'entities' | 'relationships' | 'direction' | 'filters' | 'operators' | 'optional';
type Token = { text: string; type?: Concept };
const t = (text: string, type?: Concept): Token => ({ text, type });
const syntaxLines: Token[][] = [
  [t('FIND UNIQUE', 'words'), t(' '), t('DataStore', 'entities')],
  [t('WITH', 'words'), t(' '), t('tag.pltfm_env', 'filters'), t(' '), t('=', 'operators'), t(' '), t('“production”', 'filters'), t(' AS', 'words'), t(' ds')],
  [t('THAT', 'words'), t(' '), t('ALLOWS', 'relationships'), t(' '), t('<<', 'direction'), t(' '), t('AccessPolicy', 'entities')],
  [t('(', 'optional'), t('THAT', 'words'), t(' '), t('ASSIGNED', 'relationships'), t(' '), t('>>', 'direction'), t(' '), t('AccessRole', 'entities'), t(')?', 'optional')],
  [t('(', 'optional'), t('THAT', 'words'), t(' '), t('USES', 'relationships'), t(' '), t('<<', 'direction'), t(' google_iam_binding'), t(')?', 'optional')],
  [t('(', 'optional'), t('THAT', 'words'), t(' '), t('ASSIGNED', 'relationships'), t(' '), t('>>', 'direction'), t(' '), t('UserGroup', 'entities'), t(')?', 'optional')],
  [t('THAT', 'words'), t(' ('), t('ASSIGNED', 'relationships'), t('|', 'operators'), t('HAS', 'relationships'), t(') '), t('>>', 'direction'), t(' '), t('User', 'entities'), t(' WITH', 'words'), t(' _type', 'filters'), t(' '), t('!=', 'operators'), t(' “google_iam_service_account”', 'filters')],
];
const concepts: { key: Concept; title: string; label: string; description: string }[] = [
  { key: 'words', title: 'A language with a structure.', label: 'Keywords', description: 'Protected words establish the shape of a query.' },
  { key: 'entities', title: 'Start with the things you know.', label: 'Entities', description: 'Entities give an unfamiliar environment a recognizable vocabulary.' },
  { key: 'relationships', title: 'Then follow the connections.', label: 'Relationships', description: 'Relationships describe how one entity connects to another.' },
  { key: 'direction', title: 'The direction changes the question.', label: 'Direction', description: 'Traverse toward a source, toward a target, or in both directions.' },
  { key: 'filters', title: 'Narrow the question.', label: 'Filters', description: 'Properties and values focus the query on the data that matters.' },
  { key: 'operators', title: 'Make the comparison explicit.', label: 'Operators', description: 'Operators describe how values should be compared or combined.' },
  { key: 'optional', title: 'Explore further. Keep the starting point.', label: 'Optionality', description: 'Optional traversals preserve an entity even when a connection is absent.' },
];
const syntaxTimings = [3000, 3000, 3000, 3000, 3000, 3000, 3600];
export function SyntaxSequence() {
  const loop = useDemoLoop(syntaxTimings);
  const current = concepts[loop.step];
  return <MotionConfig reducedMotion="user"><figure className={`qb-demo qb-syntax-sequence ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="Query syntax features" data-concept={current.key}>
    <div className="q-syntax-surface qb-native">
      <div className="q-syntax-editor">
        <div className="q-editor-bar"><span className="q-editor-tab"><SourceIcon name="Code" size={14} />access-review.j1ql</span><span className="q-editor-language">J1QL</span></div>
        <div className="q-syntax-code"><code>{syntaxLines.map((line, row) => <div className="q-editor-line" key={row}><span className="q-editor-line-number" aria-hidden="true">{row + 1}</span><span className={`q-syntax-line ${row > 1 ? 'q-syntax-indent' : ''}`}>{line.map((token, i) => <span key={i} className={`q-syntax-token ${token.type ? `q-syntax-${token.type}` : ''} ${token.type === current.key ? 'q-token-active' : 'q-token-muted'}`} style={{ transitionDelay: `${i * 12}ms` }}>{token.text}</span>)}</span></div>)}</code></div>
        <div className="q-editor-status" aria-hidden="true">{current.label}</div>
      </div>
    </div>
    <DemoControls loop={loop} title="syntax features" caption={current.description} />
  </figure></MotionConfig>;
}
