import type { CSSProperties, ReactNode, RefObject } from 'react';
import { CountUp, Expand, useNarrowLayout } from './scene';

// Primitives for the Sublime screens. Sizes are the source's Tailwind values in CSS pixels; `Zoom` scales a source-sized layout to fill the frame card.

export const ART = { asa: '/images/work/sublime/asa_cube.png', ade: '/images/work/sublime/ade_triangle.png' };

/** Lays out children at `width` source pixels and scales them to fill `to` frame pixels. */
export function Zoom({ width, to = 1020, children, style, zoomRef }: { width: number; to?: number; children: ReactNode; style?: CSSProperties; zoomRef?: RefObject<HTMLDivElement | null> }) {
  return <div className="sb-zoom" ref={zoomRef} style={{ width, transform: `scale(${to / width})`, ...style }}>{children}</div>;
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
  return <div className="sb-code" style={style}>{rule.map((line, i) => <span key={i} className={`sb-code-line ${i < lines ? '' : 'is-out'}`}>
    <span className="n">{i + 1}</span>
    <span>{line.map(([text, kind], j) => kind ? <span key={j} className={kind}>{text}</span> : text)}</span>
  </span>)}</div>;
}

// Small product icons, drawn to the Font Awesome shapes the product uses.
export const Icon = {
  chevron: (dir: 'right' | 'down' = 'right') => <svg className="sb-chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ transform: dir === 'down' ? 'rotate(90deg)' : undefined }}><path d="M4.5 2.5L8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  external: <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M8.5 1.5h4v4M12.5 1.5L6.5 7.5M11 8.5v3a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  info: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.8" fill="none" stroke="currentColor" strokeWidth="1.1" /><path d="M8 7.2v4M8 4.8v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  user: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M2.5 14.5c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  stopwatch: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="9.2" r="5.6" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M6 1.5h4M8 1.5v2M8 9.2V6.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
  progress: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M8 1.6A6.4 6.4 0 0 1 14.4 8H8z" fill="currentColor" /></svg>,
  x: <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  check: <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  bullseye: <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.1" /><circle cx="7.5" cy="8.5" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.1" /><path d="M7.5 8.5l6-6M11 2.5h2.5V5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>,
  sparkles: <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 2.5l1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3L2 7l3.3-1.2zM12.5 9.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></svg>,
  ban: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M3.6 3.6l8.8 8.8" stroke="currentColor" strokeWidth="1.5" /></svg>,
  caution: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#fff" /><path d="M8 4.4v4.4M8 11.2v.2" stroke="var(--sb-spam)" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  rejected: <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#fff" /><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke="var(--sb-reject)" strokeWidth="1.5" strokeLinecap="round" /></svg>,
};

/** The page shell every screen shares: the product's breadcrumb bar over the page content. */
export function Page({ crumbs, children, style }: { crumbs: string[]; children: ReactNode; style?: CSSProperties }) {
  return <div className="sb-page">
    <nav className="sb-crumbs" aria-hidden="true">{crumbs.map((c, i) => <span key={c} style={{ display: 'contents' }}>{i > 0 && Icon.chevron()}{i < crumbs.length - 1 ? <a>{c}</a> : <b>{c}</b>}</span>)}</nav>
    <div style={style}>{children}</div>
  </div>;
}

export type Status = 'auto' | 'accepted' | 'review' | 'rejected';
/** The recommendation status pill (AdeRecommendationStatusPill). */
export function StatusPill({ status }: { status: Status }) {
  if (status === 'review') return <span className="sb-pill is-fill is-caution">{Icon.caution}Needs Review</span>;
  if (status === 'rejected') return <span className="sb-pill is-fill is-rejected">{Icon.rejected}Rejected</span>;
  return <span className="sb-pill is-fill is-success"><CheckCircle size={14} color="#fff" check="var(--sb-success)" />{status === 'auto' ? 'Auto-Accepted' : 'Accepted'}</span>;
}

export function Switch({ on }: { on: boolean }) {
  return <span className={`sb-switch ${on ? 'is-on' : ''}`}><i>{on ? Icon.check : Icon.x}</i></span>;
}

