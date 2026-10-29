import { ART } from './SublimeUI';
import { useNarrowLayout } from '../case-study/scene';

// The Agents hub (patrick/mttc agents-hub.jsx, AgentCard): "Your Agentic Teammates" with the two fluid agent cards, 529px tall, splitting
// the row evenly as in the MTTC hub. Art offsets are the source's, measured from a card's right edge and moved left by each card's `nudge`.
// Hover is the source's: the card fills with a faint mint and lifts on a teal shadow, the glow behind the art comes up, and the art eases
// up and grows. Stats are the hub's "both agents with data" state (mttc hub-states/both-data).
const agents = [
  { id: 'asa', name: 'ASA', caption: 'Autonomous Security Analyst', role: 'Security Analyst', description: 'Triages messages with detailed verdict and analysis.', stats: [['375', 'Hrs Saved'], ['450', 'Investigations']], art: { src: ART.asa, left: 124, top: 41.5, width: 268.5, nudge: 20 } },
  { id: 'ade', name: 'ADÉ', caption: 'Autonomous Detection Engineer', role: 'Detection Engineer', description: 'Creates detections tailored to your environment.', stats: [['50 mins', 'Time to Coverage'], ['1.1k', 'Hrs Saved'], ['55k', 'Attacks Blocked']], art: { src: ART.ade, left: 140, top: 70, width: 235, nudge: 46 } },
];

/** The hub: heading and the two agent cards; `hover` names the card under the pointer. */
export function AgentsHub({ hover, pressed = false }: { hover?: string | null; pressed?: boolean }) {
  // Liberty taken: on a phone the two cards stack.
  const narrow = useNarrowLayout();
  return <div style={{ display: 'grid', gap: narrow ? 24 : 32, padding: narrow ? '20px 16px 32px' : '28px 28px 32px' }}>
    <div>
      <p className="sb-h">Your Agentic Teammates</p>
      <p className="sb-body" style={{ fontWeight: 500 }}>AI teammates that work alongside you to protect your organization.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: narrow ? 'minmax(0, 1fr)' : '1fr 1fr', gap: narrow ? 16 : 24 }}>
      {agents.map(agent => {
        const on = hover === agent.id;
        return <div key={agent.id} className={`sb-agent ${on ? 'is-hover' : ''} ${on && pressed ? 'is-pressed' : ''}`} data-target={`card-${agent.id}`} data-frame={`card-${agent.id}`}>
          <img src={agent.art.src} alt="" draggable={false} className="sb-art sb-agent-art" style={{ left: `calc(${agent.art.left}px + 100% - 378px - ${agent.art.nudge}px)`, top: agent.art.top, width: agent.art.width }} />
          <div style={{ position: 'absolute', left: 29, top: 25 }}>
            <p className="sb-agent-name">{agent.name}</p>
            <p className="sb-agent-caption">{agent.caption}</p>
          </div>
          <div style={{ position: 'absolute', left: 29, right: 29, bottom: 29, display: 'grid', gap: 26 }}>
            <div><p className="sb-h">{agent.role}</p><p className="sb-body" style={{ marginTop: 4, fontWeight: 500 }}>{agent.description}</p></div>
            <div style={{ display: 'flex', gap: narrow ? 28 : 54 }}>{agent.stats.map(([value, label]) => <div key={label}><p className="sb-agent-stat">{value}</p><p className="sb-agent-caption" style={{ marginTop: 0 }}>{label}</p></div>)}</div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}
