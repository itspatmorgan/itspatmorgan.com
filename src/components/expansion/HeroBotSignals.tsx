import type { CSSProperties } from 'react';
import { NativeStage } from '../query-builder/NativeUI';
import { useDemoLoop } from '../query-builder/useDemoLoop';
import { BotSignalsCard } from './ExpansionUI';
import { botSignalBars } from './figma-bars';

// The hero-expansion frame: the Bot Signals card on a 2250 × 1500 frame, bleeding off the bottom.
// Source card: 1178 wide at (536, 136); its content is the 308-unit dashboard card filling it (3.824×).
// The frame is cropped to the 1240 × 900 frames' proportions (2067 wide), so ring and radius scale by 2067 / 1240 to match them on screen.
const timings = [500, 6000];

/** Bot signals drawing in on the hero card. */
export default function HeroBotSignals() {
  const loop = useDemoLoop(timings, 0, true, true);
  return <figure className={`qb-demo xp-hero ${loop.resetting ? 'qb-loop-reset' : ''}`} ref={loop.ref} aria-label="The Bot Signals card: requests with bot signals over time, by bot type">
    <NativeStage width={2250} height={1500} crop={{ x: 91.67, y: 0, width: 2066.67, height: 1500 }}>
      <div className="xp-card" style={{ left: 536, top: 136, width: 1178, '--x-card-ring': '26.67px', '--x-card-radius': '40px' } as CSSProperties}>
        <BotSignalsCard bars={botSignalBars} grow={loop.step} count={23} span={[58.19, 287.52]} style={{ left: 0, top: 0, boxShadow: 'none', background: 'transparent', transform: 'scale(3.8241)', transformOrigin: 'top left' }} />
      </div>
    </NativeStage>
    <figcaption className="sr-only">{loop.step ? 'Requests with bot signals, by bot type' : 'Drawing the chart'}</figcaption>
  </figure>;
}
