import { Screens, SceneFrame, useScene, useStage } from '../case-study/scene';
import { Libraries, Storybook } from './JunoTools';

const timings = [3000, 3400];
const captions = ['A health status on each Figma library', 'A way to propose a change in Storybook'];

export default function Operations() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1240 });
  const step = scene.reduced ? 1 : scene.step;
  return <SceneFrame scene={scene} stage={stage} title="how teams used the system" label="Figma libraries with health statuses, then the Juno Storybook with its proposal process">
    <Screens id={String(step)}><div className="jo">{step === 0 ? <Libraries /> : <Storybook />}</div></Screens>
  </SceneFrame>;
}
