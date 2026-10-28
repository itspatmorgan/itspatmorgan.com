import type { CSSProperties } from 'react';
import { NativeStage } from '../case-study/NativeStage';
import { useRevealOnce } from '../case-study/useRevealOnce';
import { ART, Zoom } from './SublimeUI';

// The Agents hub (patrick/mttc agents-hub.jsx): "Your Agentic Teammates" with the two fluid agent cards, 380 × 529 in Figma R3.
// Laid out at 900 source pixels across the 1020 card. Art offsets are the source's, measured from the right edge of a 378px card,
// moved left by each card's `nudge` as in the fluid hub. Stats are the hub's "both agents with data" state (mttc hub-states/both-data).
const CARD_W = 414;
const agents = [
  { name: 'ASA', caption: 'Autonomous Security Analyst', role: 'Security Analyst', description: 'Triages messages with detailed verdict and analysis.', stats: [['375', 'Hrs Saved'], ['450', 'Investigations']], art: { src: ART.asa, left: 124, top: 41.5, width: 268.5, nudge: 20 } },
  { name: 'ADÉ', caption: 'Autonomous Detection Engineer', role: 'Detection Engineer', description: 'Creates detections tailored to your environment.', stats: [['50 mins', 'Time to Coverage'], ['1.1k', 'Hrs Saved'], ['55k', 'Attacks Blocked']], art: { src: ART.ade, left: 140, top: 70, width: 235, nudge: 46 } },
];

/** The two agents as customers meet them. */
export default function HeroAgents() {
  const reveal = useRevealOnce<HTMLElement>();
  return <figure className="qb-demo sb-hero" ref={reveal.ref} aria-label="The Agents page: ASA, the Autonomous Security Analyst, triages messages; ADÉ, the Autonomous Detection Engineer, creates detections tailored to your environment">
    <NativeStage width={1240} height={900}>
      <div className="sb-card">
        <Zoom width={900}>
          <div style={{ padding: '28px 24px 0' }}>
            <p className="sb-h">Your Agentic Teammates</p>
            <p className="sb-body" style={{ fontWeight: 500 }}>AI teammates that work alongside you to protect your organization.</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, ${CARD_W}px)`, gap: 24, marginTop: 32 }}>
              {agents.map((agent, i) => <div key={agent.name} className={`sb-agent sb-fade ${reveal.shown ? '' : 'is-out'}`} style={{ transitionDelay: `${150 + i * 180}ms` }}>
                <img src={agent.art.src} alt="" draggable={false} className="sb-fade sb-art" style={{ left: agent.art.left + CARD_W - 2 - 378 - agent.art.nudge, top: agent.art.top, width: agent.art.width, transform: reveal.shown ? 'none' : 'translateY(14px) scale(.96)', opacity: reveal.shown ? 1 : 0, transitionDelay: `${350 + i * 180}ms`, transitionDuration: '900ms' } as CSSProperties} />
                <div style={{ position: 'absolute', left: 29, top: 25 }}>
                  <p className="sb-agent-name">{agent.name}</p>
                  <p className="sb-agent-caption">{agent.caption}</p>
                </div>
                <div style={{ position: 'absolute', left: 29, right: 29, bottom: 29 }}>
                  <p className="sb-h">{agent.role}</p>
                  <p className="sb-body" style={{ marginTop: 4, fontWeight: 500 }}>{agent.description}</p>
                  <div style={{ display: 'flex', gap: 44, marginTop: 28 }}>{agent.stats.map(([value, label]) => <div key={label}><p style={{ fontSize: 20, fontWeight: 500, lineHeight: '26px' }}>{value}</p><p className="sb-label" style={{ marginTop: 2, fontSize: 11 }}>{label}</p></div>)}</div>
                </div>
              </div>)}
            </div>
          </div>
        </Zoom>
      </div>
    </NativeStage>
  </figure>;
}
