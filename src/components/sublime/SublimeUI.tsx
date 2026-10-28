import type { CSSProperties, ReactNode } from 'react';

// Primitives for the Sublime screens. Sizes are the source's Tailwind values in CSS pixels; `Zoom` scales a source-sized layout to fill the frame card.

export const ART = { asa: '/images/work/sublime/asa_cube.png', ade: '/images/work/sublime/ade_triangle.png' };

/** Lays out children at `width` source pixels and scales them to fill `to` frame pixels. */
export function Zoom({ width, to = 1020, children, style }: { width: number; to?: number; children: ReactNode; style?: CSSProperties }) {
  return <div className="sb-zoom" style={{ width, transform: `scale(${to / width})`, ...style }}>{children}</div>;
}

type Verdict = 'malicious' | 'spam' | 'graymail' | 'benign';
const verdictGlyph: Record<Verdict, ReactNode> = {
  malicious: <path d="M8 4.6v4.2M8 11.2v.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />,
  spam: <rect x="5.4" y="5.4" width="5.2" height="5.2" rx="1" stroke="#fff" strokeWidth="1.4" fill="none" />,
  graymail: <path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />,
  benign: <path d="M5.2 8.2l1.9 1.9 3.7-3.9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
};
export const verdictName: Record<Verdict, string> = { malicious: 'Malicious', spam: 'Spam', graymail: 'Graymail', benign: 'Benign' };

/** The product's verdict mark: a rounded hexagon in the verdict color. */
export function VerdictIcon({ verdict, size = 16 }: { verdict: Verdict; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .9l6.2 3.55v7.1L8 15.1l-6.2-3.55v-7.1z" fill={`var(--sb-${verdict})`} stroke={`var(--sb-${verdict})`} strokeWidth="1.2" strokeLinejoin="round" />{verdictGlyph[verdict]}</svg>;
}

export function VerdictLabel({ verdict }: { verdict: Verdict }) {
  return <span className="sb-verdict"><VerdictIcon verdict={verdict} />{verdictName[verdict]}</span>;
}

export function CheckCircle({ size = 16, color = 'var(--sb-success)', check = '#fff' }: { size?: number; color?: string; check?: string }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill={color} /><path d="M4.8 8.2l2.1 2.1 4.3-4.4" stroke={check} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>;
}

/** The product shot's glass pane; `back` recedes for a step that comes later. */
export function Glass({ back = false, className = '', style, children }: { back?: boolean; className?: string; style?: CSSProperties; children: ReactNode }) {
  return <div className={`sb-glass ${back ? 'is-back' : ''} ${className}`} style={style}>{children}</div>;
}

// The recommended rule from the ADÉ blueprint (_ade-data.js), tokenized by hand in the MQL editor's colors.
type Tok = [string, string?];
const rule: Tok[][] = [
  [['type', 'p'], ['.'], ['inbound', 'p']],
  [['and', 'k'], [' '], ['any', 'f'], ['('], ['attachments', 'p'], [',']],
  [['  .'], ['file_extension', 'p'], [' '], ['in~', 'k'], [' ('], ['"png"', 's'], [', '], ['"jpg"', 's'], [', '], ['"jpeg"', 's'], [', '], ['"pdf"', 's'], [')']],
  [['  '], ['and', 'k'], [' '], ['any', 'f'], ['('], ['file.explode', 'f'], ['(.),']],
  [['    .'], ['scan.qr.type', 'p'], [' == '], ['"url"', 's']],
  [['    '], ['and', 'k'], [' '], ['ml.link_analysis', 'f'], ['(.'], ['scan.qr.data', 'p'], [').'], ['credphish.disposition', 'p'], [' == '], ['"phishing"', 's']],
  [['  )']],
  [[')']],
  [['and', 'k'], [' '], ['any', 'f'], ['('], ['ml.nlu_classifier', 'f'], ['('], ['body.current_thread.text', 'p'], [').'], ['intents', 'p'], [',']],
  [['  .'], ['name', 'p'], [' '], ['in', 'k'], [' ('], ['"payroll"', 's'], [', '], ['"credential_theft"', 's'], [')']],
  [['  '], ['and', 'k'], [' .'], ['confidence', 'p'], [' '], ['in', 'k'], [' ('], ['"medium"', 's'], [', '], ['"high"', 's'], [')']],
  [[')']],
  [['and', 'k'], [' '], ['network.whois', 'f'], ['('], ['sender.email.domain', 'p'], [').'], ['days_old', 'p'], [' <= '], ['45', 'd']],
];
export const ruleName = 'Credential phishing: payroll QR code lure with newly registered domain';
export const ruleDescription = 'Detects inbound payroll-themed messages that contain QR-code links to newly registered credential-harvesting domains.';

/** The rule's MQL; `lines` limits how many lines show (for a rule being written). */
export function RuleCode({ lines = rule.length, style }: { lines?: number; style?: CSSProperties }) {
  return <div className="sb-code" style={style}>{rule.map((line, i) => <span key={i} style={{ display: 'contents', visibility: i < lines ? 'visible' : 'hidden' }}>
    <span className="n">{i + 1}</span>
    <span>{line.map(([text, kind], j) => kind ? <span key={j} className={kind}>{text}</span> : text)}</span>
  </span>)}</div>;
}
