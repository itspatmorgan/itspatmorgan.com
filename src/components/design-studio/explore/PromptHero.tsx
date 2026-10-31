import { useEffect, useState } from 'react';
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { icon } from '../../studio-case/StudioUI';
import { agentHarnesses, installationPrompt } from '../../../data/design-studio-setup';
import { StudioWindow, useAutoplay, useCopy, useReduced, type Key } from './StudioWindow';

// Exploration 2, after v0 and Cursor: the hero is the agent's prompt box. The first prompt installs Design Studio; the others are
// what you'd ask next, and the Studio below opens what each one makes. Prompts cycle until the visitor picks one.

const prompts: { label: string; key: Key; text: string }[] = [
  { label: 'Set up Design Studio', key: 'inbox', text: installationPrompt },
  { label: 'Prototype an inbox', key: 'inbox', text: 'Prototype a feedback inbox for Echo with our Product design system: a table of feedback with status and priority, filters, and a panel to add new items.' },
  { label: 'Sketch it in lo-fi', key: 'lofi', text: 'Make a lo-fi version of the inbox so we can settle the layout before we style it.' },
  { label: 'Map the flow', key: 'flow', text: 'Map how feedback moves from recorded to resolved, as a Mermaid diagram.' },
  { label: 'Hand off to engineering', key: 'handoff', text: 'Build a handoff canvas that shows engineering every screen and state of the inbox.' },
  { label: 'Write the brief', key: 'context', text: 'Write the project context: the problem, who it’s for, our working assumptions and open questions.' },
];

/** Types `text` out once per change, fast enough to read along. */
function useTyped(text: string, skip: boolean) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (skip) { setN(text.length); return; }
    setN(0);
    const per = Math.max(8, Math.min(22, 1400 / text.length));
    const timer = window.setInterval(() => setN(v => { if (v >= text.length) { window.clearInterval(timer); return v; } return v + 2; }), per);
    return () => window.clearInterval(timer);
  }, [text, skip]);
  return text.slice(0, n);
}

export default function PromptHero() {
  const play = useAutoplay(prompts.length, 5200);
  const reduced = useReduced();
  const [first, setFirst] = useState(true);
  useEffect(() => { if (play.index !== 0) setFirst(false); }, [play.index]);
  const p = prompts[play.index];
  const typed = useTyped(p.text, reduced || first);
  const { done, copy } = useCopy();
  return <div className="dx-prompt" ref={play.ref}>
    <div className="dx-composer">
      <div className="dx-composer-top">
        <span className="dx-composer-into">Paste into</span>
        {agentHarnesses.map(h => <span key={h.title} className="dx-agent"><span className="dx-logo" style={{ ['--logo' as string]: `url(${h.logo})` }} aria-hidden="true" />{h.title}</span>)}
      </div>
      <p className="dx-composer-text" aria-live="polite">{typed}<span className="dx-caret" aria-hidden="true" /></p>
      <div className="dx-composer-foot">
        <span className="dx-mono dx-composer-hint">{play.index === 0 ? 'Start here' : 'Then ask for anything'}</span>
        <button type="button" className="dx-send" onClick={() => copy(p.text)}>{icon(done ? Tick02Icon : Copy01Icon, 16)}{done ? 'Copied' : play.index === 0 ? 'Copy setup prompt' : 'Copy prompt'}</button>
      </div>
    </div>
    <div className="dx-chips" role="tablist" aria-label="Example prompts">
      {prompts.map((q, i) => <button key={q.label} type="button" role="tab" aria-selected={i === play.index} className={`${i === play.index ? 'is-on' : ''} ${i === 0 ? 'is-first' : ''}`} onClick={() => play.pick(i)}>
        {q.label}{i === play.index && play.playing && <i className="dx-chip-timer" key={play.index} />}
      </button>)}
    </div>
    <StudioWindow shown={p.key} onPick={k => { const i = prompts.findIndex((q, j) => j > 0 && q.key === k); if (i > 0) play.pick(i); }} crop="pane" className="dx-prompt-window" height={620} />
  </div>;
}
