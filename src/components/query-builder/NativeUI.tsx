import { createElement, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import glyphs from './source-glyphs.json';

type Glyph = keyof typeof glyphs;
export type SourceGlyph = Glyph;
export function SourceIcon({ name, size = 18, className = '' }: { name: Glyph; size?: number; className?: string }) {
  const glyph = glyphs[name];
  return <svg className={`q-icon ${className}`} width={size} height={size} viewBox={glyph.viewBox} fill="currentColor" aria-hidden="true">{glyph.shapes.map((shape, i) => createElement(shape.tag, { ...shape.attrs, key: i }))}</svg>;
}

const entities: Record<string, { icon: Glyph; color: string }> = {
  DataStore: { icon: 'ArchiveOutline', color: 'gold' }, AccessPolicy: { icon: 'OriginalAccessPolicy', color: 'green' },
  AccessRole: { icon: 'BookmarkOutline', color: 'green' }, google_iam_binding: { icon: 'GoogleCloud', color: 'blue' },
  UserGroup: { icon: 'OriginalUserGroup', color: 'cyan' }, User: { icon: 'PersonOutline', color: 'cyan' }, Channel: { icon: 'Tag', color: 'teal' },
};
export function EntityPill({ name, removable = true, onRemove }: { name: string; removable?: boolean; onRemove?: () => void }) {
  const entity = entities[name] ?? entities.Channel;
  return <span className="q-chip"><SourceIcon name={entity.icon} size={16} className={`q-${entity.color}`} /><span>{name}</span>{removable && (onRemove ? <button type="button" className="q-chip-remove" onClick={onRemove} aria-label={`Remove ${name}`}><SourceIcon name="Cancel" size={16} /></button> : <SourceIcon name="Cancel" size={16} className="q-chip-cancel" />)}</span>;
}

export const menuMotion = { initial: { opacity: 0, y: 3 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 2 }, transition: { duration: .16, ease: [.16, 1, .3, 1] as [number, number, number, number] } };
export function Reveal({ children, className = '', staticContent = false }: { children: ReactNode; className?: string; staticContent?: boolean }) {
  if (staticContent) return <div className={`q-reveal ${className}`}>{children}</div>;
  return <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ height: { duration: .32, ease: [.22, 1, .36, 1] }, opacity: { duration: .18 } }} className={`q-reveal ${className}`}>{children}</motion.div>;
}
export function Tooltip({ children }: { children: ReactNode }) { return <motion.span className="q-tooltip" {...menuMotion}>{children}</motion.span>; }

export function RowActions({ highlighted, filterOpen, onFilter }: { highlighted: boolean; filterOpen?: boolean; onFilter?: () => void }) {
  return <span className={`q-row-actions ${highlighted ? 'q-actions-visible' : ''}`}><span><SourceIcon name="CallSplit" size={18} /></span><>{onFilter ? <button type="button" className={filterOpen ? 'q-action-selected' : ''} aria-label="Open property filter actions" onClick={onFilter}><SourceIcon name="FilterList" size={18} /></button> : <span aria-hidden="true"><SourceIcon name="FilterList" size={18} /></span>}</></span>;
}

export function AddConnection({ disabled = false }: { disabled?: boolean }) { return <span className={`q-add-connection ${disabled ? 'q-disabled' : ''}`}>Add connection</span>; }
export function AddFilter() { return <span className="q-add-filter">Add Filter<SourceIcon name="ArrowDropDown" size={16} /></span>; }

function useTypedProduction(active: boolean, animated: boolean) {
  const [value, setValue] = useState('');
  useEffect(() => {
    if (!active) { setValue(''); return; }
    if (!animated) { setValue('production'); return; }
    let index = 0;
    setValue('');
    const timer = window.setInterval(() => { index++; setValue('production'.slice(0, index)); if (index === 10) window.clearInterval(timer); }, 65);
    return () => window.clearInterval(timer);
  }, [active, animated]);
  return active ? (animated ? value : 'production') : '';
}

