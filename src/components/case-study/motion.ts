// Motion values the scene player shares with CSS. The curves mirror --motion-ease-travel and --motion-ease-arrival in
// src/styles/global.css (a test keeps them in step); the rules behind them are in agents/context/motion.md.

/** Two curves by job: travel for a camera, pointer or panel moving to a new place; arrival for something appearing or settling. */
export const EASE = {
  travel: [.45, 0, .1, 1],
  arrival: [.25, .8, .25, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** How long a move takes, in seconds, for `distance` on-screen pixels: longer moves take longer, within limits. */
export function travelTime(distance: number, { min = .45, max = 1.1, per = 1800 } = {}) {
  return Math.min(max, min + distance / per);
}

/** At the loop seam, the scene fades out for this long, resets, then fades back in: well under a second in all. */
export const SEAM_FADE_MS = 240;

/** The frame that makes a scene's point should hold about this long before the loop restarts. */
export const PAYOFF_HOLD_MS = 2000;
