# Fact-finding

## Read the sources, then ask

Read everything first: the entry, its embedded deck, and its Figma frames. Then
ask, in one batch, only what those sources don't answer:

- When was it, and what was Patrick's title? Who was on the team, and for how long?
- What was the problem in the user's own terms?
- What was the expected answer, and what did Patrick bet on instead?
- Which parts did Patrick design for this project, and which existed already?
- What changed, and how was it measured? Did it ship? Is there any adoption data?
- What went wrong, and what changed because of it? (Ask whether it can be
  public before using it.)
- Is Patrick's role ongoing? Then the copy says "I lead", not "I led".
- Is there a quote, and who said it, in what capacity?
- What did Patrick learn, in his own words?

Write down anything unverified as an open question. Never smooth it over in the
copy. If there is no hard outcome, say so plainly rather than implying one.

## Get exact values from the source

When source screens exist, rebuild them from the source's values, not by eye.

When the source is prototype code (the Sublime agents case study came from the
Design Studio archive):

- Inventory the real screens and their states first, and map each slide to one
  before building anything.
- Copy tokens, spacing, and icon paths from the source components. Never redraw
  an icon by hand; a hand-drawn mark reads as broken.
- Keep components where they sit in the real layout and keep the real order of
  content. A change that improves the design is welcome when it is named.

When the source is Figma:

- Prefer the Figma connector (`get_design_context`). If it is unavailable or
  rate-limited, use the signed-in browser: right-click the frame's layer, choose
  Copy/Paste as → Copy as code → CSS (all layers), and read the clipboard with
  `pbpaste`. That gives position, size, type, color, and radius for every layer.
- Use Copy as SVG for vector shapes (chart lines, logos). Its text is outlined,
  so it is not a substitute for real text.
- Layer names can be stale. Confirm visible text against a zoomed view of the frame.
- Extract repeated data (chart bars, sparklines) with a script into a data
  module, as in `src/components/expansion/figma-bars.ts`.
- Diagrams with no source frame follow the deck's visual style instead.
