import type { ReactNode } from 'react';
import { NativeStage, zoomCrop } from '../case-study/NativeStage';
import { DemoFrame, usePhone, useScene } from '../case-study/scene';
import { T, Box, Select, IconButton } from './ExpansionUI';

// Frame 700's rule editor, filled in as a customer's workaround: a rule that exists only to tag likely bot traffic with a signal of their own.
// Positions are card-relative from the source; the card sits at (110, 80) on a 1240 × 900 frame.
const typed = [
  { key: 'agent', text: 'python-requests' },
  { key: 'path', text: '/products/*' },
  { key: 'signal', text: 'suspected-bot' },
  { key: 'limit', text: '100' },
] as const;
type Frame = { chars: number[]; focus: number; ms: number };
const frames: Frame[] = [{ chars: typed.map(() => 0), focus: -1, ms: 900 }];
typed.forEach((field, f) => {
  const before = typed.map((t, i) => (i < f ? t.text.length : 0));
  for (let c = 1; c <= field.text.length; c++) frames.push({ chars: before.map((n, i) => (i === f ? c : n)), focus: f, ms: c === field.text.length ? 650 : 70 });
});
frames.push({ chars: typed.map(t => t.text.length), focus: -1, ms: 3600 });
const durations = frames.map(f => f.ms);
const fieldCaptions = ['The rule matches a scripted user agent', 'It looks only at product pages', 'It tags those requests with a custom signal', 'It blocks IPs over 100 signals a minute'];
const captions = frames.map((f, i) => (f.focus >= 0 ? fieldCaptions[f.focus] : i === 0 ? fieldCaptions[0] : 'A rule built only to tag and block likely bots'));

const label = (x: number, y: number, text: string) => <T x={x} y={y} size={11.97} lh={21} ls={-.13}>{text}</T>;
const strong = (x: number, y: number, text: ReactNode, className = '') => <T x={x} y={y} size={11.97} lh={21} ls={-.13} weight={600} className={className}>{text}</T>;
const heading = (y: number, text: string) => <T x={27.38} y={y} size={20.53} lh={27} weight={800} ls={-.27}>{text}</T>;
const help = (y: number, text: string) => <T x={27.38} y={y} size={13.69} lh={24} ls={-.2} color="var(--x-dark-ink)">{text}</T>;
const block = (y: number, h: number) => <i style={{ left: 27.38, top: y, width: 965.23, height: h, background: 'var(--x-block)' }} />;
const bar = (x: number, y: number, h: number) => <i className="xp-hair" style={{ left: x, top: y, width: 3.42, height: h }} />;

/** The workaround: a hand-built rule whose job is to tag bot traffic. */
export default function RuleEditor() {
  const scene = useScene(durations, captions, { loop: false });
  const { chars, focus } = frames[scene.step];
  // On a phone, the typing zooms in a little: on the condition values, then on the signal and rate limit. The rest shows the whole rule.
  const phone = usePhone();
  const near = focus === 0 || focus === 1 ? [800, 300] as const : focus >= 2 ? [400, 640] as const : null;
  const value = (i: number) => <>{typed[i].text.slice(0, chars[i])}{focus === i && <i className="xp-caret" />}</>;
  return <DemoFrame scene={scene} stage="xp-frame" title="the custom rule" label="A custom rule: requests from a python-requests user agent to /products/* are tagged with a suspected-bot signal, and IPs over 100 signals a minute are blocked"><div className="cs-demo xp-rule-editor">
    <NativeStage width={1240} height={900} crop={phone ? zoomCrop(1240, 900, near) : undefined}>
      <div className="xp-card">
        {heading(27.38, 'Conditions')}
        {block(68.46, 294.36)}
        <Select x={47.92} y={88.99} w={136.91}>All of</Select>
        {label(198.52, 99.26, 'the following are true')}
        {bar(47.92, 150.6, 65.03)}
        {label(65.03, 150.6, 'Field')}{label(347.42, 150.6, 'Operator')}{label(629.8, 150.6, 'Value')}
        <Select x={65.03} y={174.56} w={268.69}>User agent</Select>
        <Select x={347.42} y={174.56} w={268.69}>Contains</Select>
        <Box x={629.8} y={174.56} w={268.69} className="xp-field xp-mono">{value(0)}</Box>
        <IconButton x={913.89} y={174.56} />
        {bar(47.92, 236.17, 65.03)}
        {label(65.03, 236.17, 'Field')}{label(347.42, 236.17, 'Operator')}{label(629.8, 236.17, 'Value')}
        <Select x={65.03} y={260.13} w={268.69}>Path</Select>
        <Select x={347.42} y={260.13} w={268.69}>Like</Select>
        <Box x={629.8} y={260.13} w={268.69} className="xp-field xp-mono">{value(1)}</Box>
        <IconButton x={913.89} y={260.13} />
        {strong(47.92, 321.75, 'Add condition', 'xp-link')}

        {heading(383.36, 'Actions')}
        {help(417.58, 'When a request matches the conditions above.')}
        {block(455.23, 130.07)}
        {label(47.92, 475.77, 'Tag with signal')}
        <Box x={47.92} y={499.73} w={275.54} className="xp-field">{value(2)}</Box>
        {strong(47.92, 544.23, 'Add signal', 'xp-link')}{strong(241.31, 544.23, 'Preview signal', 'xp-link')}

        {help(605.84, 'When the signal above exceeds a rate limit.')}
        {block(650.38, 421.86)}
        {bar(47.92, 670.91, 346.56)}
        <Box x={65.03} y={670.91} w={136.91} className="xp-field">{value(3)}</Box>
        {label(215.64, 681.18, 'signals in 1 minute')}
        {bar(65.03, 725.68, 119.8)}
        {strong(85.57, 725.68, 'Action')}
        <i className="xp-radio" style={{ left: 85.57, top: 756.48 }} />
        {strong(112.95, 753.06, 'Log')}
        {label(112.95, 777.02, 'Monitor IPs that exceed the rate limit and log a sample of their subsequent requests with the signal below')}
        <i className="xp-radio is-on" style={{ left: 85.57, top: 804.4 }} />
        {strong(112.95, 800.98, 'Block')}
      </div>
    </NativeStage>
  </div></DemoFrame>;
}
