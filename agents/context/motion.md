# Motion

Every rule for things that move on the site: page routes, load effects, case
study scenes, project cards and phone views. Motion should feel instant, quiet
and deliberate (design principle 7). Skills link here instead of restating
these rules. When a rule can run as code (a scene player default, a token, a
check), put it there and keep this file as the reason.

## Tokens

Curves and route timings live in `src/styles/global.css`. Use a token instead
of writing a curve by hand. In React, use `EASE` from
`src/components/case-study/motion.ts`, which mirrors the demo curves (a test
keeps the two in step).

| Job | Token |
| --- | --- |
| Demos, travel: a camera, pointer or panel moving to a new place | `--motion-ease-travel`, `EASE.travel` |
| Demos, arrival: something appearing or settling into place | `--motion-ease-arrival`, `EASE.arrival` |
| Site entrances and settles, including the page fade | `--motion-ease-out` |
| Quick UI responses, gliding highlights | `--motion-ease-out-quick` |
| Phone stage pans and other site-level moves | `--motion-ease-in-out` |
| Small state changes | `--motion-ease-standard` |
| Route out and in | `--motion-route-out` (90ms), `--motion-route-in` (180ms) |

Add a token only when none of these fits the job.

## Routes and load

- Pages fade: the old page out in 90ms, the new one in over 180ms with a 4px
  rise. Route motion stays under about 250ms. Reduced motion turns it off.
- Links prefetch on hover. Don't layer page or scroll entrance animations on
  top of the route fade.
- Nothing animates on load except the home hero's pixel-to-sans dissolve (first
  home visit of a session) and the same dissolve on the closing line when it
  scrolls into view. Both use `dissolvePixelWave` in
  `src/scripts/home-interactions.ts`. No load effects on the navigation logo.
- Primary content renders in its final position. Nothing jumps on load.

## Scenes

Case study and Design Studio demos run on the scene player in
`src/components/case-study/scene.tsx`.

- A scene starts when it scrolls into view and pauses when it leaves.
- It loops by default, since a flow's last screen rarely tells the whole story.
  Hold the end (`loop: false`, with Replay) only when the end state is the
  point: a metric, a chart drawing in, a diagram that builds to its answer.
- Never run backward. At the loop seam, fade out, jump to the first frame with
  transitions off, then fade in.
- Each step changes one thing. When several change at once, the in-between
  frames look broken even if the end state is right.
- Fade a text-heavy screen out before the next fades in. Keep shared chrome
  still and fade only its content. Prefer one live diagram whose parts move
  over cross-fading whole frames.
- Never animate to `height: auto`; animate to a measured height a
  ResizeObserver keeps current.

### Timing

- The payoff, the frame that makes the point, holds about 2 seconds
  (`PAYOFF_HOLD_MS`). It's often but not always the last step, so set it in
  the scene's timings; the review checks it.
- The loop seam, from the last frame fading out to the first frame back, takes
  under 1 second. The scene player fades out for `SEAM_FADE_MS` (240ms), resets
  and fades back in.
- Nothing sits still for more than about 3 seconds while playing.
- No dead pauses. Tune step timings until each beat reads and then moves on.

### Camera and pointer

- Camera moves and pointer moves get separate steps. The pointer appears only
  after the camera lands.
- A zoom frames one whole component with padding, and its crop lands at a
  layout gutter, never mid-word or past the page edge. Skip a zoom that only
  trims edges. A new page arrives at full frame.
- The pointer travels in a gentle upward arc, longer moves taking a little
  longer (`Pointer` in `scene.tsx` does this). When placing it, never cover the
  words it clicks, and rest it on empty space between moves.
- Direct attention with the camera, never with highlight rings or outlines that
  could pass for UI.

### Playback controls

Every animated demo has the step tracker and Pause/Play (or Replay) under its
stage (`SceneTour`). One segment per caption; click a segment to jump. Show a
caption only when it names something the picture and slide copy don't; pass
`caption={false}` otherwise. Captions are plain statements, one line at desktop
width, no trailing period. On phones, controls come first and the caption sits
below at its natural height.

## Poster frames

The first frame and the resting frame are each complete and make the point on
their own: no blank chart, no empty rows, nothing half-entered. The first frame
is what a reader sees as the scene scrolls in; the resting frame is all that
reduced motion and touch-only cards show.

## Project cards

- A card rests on its last frame and plays only on hover, from its first frame
  back to the last. Never on load or scroll.
- One focused change per card: pairs light up, a status settles, bars rise.
- Nothing pops. Keep both states mounted in one cell and cross-fade: out in
  about 180ms, in over about 360ms after an 80ms delay. Don't remount on a
  `key` with an entry animation, which also plays on load.
- Keep the layout still while text changes: fixed widths and a second line that
  is always filled.
- Switch a card's drawing size in CSS, never in a hook after hydration, so it
  doesn't jump as the page loads.

## Phones

Phones are 640px and below. Check every visual at 390px.

- **Case study demos of shipped UI** show the whole desktop frame at its desktop
  proportions. Never lay a shipped screen out again for a phone, which would
  show a product that never shipped. Closer looks keep the proportions and zoom
  by `PHONE_ZOOM` (1.6), or 1.2 to 1.3 when the subject is wide. Prefer no zoom
  to a wrong zoom: a crop must never cut the step's key fact. Hold one view per
  chapter rather than chasing the pointer.
- **Product and landing page visuals** (the Design Studio page) are designed
  for the phone, one visual at a time. All phone visuals on a page share one
  frame, square (1:1) on Design Studio. Fit the content inside with even
  margins, center it optically, and avoid tall modules. Watch for wrapping and
  crowding. Header controls stay in proportion to the logo. Zooms are calm.
- **Before hydration** the server renders the desktop layout. A visual that
  switches to its phone layout in a hook holds its phone size in CSS until then,
  so nothing below it moves, and lands on its first phone framing without a
  camera move. `review.mjs --motion` shows the frame a phone sees on load.

## Reduced motion

Every scene and card shows its final frame without animating. Route transitions
are off.
