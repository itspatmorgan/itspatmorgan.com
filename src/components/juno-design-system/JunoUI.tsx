import type { CSSProperties, ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, AlertCircleIcon, ArrowDown01Icon, Cancel01Icon, CheckmarkCircle02Icon, InformationCircleIcon, PlusSignCircleIcon, Search01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { NativeStage } from '../case-study/NativeStage';

// Juno's parts, rebuilt from the Figma source and Patrick's exports. Type sizes come from the type scale table and color from the navy
// and teal ramps. Chip and alert colors are read from the exported frames, so they're close rather than exact.

export const Icon = ({ icon, size = 18, style }: { icon: Parameters<typeof HugeiconsIcon>[0]['icon']; size?: number; style?: CSSProperties }) => <HugeiconsIcon icon={icon} size={size} strokeWidth={1.7} style={style} />;

export const ramps = {
  Navy: [['50', 'DEEAFC'], ['100', 'B3CFF9'], ['200', '5F98F2'], ['300', '1C6EED'], ['400', '1059C6'], ['500', '0D47A1'], ['600', '083D87'], ['700', '073473'], ['800', '062A5B'], ['900', '041E42']],
  Teal: [['50', 'E0F2F1'], ['100', 'B2DFDB'], ['200', '80CBC4'], ['300', '4DB6AC'], ['400', '26A69A'], ['500', '009688'], ['600', '00897B'], ['700', '00796B'], ['800', '00695C'], ['900', '004D40']],
} as const;

export const typeScale = [
  ['Header 1', 'Regular', 28, 1.25, '-0.24px', 400], ['Header 2', 'Regular', 25, 1.25, '-0.20px', 400], ['Header 3', 'Regular', 22, 1.25, '-0.16px', 400], ['Header 4', 'Regular', 20, 1.25, '-0.12px', 400],
  ['Header 5', 'Black', 16, 1.25, '-0.08px', 900], ['Subtitle1', 'Bold', 16, 1.75, '0px', 700], ['Body1', 'Regular', 16, 1.5, '0.15px', 400], ['Caption', 'Regular', 12, 1.66, '0.4px', 400],
] as const;

export const chipTones = ['neutral', 'navy', 'teal', 'red', 'yellow', 'green', 'blue'] as const;
export const Chip = ({ tone = 'neutral', small = false, children = 'Chip' }: { tone?: typeof chipTones[number]; small?: boolean; children?: ReactNode }) => <span className={`j-chip is-${tone} ${small ? 'is-small' : ''}`}>{children}</span>;

export const Button = ({ children, add = false, menu = false, style }: { children: ReactNode; add?: boolean; menu?: boolean; style?: CSSProperties }) => <span className="j-btn" style={style}>{add && <Icon icon={PlusSignCircleIcon} size={18} />}<span>{children}</span>{menu && <Icon icon={ArrowDown01Icon} size={14} />}</span>;

const alertIcons = { error: AlertCircleIcon, warning: Alert02Icon, info: InformationCircleIcon, success: CheckmarkCircle02Icon };
export const Alert = ({ tone, outlined = false, title, children = 'Alert content' }: { tone: keyof typeof alertIcons; outlined?: boolean; title?: string; children?: ReactNode }) => <div className={`j-alert is-${tone} ${outlined ? 'is-outlined' : ''}`}>
  <Icon icon={alertIcons[tone]} size={18} /><div className="j-alert-body">{title && <b>{title}</b>}<span>{children}</span></div><span className="j-alert-action">Action</span><Icon icon={Cancel01Icon} size={15} />
</div>;

export const Field = ({ label, value }: { label: string; value: string }) => <div className="j-field"><i>{label}</i><span>{value}</span></div>;

const classes = [['Application', true], ['CodeRepo', false], ['Deployment', true], ['Repository', false], ['Service', false], ['Workflow', true]] as const;
export const FilterMenu = () => <div className="j-filter">
  <div className="j-filter-search"><span>Search</span><Icon icon={Search01Icon} size={16} /></div>
  {classes.map(([name, on]) => <div className="j-filter-row" key={name}><i className={on ? 'is-on' : ''}>{on && <Icon icon={Tick02Icon} size={12} />}</i>{name}</div>)}
  <div className="j-filter-foot"><span>3 Selected</span><span>Clear Filters</span></div>
</div>;

/** The JupiterOne mark, tinted by `color`. */
export const J1Mark = ({ size = 32, color = '#1DE9B6' }: { size?: number; color?: string }) => <i className="j-j1" style={{ width: size, height: size, background: color }} />;

/** A contained card on the plain stage. Its contents lay out at 700 px and scale up, so they stay legible on a phone. */
export function Board({ children, label }: { children: ReactNode; label?: string }) {
  return <NativeStage width={1240} height={760}>
    <div className="jds-board" aria-label={label}><div className="jds-board-in">{children}</div></div>
  </NativeStage>;
}
