import { NativeStage } from '../case-study/NativeStage';
import { Zoom } from '../case-study/scene';
import { AssetsBefore, DashBefore, IntegrationsBefore, SettingsBefore } from './JunoScreens';

/** Four of the old modules on one stage: the point is how little they share, so nothing needs to move. */
export default function Disconnected() {
  return <figure className="cs-scene"><div className="cs-stage texture-bg cs-frame">
    <NativeStage width={1240} height={760}>
      <div className="jx-grid" role="img" aria-label="Four old JupiterOne screens: a dashboard, an asset inventory, integrations and a profile. Each has its own layout, cards and visual style.">
        {[DashBefore, AssetsBefore, IntegrationsBefore, SettingsBefore].map((S, i) => <div key={i}><Zoom width={1400} to={540}><S /></Zoom></div>)}
      </div>
    </NativeStage>
  </div></figure>;
}
