import type { ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Book02Icon, BookOpen01Icon, CursorInWindowIcon, Layers01Icon, Moon02Icon, PanelLeftCloseIcon, Search01Icon, Settings01Icon, Shapes01Icon,
  Target01Icon, UserCircleIcon, WebDesign01Icon, Wrench01Icon,
} from '@hugeicons/core-free-icons';

// Pieces shared by the Design Studio screens. The internal Studio's are ported from the Design Studio archive (src/studio/app:
// GallerySidebar, CatalogPrototypeCard, CatalogFilterBar); the open-source Studio's from itspatmorgan/design-studio
// (platform/app/shell/MainNav, Logo). Icons are the same Hugeicons both products use.
type IconSvg = typeof Search01Icon;
export const icon = (i: IconSvg, size = 16, stroke = 1.6) => <HugeiconsIcon icon={i} size={size} strokeWidth={stroke} />;

/** The internal Studio's rail (GallerySidebar, collapsed): Sublime's mark, search, then Prototypes, Tools, Guide, Principles,
 *  Personas, Systems and Blueprints, with the panel toggle and color mode at the foot. */
export function Rail({ on = 'prototypes' }: { on?: string }) {
  const items: [string, IconSvg][] = [['search', Search01Icon], ['prototypes', Layers01Icon], ['tools', Wrench01Icon], ['guide', Book02Icon], ['principles', Target01Icon], ['personas', UserCircleIcon], ['systems', Shapes01Icon], ['blueprints', WebDesign01Icon]];
  return <nav className="sc-rail" aria-hidden="true">
    <img className="sc-mark" src="/images/studio-case/sublime-mark.svg" alt="" />
    {items.map(([key, i]) => <span key={key} className={`sc-rail-item ${on === key ? 'is-on' : ''}`}>{icon(i, 18)}</span>)}
    <span className="sc-rail-item sc-rail-end">{icon(PanelLeftCloseIcon, 18)}</span>
    <span className="sc-rail-item">{icon(Moon02Icon, 18)}</span>
  </nav>;
}

/** The open-source Studio's mark (shell/Logo), filled with the text color. */
export function StudioMark({ size = 22 }: { size?: number }) {
  return <svg viewBox="12.48 12 25.03 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M21.3943 12H12.48V36H21.3943V12Z" />
    <path d="M23.7944 12H25.5087C28.6913 12 31.7436 13.2643 33.994 15.5147C36.2444 17.7652 37.5087 20.8174 37.5087 24C37.5087 27.1826 36.2444 30.2348 33.994 32.4853C31.7436 34.7357 28.6913 36 25.5087 36H23.7944V12Z" />
  </svg>;
}

/** The open-source Studio's rail (MainNav): mark, search, Prototypes, Systems, Documentation; panel, settings and color mode below. */
export function OsRail({ on = 'home' }: { on?: string }) {
  const items: [string, IconSvg][] = [['search', Search01Icon], ['prototypes', CursorInWindowIcon], ['systems', Shapes01Icon], ['docs', BookOpen01Icon]];
  return <nav className="sc-rail" aria-hidden="true">
    <span className="sc-mark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><StudioMark size={20} /></span>
    {items.map(([key, i]) => <span key={key} className={`sc-rail-item ${on === key ? 'is-on' : ''}`}>{icon(i, 18)}</span>)}
    <span className="sc-rail-item sc-rail-end">{icon(PanelLeftCloseIcon, 18)}</span>
    <span className="sc-rail-item">{icon(Settings01Icon, 18)}</span>
    <span className="sc-rail-item">{icon(Moon02Icon, 18)}</span>
  </nav>;
}

// ContributorAvatar shows each person's GitHub photo. A monogram in a muted color stands in, one per teammate.
const tones: Record<string, string> = { Patrick: '#6b5d4f', Joe: '#4f6b8a', Ahry: '#5f8a6b', AJ: '#8a6f4f', Samantha: '#8a4f5f' };
export function Avatar({ name }: { name: string }) {
  return <span className="sc-avatar" style={{ background: tones[name] ?? '#71717a' }}>{name.slice(0, name === 'AJ' ? 2 : 1)}</span>;
}

export type Prototype = { who: string; title: string; desc: string; date: string };

/** A prototype in the catalog grid (CatalogPrototypeCard, grid variant): contributor, title, two lines of description, date. */
export function PrototypeCard({ p, hover = false, target }: { p: Prototype; hover?: boolean; target?: string }) {
  return <div className={`sc-card ${hover ? 'is-hover' : ''}`} data-target={target} data-frame={target}>
    <div className="sc-card-who"><Avatar name={p.who} />{p.who}</div>
    <div className="sc-card-title">{p.title}</div>
    <p className="sc-card-desc">{p.desc}</p>
    <span className="sc-card-date">{p.date}</span>
  </div>;
}

/** The catalog's team tabs (CatalogFilterBar with NAV_TEAMS) and search. */
export function Filters({ team = 'all' }: { team?: string }) {
  const tabs = [['all', 'All'], ['creative', 'Creative'], ['product-design', 'Product Design'], ['product', 'Product Management']];
  return <div className="sc-filters">
    <div className="sc-tabs">{tabs.map(([key, label]) => <span key={key} className={team === key ? 'is-on' : ''} data-target={`tab-${key}`}>{label}</span>)}</div>
    <div className="sc-search">{icon(Search01Icon, 16)}Search prototypes...</div>
  </div>;
}

/** A Sublime product screen as it sits on a canvas at 35%: the dark nav, a header, a table. The real frames are live React views. */
export function Thumb({ rows = 6, dialog = false, dark = false }: { rows?: number; dialog?: boolean; dark?: boolean }) {
  return <div className={`sc-thumb ${dialog ? 'is-dim' : ''} ${dark ? 'is-dark' : ''}`}>
    <div className="sc-thumb-nav" />
    <div className="sc-thumb-page">
      <i className="is-h" />
      {Array.from({ length: rows }, (_, r) => <div className="sc-thumb-row" key={r}><i /><i className="is-pill" style={{ margin: 0 }} /><i /></div>)}
    </div>
    {dialog && <div className="sc-thumb-dialog" />}
  </div>;
}

export function Frame({ title, note, x, y, children }: { title: string; note?: ReactNode; x: number; y: number; children: ReactNode }) {
  return <div className="sc-frame" style={{ left: x, top: y }}>
    <div className="sc-frame-head"><span>{title}</span></div>
    {children}
    {note && <p className="sc-frame-note">{note}</p>}
  </div>;
}
