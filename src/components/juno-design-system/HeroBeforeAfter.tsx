import { SceneFrame, useScene, useStage } from '../case-study/scene';
import { DashAfter, DashBefore } from './JunoScreens';

const timings = [1800, 1200, 4000];
const captions = ['Before Juno', 'After Juno', 'After Juno'];

/** The hero: the same dashboard, before and after Juno. The new screen wipes across the old one, and the end state is the point. */
export default function HeroBeforeAfter() {
  const scene = useScene(timings, captions, { loop: false });
  const stage = useStage({ wide: 1400 });
  const step = scene.reduced ? 2 : scene.step;
  return <SceneFrame scene={scene} stage={stage} title="the dashboard before and after Juno" label="A JupiterOne dashboard before Juno, replaced by the same area of the product after Juno">
    <div className={`jw ${step > 0 ? 'is-after' : ''} ${step === 1 ? 'is-wiping' : ''}`}>
      <DashBefore />
      <div className="jw-after"><DashAfter /></div>
      <i className="jw-line" />
    </div>
  </SceneFrame>;
}
