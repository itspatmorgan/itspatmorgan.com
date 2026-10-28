import { NativeStage } from '../case-study/NativeStage';
import { ART, Zoom } from './SublimeUI';
import { Pointer, SceneControls, useScene, useTargets } from './scene';

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
  return <div style={{ display: 'grid', gap: 32, padding: '28px 28px 32px' }}>
    <div>
      <p className="sb-h">Your Agentic Teammates</p>
      <p className="sb-body" style={{ fontWeight: 500 }}>AI teammates that work alongside you to protect your organization.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {agents.map(agent => {
        const on = hover === agent.id;
        return <div key={agent.id} className={`sb-agent ${on ? 'is-hover' : ''} ${on && pressed ? 'is-pressed' : ''}`} data-target={`card-${agent.id}`}>
          <img src={agent.art.src} alt="" draggable={false} className="sb-art sb-agent-art" style={{ left: `calc(${agent.art.left}px + 100% - 378px - ${agent.art.nudge}px)`, top: agent.art.top, width: agent.art.width }} />
          <div style={{ position: 'absolute', left: 29, top: 25 }}>
            <p className="sb-agent-name">{agent.name}</p>
            <p className="sb-agent-caption">{agent.caption}</p>
          </div>
          <div style={{ position: 'absolute', left: 29, right: 29, bottom: 29, display: 'grid', gap: 26 }}>
            <div><p className="sb-h">{agent.role}</p><p className="sb-body" style={{ marginTop: 4, fontWeight: 500 }}>{agent.description}</p></div>
            <div style={{ display: 'flex', gap: 54 }}>{agent.stats.map(([value, label]) => <div key={label}><p className="sb-agent-stat">{value}</p><p className="sb-agent-caption" style={{ marginTop: 0 }}>{label}</p></div>)}</div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

const timings = [1600, 1300, 2200, 3200];
const captions = ['ASA and ADÉ, the agents customers work with', 'Each card comes to life under the pointer', 'Each card comes to life under the pointer', 'ADÉ: under 2 hours from a missed threat to new coverage'];

/** The two agents as customers meet them. */
export default function HeroAgents() {
  const scene = useScene(timings);
  const step = scene.step;
  const t = useTargets(step);
  const hover = step === 1 ? 'asa' : step >= 2 ? 'ade' : null;
  return <figure className={`qb-demo sb-hero ${scene.fade ? 'qb-loop-reset' : ''}`} ref={scene.ref} aria-label="The Agents page: ASA, the Autonomous Security Analyst, triages messages, with 375 hours saved and 450 investigations; ADÉ, the Autonomous Detection Engineer, creates detections tailored to your environment, with 50 minutes Time to Coverage, 1.1k hours saved and 55k attacks blocked. Each card lights up under the pointer">
    <NativeStage width={1240} height={790}>
      <div className="sb-card">
        <Zoom key={scene.take} width={1060}>
          <div ref={t.ref} style={{ position: 'relative' }}>
            <AgentsHub hover={scene.reduced ? null : hover} />
            <Pointer at={hover ? t.at(`card-${hover}`) : null} visible={!!hover} reduced={scene.reduced} />
          </div>
        </Zoom>
      </div>
    </NativeStage>
    <SceneControls scene={scene} title="the Agents hub" caption={captions[step]} />
  </figure>;
}
