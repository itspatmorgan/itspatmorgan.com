import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene, Zoom } from '../case-study/scene';
import { AssetsAfter, DashAfter, IntegrationsAfter, SettingsAfter } from './JunoScreens';

const parts = ['is-nav', 'is-side', 'is-controls', 'is-cards'];
const timings = [2200, 2200, 2200, 3200];
const captions = ['One global navigation', 'One side navigation', 'One set of buttons and fields', 'One card'];

/** The problem slide's four areas after Juno, in the same grid. Each step marks one shared part wherever it appears on the four screens. */
export default function SharedParts() {
  const scene = useScene(timings, captions);
  const step = scene.reduced ? parts.length - 1 : scene.step;
  return <DemoFrame scene={scene} stage="cs-frame" title="the parts each module shared" label="Four JupiterOne screens after Juno. The global navigation, side navigation, buttons, fields and cards are marked on each one in turn.">
    <NativeStage width={1240} height={760}>
      <div className={`jx-grid jm ${parts[step]}`}>
        {[DashAfter, AssetsAfter, IntegrationsAfter, SettingsAfter].map((S, i) => <div key={i}><Zoom width={1400} to={540}><S /></Zoom></div>)}
      </div>
    </NativeStage>
  </DemoFrame>;
}