// Liberty taken: the prototype's sample job ran 17 minutes. A real run is longer, so the job here takes 48 minutes, inside the 40 to 60
// minutes Patrick gave as typical, and still under the real two-hour Time to Coverage average.
export const job = { subject: 'Action required: payroll profile verification', id: '019f3d5a-ff42-7706-b615-a83297b00479', took: '48m', done: 'Jul 3, 2026, 3:00 PM' };

/** ADÉ's recommendation (JobCompletedCard): rule fields beside the MQL, with Accept and Reject while it waits for review.
 *  Liberty taken: the header reads "ADÉ Recommended Rule" and carries the hunt's result in place of the source's "Create a new rule…"
 *  line, so the reason to accept or reject sits beside the buttons. */
export function Recommendation({ actions = false, pressed = false, style, codeLines, compact = false }: { actions?: boolean; pressed?: boolean; style?: CSSProperties; codeLines?: number; compact?: boolean }) {
  const narrow = useNarrowLayout();
  return <div className="sb-cells" style={style}>
    <div data-frame="rec-head" style={{ display: 'flex', flexDirection: narrow ? 'column' : 'row', justifyContent: 'space-between', alignItems: narrow ? 'flex-start' : 'flex-end', gap: narrow ? 14 : 24, padding: narrow ? 16 : 24, background: 'var(--sb-cell-head)' }}>
      <div>
        <p className="sb-body" style={{ fontWeight: 600 }}>ADÉ Recommended Rule</p>
        <p className="sb-body" style={{ marginTop: 4 }} data-target="proof"><b style={{ fontWeight: 600 }}>93% match</b> in a 14-day hunt, with 40 malicious matches and 2 possible false positives.</p>
      </div>
      {(actions || !narrow) && <div className={`sb-fade ${actions ? '' : 'is-out'}`} style={{ display: 'flex', gap: 8 }}><span className={`sb-btn ${pressed ? 'is-pressed' : ''}`} data-target="accept">Accept</span><span className="sb-btn is-secondary">Reject</span></div>}
    </div>
    {!compact && <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : '280px minmax(0, 1fr)', gap: narrow ? 20 : 40, padding: narrow ? 16 : 24 }}>
      <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
        <div className="sb-field"><span>Rule Name</span><span className="sb-body">{ruleName}</span></div>
        <div className="sb-field"><span>Severity</span><span className="sb-severity" style={{ width: 'fit-content' }}>High Severity</span></div>
        {!narrow && <>
          <div className="sb-field"><span>Description</span><span className="sb-body">{ruleDescription}</span></div>
          <div className="sb-field"><span>Labels</span><span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{['Credential Phishing', 'QR code', 'Social engineering'].map(l => <span key={l} className="sb-chip">{l}</span>)}</span></div>
          <div className="sb-field"><span>Action</span><span className="sb-verdict">{Icon.ban}Quarantine</span></div>
        </>}
      </div>
      <div style={{ display: 'grid', gap: 10, alignContent: 'start', minWidth: 0 }} data-frame="mql">
        <span className="sb-label">Rule MQL</span>
        <RuleCode lines={codeLines} style={{ minHeight: narrow ? 0 : 300 }} />
      </div>
    </div>}
  </div>;
}

/** ASA's verdict, quieter than the product's full-bleed red banner: a tinted head with the verdict in its color. Liberty taken: the label
 *  reads "ASA Verdict" without the source's info icon, and the summary below it is labeled "Executive Summary". */
export function VerdictPanel({ children }: { children?: ReactNode }) {
  return <div className="sb-box" style={{ overflow: 'hidden' }}>
    <div className="sb-verdict-head">
      <svg width="30" height="33" viewBox="0 0 16 17.6" aria-hidden="true"><path d="M8 .8l6.6 3.8v8.4L8 16.8 1.4 13V4.6z" fill="var(--sb-malicious)" /><path d="M8 5.4v4.6M8 12.4v.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>
      <div><span className="sb-label">ASA Verdict</span><p className="sb-verdict-name">Malicious</p></div>
    </div>
    {children}
  </div>;
}