type FilterProps = { phase?: number; onPhase?: (phase: number) => void; animated?: boolean; query?: boolean; userFilter?: boolean; queryPart?: number };
export function PropertyFields({ phase = 12, onPhase, animated = false, query = false, userFilter = false, queryPart }: FilterProps) {
  const typed = useTypedProduction(phase === 12, animated);
  const propertySelected = phase >= 8;
  const operatorSelected = phase >= 11;
  const properties = ['pltfm_env', 'accountName', 'accessKeyEnabled', 'displayName', 'createdOn', '_beginOn', '_class', '_version'];
  const operators = [['=', 'Equal to'], ['>', 'Greater than'], ['>=', 'Greater than or equal to'], ['<', 'Less than'], ['<=', 'Less than or equal to'], ['!=', 'Not equal to'], ['~=', 'Contains']];
  return <div data-query-part={queryPart} inert={!onPhase} className={`q-filter-group ${query ? 'q-query-fields' : ''} ${userFilter ? 'q-user-filter' : ''}`}>
    <span className="q-keyword">WITH</span>
    <div className={`q-fields ${operatorSelected ? 'q-operator-selected' : ''}`}>
      <div className="q-property-slot"><button className={`q-field q-field-property ${!propertySelected && !userFilter ? 'q-placeholder' : ''} ${phase === 5 ? 'q-field-hover' : ''}`} type="button" onClick={() => onPhase?.(6)} aria-label="Choose property name"><span>{userFilter ? '_type' : propertySelected ? 'pltfm_env' : 'Property name'}</span><SourceIcon name="ArrowDropDown" size={24} /></button>
        <AnimatePresence>{(phase === 6 || phase === 7) && <motion.div key="properties" className="q-menu q-property-menu" {...menuMotion}>
          <div className="q-menu-search"><span>Search</span><SourceIcon name="Search" size={20} /></div>
          {properties.map((p, i) => <button className={`q-property-option ${i === 0 && phase === 7 ? 'q-menu-hover' : ''}`} key={p} type="button" onClick={() => { if (i === 0) onPhase?.(8); }} aria-label={i === 0 ? 'Choose pltfm_env property' : undefined} tabIndex={i === 0 ? 0 : -1}><span className="q-property-type"><SourceIcon name={i === 7 ? 'Tag' : 'Title'} size={14} /></span><span className="q-property-tag">{i < 2 && <SourceIcon name="LocalOfferOutlined" size={13} />}</span><span>{p}</span></button>)}
        </motion.div>}</AnimatePresence>
      </div>
      <div className="q-operator-slot"><button type="button" className={`q-field q-field-operator ${!operatorSelected && !userFilter ? 'q-placeholder' : ''} ${phase === 8 ? 'q-field-hover' : ''}`} onClick={() => onPhase?.(9)} aria-label="Choose operator"><span>{userFilter ? '!=' : operatorSelected ? '=' : 'Operator'}</span><SourceIcon name="ArrowDropDown" size={24} /></button>
        <AnimatePresence>{(phase === 9 || phase === 10) && <motion.div key="operators" className="q-menu q-operator-menu" {...menuMotion}>{operators.map(([symbol, name], i) => <button type="button" key={symbol} className={`q-operator-option ${i === 0 && (phase === 9 || phase === 10) ? 'q-menu-hover' : ''}`} onClick={() => { if (i === 0) onPhase?.(11); }} aria-label={i === 0 ? 'Choose Equal to operator' : undefined} tabIndex={i === 0 ? 0 : -1}><span>{symbol}</span><span>{name}</span></button>)}</motion.div>}</AnimatePresence>
      </div>
      <button type="button" className={`q-field q-field-value ${phase < 12 && !userFilter ? 'q-placeholder' : ''} ${phase === 11 ? 'q-field-hover' : ''}`} onClick={() => onPhase?.(12)} aria-label="Set demonstrated value to production">{userFilter ? '"google_iam_service_account"' : phase === 12 ? <>“{typed}{animated && typed.length < 10 && <span className="q-type-caret" />}”</> : 'Value'}</button>
    </div>
    <AddFilter />
  </div>;
}

