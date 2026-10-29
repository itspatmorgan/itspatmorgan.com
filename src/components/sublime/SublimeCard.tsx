import { ProjectCardStage } from '../case-study/ProjectCardStage';
import { useDemoLoop } from '../case-study/useDemoLoop';
import { ART, Icon, StatusPill } from './SublimeUI';

// The project card: an AI teammate that finishes its own work, within the bar the team set. Behind, ADÉ's card from the Agents hub, whole,
// its art glowing; in front, inset from its sides and over its bottom edge, the rule it is writing. The rule starts In Progress; the art eases up and grows (the hub card's own hover); then
// the rule is auto-accepted at a 99% match, and the card rests there. While it works, the second line reads the prototype's "ADÉ is
// working". Names, art, statuses and the match are the prototypes' (patrick/mttc
// agents-hub, patrick/ade-workflow); the layout follows ProjectCardStage.
const timings = [800, 900, 2200];

/** ADÉ, and the rule it auto-accepted. */
export default function SublimeCard() {
  const loop = useDemoLoop(timings, timings.length - 1, false, true);
  const step = loop.reduced ? 2 : loop.step;
  return <ProjectCardStage loop={loop} className="sb sb-pc" label="ADÉ, the Autonomous Detection Engineer, with a detection rule it auto-accepted at a 99% match">
    <div className={`pc-bg sb-pc-agent ${step >= 1 ? 'is-up' : ''}`}>
      <img src={ART.ade} alt="" draggable={false} className="sb-art sb-pc-art" />
      <p className="sb-pc-name">ADÉ</p>
      <p className="sb-agent-caption">Autonomous Detection Engineer</p>
    </div>
    {/* Two columns: the rule's name and its match stacked on the left, its status centered against both on the right. */}
    <div className="pc-fg sb-pc-status">
      <p className="pc-title">Detection rule</p>
      {/* The second line is always filled, so the card keeps its shape: the prototype's "ADÉ is working", then the match. */}
      <p className="sb-pc-proof" key={step >= 2 ? 'done' : 'working'}>{step >= 2 ? <><b>99% match</b> · 14-day hunt</> : 'ADÉ is working'}</p>
      <span className="sb-pc-state">{step >= 2 ? <StatusPill status="auto" /> : <span className="sb-pill is-outline sb-pc-running"><span className="sb-spin">{Icon.progress}</span>In Progress</span>}</span>
    </div>
  </ProjectCardStage>;
}