// The job timeline's marks (AdeJobTimeline): each entry's 24px circle carries the icon of what happened. The hunt, clipboard, play and shield
// paths are the product's own (@product/icons BowArrow Regular, ClipboardList Light, Play Regular, Shield Solid).
const tlIcon = {
  check: <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 6.2l2 2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  shield: <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true"><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z" fill="currentColor" /></svg>,
  hunt: <svg width="12" height="12" viewBox="0 0 512 512" aria-hidden="true"><path d="M511.7 18.9c1-5.2-.7-10.5-4.4-14.3S498.2-.7 493.1 .3l-128 24c-5.8 1.1-10.6 5.3-12.3 11s-.2 11.8 4 16l35 35L144.6 333.4 93.8 320.7c-8.2-2-16.8 .4-22.8 6.3L7 391c-6.1 6.1-8.5 15-6.2 23.4s8.9 14.8 17.3 16.9l50 12.5 12.5 50c2.1 8.4 8.5 15 16.9 17.3s17.3 0 23.4-6.2l64-64c6-6 8.4-14.6 6.3-22.8l-12.7-50.8L425.7 120.3l35 35c4.2 4.2 10.4 5.7 16 4s9.9-6.5 11-12.3l24-128zM132.2 379.8l9.2 36.8L117 441.1l-5.7-22.9c-2.1-8.6-8.9-15.3-17.5-17.5L70.9 395l24.4-24.4 36.8 9.2zm-79.5-265L49 111c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9L151.4 281.4l33.9-33.9-98-98c61.2-37.6 138.2-39.2 200.8-4.9l35.1-35.1c-82.8-51.7-189.4-50-270.6 5.2zm314.7 109c34.3 62.6 32.7 139.6-4.9 200.8l-98-98-33.9 33.9L367 497c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-3.7-3.7c55.2-81.2 57-187.8 5.2-270.6l-35.1 35.1z" fill="currentColor" /></svg>,
  clipboard: <svg width="12" height="12" viewBox="0 0 384 512" aria-hidden="true"><path d="M145.5 68c5.3-20.7 24.1-36 46.5-36s41.2 15.3 46.5 36c1.8 7.1 8.2 12 15.5 12h18c8.8 0 16 7.2 16 16v32H192 96V96c0-8.8 7.2-16 16-16h18c7.3 0 13.7-4.9 15.5-12zM192 0c-32.8 0-61 19.8-73.3 48H112C91.1 48 73.3 61.4 66.7 80H64C28.7 80 0 108.7 0 144V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V144c0-35.3-28.7-64-64-64h-2.7c-6.6-18.6-24.4-32-45.3-32h-6.7C253 19.8 224.8 0 192 0zM320 112c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32v16c0 17.7 14.3 32 32 32h96 96c17.7 0 32-14.3 32-32V112zM208 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM136 272a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm40-16c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176zm0 96c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176zm-64 40a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" fill="currentColor" /></svg>,
  play: <svg width="12" height="12" viewBox="0 0 384 512" aria-hidden="true"><path d="M48 432L336 256 48 80l0 352zM24.5 38.1C39.7 29.6 58.2 30 73 39L361 215c14.3 8.7 23 24.2 23 41s-8.7 32.2-23 41L73 473c-14.8 9.1-33.4 9.4-48.5 .9S0 449.4 0 432V80C0 62.6 9.4 46.6 24.5 38.1z" fill="currentColor" /></svg>,
  spinner: <svg className="sb-spin" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.2A4.8 4.8 0 0 1 10.8 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
};
export type TlIcon = keyof typeof tlIcon;

/** One entry on the ADÉ job timeline (TimelineItem): a 24px mark, then the rail running unbroken to the next entry's mark.
 *  `tone` fills the mark (success for an outcome, active for what waits on you). With `open`, the entry opens to its height when it arrives. */
