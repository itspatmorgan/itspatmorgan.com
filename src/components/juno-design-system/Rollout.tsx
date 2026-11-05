import { Screens, SceneFrame, useScene, useStage } from '../case-study/scene';
import { DesignBoard, FigmaProjects } from './JunoTools';

const timings = [2800, 1800, 3400];
const captions = ['Each refresh was its own Figma project', 'Refreshes shared a board with feature work', 'Refreshes shared a board with feature work'];

/** How the system landed, shown through the team's own Figma projects and design board rather than a diagram of modules. */
export default function Rollout() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1240 });
  const step = scene.reduced ? 2 : scene.step;
  return <SceneFrame scene={scene} stage={stage} title="the rollout" label="Figma projects marked app refresh, then the product design board, where the module refreshes sit among the feature work">
    <Screens id={step === 0 ? 'figma' : 'board'}><div className="jo">{step === 0 ? <FigmaProjects /> : <DesignBoard marked={step === 2} />}</div></Screens>
  </SceneFrame>;
}
