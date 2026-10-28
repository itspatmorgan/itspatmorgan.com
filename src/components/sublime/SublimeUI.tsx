import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';

// Primitives for the Sublime screens. Sizes are the source's Tailwind values in CSS pixels; `Zoom` scales a source-sized layout to fill the frame card.

export const ART = { asa: '/images/work/sublime/asa_cube.png', ade: '/images/work/sublime/ade_triangle.png' };

/** Lays out children at `width` source pixels and scales them to fill `to` frame pixels. */
export function Zoom({ width, to = 1020, children, style, zoomRef }: { width: number; to?: number; children: ReactNode; style?: CSSProperties; zoomRef?: RefObject<HTMLDivElement | null> }) {
  return <div className="sb-zoom" ref={zoomRef} style={{ width, transform: `scale(${to / width})`, ...style }}>{children}</div>;
}

/** Where the demo cursor should point: each `[data-target]` inside the zoomed screen, in its source pixels, re-measured on every step. */
export function useAim(step: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Record<string, { x: number; y: number }>>({});
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const scale = box.width / root.offsetWidth || 1;
    const next: Record<string, { x: number; y: number }> = {};
    root.querySelectorAll<HTMLElement>('[data-target]').forEach(el => {
      const r = el.getBoundingClientRect();
      next[el.dataset.target!] = { x: (r.left - box.left + Math.min(r.width * .55, 60)) / scale, y: (r.top - box.top + r.height * .55) / scale };
    });
    setPoints(next);
  }, [step]);
  const at = (key: string) => points[key] ?? { x: -40, y: -40 };
  return { ref, at };
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
  return <div className="sb-code" style={style}>{rule.map((line, i) => <span key={i} style={{ display: 'contents', visibility: i < lines ? 'visible' : 'hidden' }}>
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

export const job = { subject: 'Action required: payroll profile verification', id: '019f3d5a-ff42-7706-b615-a83297b00479' };

/** ADÉ's recommendation (JobCompletedCard): rule fields beside the MQL, with Accept and Reject while it waits for review. */
export function Recommendation({ actions = false, style }: { actions?: boolean; style?: CSSProperties }) {
  return <div className="sb-cells" style={style}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, padding: 24, background: 'var(--sb-cell-head)' }}>
      <div><p className="sb-body" style={{ fontWeight: 600 }}>ADÉ Recommendation</p><p className="sb-body" style={{ marginTop: 4 }}>Create a new rule and set it as active in your environment.</p></div>
      <div className={`sb-fade ${actions ? '' : 'is-out'}`} style={{ display: 'flex', gap: 8 }}><span className="sb-btn" data-target="accept">Accept</span><span className="sb-btn is-secondary">Reject</span></div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 40, padding: 24 }}>
      <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
        <div className="sb-field"><span>Rule Name</span><span className="sb-body">{ruleName}</span></div>
        <div className="sb-field"><span>Severity</span><span className="sb-severity" style={{ width: 'fit-content' }}>High Severity</span></div>
        <div className="sb-field"><span>Description</span><span className="sb-body">{ruleDescription}</span></div>
        <div className="sb-field"><span>Labels</span><span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{['Credential Phishing', 'QR code', 'Social engineering'].map(l => <span key={l} className="sb-chip">{l}</span>)}</span></div>
        <div className="sb-field"><span>Action</span><span className="sb-verdict">{Icon.ban}Quarantine</span></div>
      </div>
      <div style={{ display: 'grid', gap: 10, alignContent: 'start', minWidth: 0 }}>
        <span className="sb-label">Rule MQL</span>
        <RuleCode style={{ minHeight: 300 }} />
      </div>
    </div>
  </div>;
}

/** The hunt summary (HuntSummaryContent) with the source's sample counts. */
export function HuntSummary({ autoAccepted = false }: { autoAccepted?: boolean }) {
  return <div style={{ display: 'grid', gap: 12 }}>
    <p style={{ fontSize: 15, fontWeight: 600 }}>ADÉ hunted across 14 days and found 43 message groups (58 total messages)</p>
    <div className="sb-box" style={{ padding: '16px 20px', display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <span className="sb-verdict">{Icon.bullseye}Recommended Rule is a 93% match with 40 malicious matches and may introduce 2 false positives (Benign).</span>
        {autoAccepted && <span className="sb-verdict">{Icon.sparkles}It meets the threshold to auto-accept the Rule.</span>}
      </div>
      <div style={{ display: 'flex', gap: 20 }}><span className="sb-verdict"><VerdictIcon verdict="malicious" />40 Malicious</span><span className="sb-verdict"><VerdictIcon verdict="spam" />1 Spam</span><span className="sb-verdict"><VerdictIcon verdict="benign" />2 Benign</span></div>
    </div>
  </div>;
}