export function TimelineItem({ icon, tone, children, style, open }: { icon: TlIcon; tone?: 'success' | 'active' | 'running'; children: ReactNode; style?: CSSProperties; open?: boolean }) {
  const inner = <>
    <span className="sb-tl-rail" aria-hidden="true"><span className={`sb-tl-dot ${tone ? `is-${tone}` : ''}`}>{tlIcon[icon]}</span><i /></span>
    <div className="sb-tl-body">{children}</div>
  </>;
  if (open !== undefined) return <Expand open={open} className="sb-tl-item" style={style}>{inner}</Expand>;
  return <div className="sb-tl-item" style={style}>{inner}</div>;
}

/** An entry's heading, set on the mark's center line (Text h4). */
export function TimelineTitle({ children }: { children: ReactNode }) {
  return <p className="sb-tl-title"><span>{children}</span></p>;
}

/** Page heading for an ADÉ job (AdeJobDetailView), with room around it. */
export function JobHeading({ status = 'done' }: { status?: 'done' | 'running' }) {
  const narrow = useNarrowLayout();
  return <div style={{ display: 'grid', gap: 10, paddingLeft: narrow ? 0 : 48 }}>
    <p style={{ display: 'flex', alignItems: narrow ? 'flex-start' : 'center', gap: 10, fontSize: narrow ? 20 : 24, fontWeight: 600, lineHeight: narrow ? '27px' : '32px', letterSpacing: '-.2px' }}>{job.subject}<span style={{ color: 'var(--sb-link)', display: 'inline-flex', marginTop: narrow ? 6 : 0 }}>{Icon.external}</span></p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {status === 'done'
        ? <span className="sb-verdict sb-body"><CheckCircle size={14} color="var(--sb-button)" />Completed in {job.took}</span>
        : <span className="sb-verdict sb-body">{Icon.progress}In Progress</span>}
      {!narrow && <span className="sb-label">Job ID: {job.id}</span>}
    </div>
  </div>;
}

/** The accepted outcome at the top of the timeline (AcceptedTimelineItem). */
export function Accepted({ by, auto = false }: { by: string; auto?: boolean }) {
  const narrow = useNarrowLayout();
  return <div className="sb-accepted">
    <div className="sb-accepted-head" style={narrow ? { padding: '10px 16px' } : undefined}><span><b style={{ fontWeight: 700 }}>{by}</b> {auto ? 'auto-' : ''}accepted and activated the recommended rule</span>{!narrow && <span style={{ fontSize: 12 }}>{job.done}</span>}</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: narrow ? 14 : 40, padding: narrow ? '14px 16px 16px' : '16px 20px 18px' }}>
      <div className="sb-field" style={{ minWidth: 0, maxWidth: '100%' }}><span>Rule Detail</span><span className="sb-ext" style={{ maxWidth: narrow ? '100%' : 380 }}><span>{ruleName}</span>{Icon.external}</span></div>
      <div className="sb-field"><span>Flagged Message</span><span className="sb-ext" style={{ width: 'fit-content' }}>View Flagged Messages{Icon.external}</span></div>
    </div>
  </div>;
}

/** "ADÉ worked for 48m" (ChainOfThoughtTimelineItem), collapsed; `brief` shows its title line alone. */
export function Worked({ brief = false }: { brief?: boolean }) {
  return <div style={{ display: 'grid', gap: 16 }}>
    <TimelineTitle>ADÉ worked for {job.took}</TimelineTitle>
    {!brief && <div className="sb-box sb-body" style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
      <span style={{ display: 'grid', gap: 8 }}><span className="sb-verdict">{Icon.sparkles}Collaborated with ASA Agent to generate a threat report</span><span className="sb-verdict">{Icon.bullseye}Validated recommendation with 1 hunt</span></span>
      <span className="sb-disclose">{Icon.chevron('down')}</span>
    </div>}
  </div>;
}

