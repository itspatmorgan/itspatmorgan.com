import { Screens, SceneFrame, useScene, useStage } from '../case-study/scene';
import { AssetsAfter, AssetsBefore, DashAfter, DashBefore, IntegrationsAfter, IntegrationsBefore, SettingsAfter, SettingsBefore } from './JunoScreens';

// Simplest screen first, so the comparison builds and rests on the densest one.
const pairs = [['Settings', SettingsBefore, SettingsAfter], ['Integrations', IntegrationsBefore, IntegrationsAfter], ['Dashboards', DashBefore, DashAfter], ['Assets', AssetsBefore, AssetsAfter]] as const;
const timings = pairs.flatMap(() => [2200, 3000]);
const captions = pairs.flatMap(([n]) => [n, n]);

export default function BeforeAfter() {
  const scene = useScene(timings, captions);
  const stage = useStage({ wide: 1400 });
  const step = scene.reduced ? timings.length - 1 : scene.step;
  const [, Before, After] = pairs[Math.floor(step / 2)];
  const isAfter = step % 2 === 1;
  const Screen = isAfter ? After : Before;
  const area = step - step % 2;
  const bar = <div className="jba" role="group" aria-label="Compare">
    <button type="button" className={isAfter ? '' : 'is-on'} aria-pressed={!isAfter} onClick={() => scene.choose(area)}>Before</button>
    <button type="button" className={isAfter ? 'is-on' : ''} aria-pressed={isAfter} onClick={() => scene.choose(area + 1)}>After</button>
  </div>;
  return <SceneFrame scene={scene} stage={stage} bar={bar} title="the before and after" label="Settings, integrations, dashboards and assets, each shown before and after Juno">
    <Screens id={String(step)}><Screen /></Screens>
  </SceneFrame>;
}
