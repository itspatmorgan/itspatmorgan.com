import type { CSSProperties } from 'react';
import { NativeStage } from '../case-study/NativeStage';
import { DemoFrame, useScene } from '../case-study/scene';
import { BotSignalsCard } from './ExpansionUI';
import { botSignalBars } from './figma-bars';

// The hero-expansion frame: the Bot Signals card on a 2250 × 1500 frame, bleeding off the bottom.
// Source card: 1178 wide at (536, 136); its content is the 308-unit dashboard card filling it (3.824×).
// The frame is cropped to the 1240 × 900 frames' proportions (2067 wide), so ring and radius scale by 2067 / 1240 to match them on screen.
const timings = [500, 6000];
const captions = ['Requests with bot signals, by bot type', 'Requests with bot signals, by bot type'];

/** Bot signals drawing in on the hero card. */
export default function HeroBotSignals() {
  const scene = useScene(timings, captions, { loop: false });
  return <DemoFrame scene={scene} caption={false} stage="xp-frame" title="the Bot Signals chart" label="The Bot Signals card: requests with bot signals over time, by bot type"><div className="cs-demo xp-hero">
    <NativeStage width={2250} height={1500} crop={{ x: 91.67, y: 0, width: 2066.67, height: 1500 }}>
      <div className="xp-card" style={{ left: 536, top: 136, width: 1178, '--x-card-ring': '26.67px', '--x-card-radius': '40px' } as CSSProperties}>
        <BotSignalsCard bars={botSignalBars} grow={scene.step} count={23} span={[58.19, 287.52]} style={{ left: 0, top: 0, boxShadow: 'none', background: 'transparent', transform: 'scale(3.8241)', transformOrigin: 'top left' }} />
      </div>
    </NativeStage>
  </div></DemoFrame>;
}