/** "Patrick Morgan triggered ADÉ" (TriggeredTimelineItem): the message the job started from. `brief` folds it to its title line. */
export function Triggered({ when = 'Jul 3, 2026, 2:12 PM', brief = false }: { when?: string; brief?: boolean }) {
  return <div style={{ display: 'grid' }}>
    <TimelineTitle>Patrick Morgan triggered ADÉ at {when}</TimelineTitle>
    <Expand open={!brief}><div style={{ paddingTop: 16 }}><div className="sb-box sb-body" style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', rowGap: 12, columnGap: 16, padding: 16 }}>
      <span className="sb-label">Subject</span><span>{job.subject}</span>
      <span className="sb-label">Sender</span><span style={{ overflowWrap: 'anywhere' }}>payroll-verify@employee-benefits.co</span>
      <span className="sb-label">Recipient</span><span>alex.morgan@acme.com</span>
      <span className="sb-label">ASA Verdict</span><VerdictLabel verdict="malicious" />
    </div></div></Expand>
  </div>;
}

const huntRows = [
  { subject: 'Action required: payroll profile verification', sender: 'payroll-security@adp-verify.com', received: 'Jul 2', verdict: 'malicious' as const },
  { subject: 'New direct deposit document shared with you', sender: 'hr-notify@payroll-docs.co', received: 'Jul 1', verdict: 'malicious' as const },
  { subject: 'Reminder: update your payroll information', sender: 'benefits@company-payroll-support.net', received: 'Jun 29', verdict: 'benign' as const },
];

/** The hunt entry (HuntTimelineItem): the hunt's summary, which opens onto its results (HuntResultsTable). Counts are the source's sample
 *  data; with `run` false they wait at zero, and `run` counts them up. `meets` adds the auto-accept line, and `brief` folds it to its title line. */
export function HuntEntry({ run = true, reduced = false, meets = false, open = false, brief = false }: { run?: boolean; reduced?: boolean; meets?: boolean; open?: boolean; brief?: boolean }) {
  const n = (to: number) => <CountUp to={to} run={run} reduced={reduced} />;
  const narrow = useNarrowLayout();
  const cols = narrow ? 'minmax(0, 1fr) 104px' : 'minmax(0, 1fr) 210px 64px 110px';
  return <div style={{ display: 'grid' }} data-frame="hunt">
    <TimelineTitle>ADÉ hunted across 14 days and found {n(43)}&nbsp;message groups ({n(58)}&nbsp;total messages)</TimelineTitle>
    <Expand open={!brief}><div style={{ paddingTop: 16 }}><div className="sb-hunt-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: 16 }}>
        <div className="sb-body" style={{ display: 'grid', gap: 12 }}>
          <span className="sb-verdict">{Icon.bullseye}<span>Recommended Rule is a <b style={{ fontWeight: 600 }}><CountUp to={93} run={run} reduced={reduced} format={v => `${Math.round(v)}%`} /></b> match with {n(40)} malicious matches and may introduce {n(2)} false positives (Benign).</span></span>
          <Expand open={meets}><span className="sb-meets">{Icon.sparkles}It meets the threshold to auto-accept the Rule.</span></Expand>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}><span className="sb-verdict"><VerdictIcon verdict="malicious" />{n(40)} Malicious</span><span className="sb-verdict"><VerdictIcon verdict="spam" />{n(1)} Spam</span><span className="sb-verdict"><VerdictIcon verdict="benign" />{n(2)} Benign</span></div>
        </div>
        <span className={`sb-disclose ${open ? 'is-open' : ''}`} data-target="hunt-toggle">{Icon.chevron('down')}</span>
      </div>
      <Expand open={open}>
        <div className="sb-hunt-table">
          <div className="sb-row is-head" style={{ gridTemplateColumns: cols }}><span>Subject</span>{!narrow && <><span>Sender</span><span>Received</span></>}<span>ASA Verdict</span></div>
          {huntRows.map(r => <div key={r.subject} className="sb-row" style={{ gridTemplateColumns: cols }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subject}</span>{!narrow && <><span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sender}</span><span>{r.received}</span></>}<VerdictLabel verdict={r.verdict} /></div>)}
          <div className="sb-label" style={{ padding: '10px 16px', borderTop: '1px solid var(--sb-border)' }}>Showing 3 of 43 message groups</div>
        </div>
      </Expand>
    </div></div></Expand>
  </div>;
}