export function Relationship({ name = 'AccessPolicy', relation = 'RELATES TO', direction = 0, optional = false, hovered = false, tooltip, onDirection, removable, children, queryPart }: { name?: string; relation?: string; direction?: number; optional?: boolean; hovered?: boolean; tooltip?: string; onDirection?: () => void; removable?: boolean; children?: ReactNode; queryPart?: number }) {
  return <div className={`q-relationship ${optional ? 'q-relationship-optional' : ''}`}>
    <div data-query-part={queryPart} className={`q-relation-content ${hovered ? 'q-relation-hovered' : ''}`}>
      <div className="q-relation-label"><span className="q-direction-wrap"><button className="q-direction-button" type="button" onClick={onDirection} aria-label={`Change relationship direction: ${direction === 1 ? 'toward source' : direction === 2 ? 'toward target' : 'bidirectional'}`}><SourceIcon name={direction === 1 ? 'KeyboardDoubleArrowLeft' : direction === 2 ? 'KeyboardDoubleArrowRight' : 'Code'} size={16} /></button><AnimatePresence>{tooltip && <Tooltip key={tooltip}>{tooltip}</Tooltip>}</AnimatePresence></span><span><span className="q-keyword">THAT</span> {relation}</span><SourceIcon name="ArrowDropDown" size={14} /><span className="q-relation-options"><SourceIcon name="MoreHoriz" size={16} /><SourceIcon name="Close" size={14} /></span></div>
      <div className="q-related-entity"><EntityPill name={name} removable={removable ?? name === 'AccessPolicy'} />{hovered && <span className="q-related-actions"><SourceIcon name="CallSplit" size={18} /><SourceIcon name="FilterList" size={18} /></span>}</div>
      {name === 'User' && children}
    </div>
    {name !== 'User' && children}
  </div>;
}

export function NativeBuilder({ filterPhase = -1, onFilterPhase, hoverRoot = false, tooltip = false, filterMenu = false, menuHover = false, relation = false, direction = 0, directionTooltip, relationHover = false, onDirection, queryStep, animated = false }: { filterPhase?: number; onFilterPhase?: (phase: number) => void; hoverRoot?: boolean; tooltip?: boolean; filterMenu?: boolean; menuHover?: boolean; relation?: boolean; direction?: number; directionTooltip?: string; relationHover?: boolean; onDirection?: () => void; queryStep?: number; animated?: boolean }) {
  const query = queryStep !== undefined;
  return <div className={`q-builder ${query ? 'q-query-ui' : ''}`}>
    <span className="q-keyword">FIND</span>
    <div className="q-root">
      <div data-query-part={query ? 0 : undefined} className={`q-entity-row ${hoverRoot ? 'q-entity-hovered' : ''}`} onMouseEnter={() => { if (!query && filterPhase < 3) onFilterPhase?.(1); }}>
        <EntityPill name="DataStore" removable={!query} />
        {!query && <RowActions highlighted={hoverRoot} filterOpen={tooltip || filterMenu} onFilter={onFilterPhase ? () => onFilterPhase(3) : undefined} />}
        <AnimatePresence>{tooltip && <Tooltip key="filter-tooltip">Property filters</Tooltip>}</AnimatePresence>
        <AnimatePresence>{filterMenu && <motion.div key="filter-menu" className="q-menu q-filter-menu" {...menuMotion}><button type="button" className={menuHover ? 'q-menu-hover' : ''} onClick={() => onFilterPhase?.(5)}>Add property filter</button><span>Add filter group</span></motion.div>}</AnimatePresence>
      </div>
      <AnimatePresence initial={false}>{filterPhase >= 5 && <Reveal key="filter" staticContent={query}><PropertyFields phase={filterPhase} onPhase={onFilterPhase} animated={animated} query={query} queryPart={query ? 1 : undefined} /></Reveal>}</AnimatePresence>
      <AnimatePresence initial={false}>{relation && <Reveal key="relationship" staticContent={query}><Relationship queryPart={query ? 2 : undefined} removable={!query} relation={query ? 'ALLOWS' : 'RELATES TO'} direction={query ? 1 : direction} hovered={relationHover} tooltip={directionTooltip} onDirection={onDirection}>
        {query && <div className="q-optional-stack" data-query-part="optional"><AnimatePresence initial={false}>{['AccessRole', 'google_iam_binding', 'UserGroup'].map((name, i) => queryStep! >= i + 3 && <Reveal key={name} staticContent><Relationship name={name} relation={i === 1 ? 'USES' : 'ASSIGNED'} direction={i === 1 ? 1 : 2} optional /></Reveal>)}</AnimatePresence></div>}
      </Relationship></Reveal>}</AnimatePresence>
      <AnimatePresence initial={false}>{query && queryStep >= 6 && <Reveal key="user" className="q-user-reveal" staticContent><Relationship queryPart={6} name="User" relation="ASSIGNED OR HAS" direction={2}><PropertyFields phase={12} query userFilter /></Relationship></Reveal>}</AnimatePresence>
    </div>
    <AddConnection />
  </div>;
}
