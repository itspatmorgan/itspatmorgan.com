import type { Format } from '@/components/case-study/scene';

// The formats a visual can be drawn in besides the site's own responsive stage. Each is a stage at the format's pixel size, with the
// product card inset from the sides and top as the site's stage insets it (about 5% of the width), bleeding off the bottom edge unless
// the scene's screen ends (`contained`).
export type FormatId = 'slide' | 'social';

export const formats: Record<FormatId, Format & { label: string; note: string }> = {
  // A 1920 × 1080 slide whose screen is the point: the top 136 px are left for a one-line headline, and the card takes the rest at
  // the site's card proportions, so a 1000 px screen shows whole across and about 1.5× its true size.
  slide: { label: 'Slide', note: '1920 × 1080, room for a one-line headline', width: 1920, height: 1080, inset: 208, top: 136, ring: 21 },
  // A 4:5 post: the card fills the frame, so the screen runs taller and shows more of the page than the site's stage does.
  social: { label: 'Social post', note: '1080 × 1350, 4:5', width: 1080, height: 1350, inset: 64, top: 64, ring: 14 },
};
