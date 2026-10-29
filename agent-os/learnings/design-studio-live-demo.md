# Design Studio live marketing demo

The portfolio owns the browser presentation and same-origin adapter in
`src/components/design-studio/StudioLiveDemo.astro` and
`src/scripts/studio-live-demo.ts`. Design Studio owns navigation, prototype behavior,
and artifact readers. Embed its existing deployed homepage under
`/design-studio-demo/` in one persistent iframe; do not copy product code or
depend on the sibling checkout at build time.

One Design Studio browser tab opens the full published environment. Visitors
navigate using its real UI. Observe DOM changes and check location periodically
for SPA/history/hash changes; update both the address text and external-page
link. Keep the iframe document alive so SPA navigation preserves product state.

Hide the entire live demo section, including its heading and spacing, when it
has less than 760px of available width. Match the CSS container query with the
ResizeObserver activation threshold; do not load Studio on an initially narrow
screen. Once activated, preserve the iframe across resizing, hiding it when space
is limited. On larger screens without JavaScript, provide the noscript link.

Follow the portfolio theme using Studio's existing Light mode / Dark mode
control, which the adapter hides from the embedded UI and keyboard navigation
with `display: none`. It remains callable for synchronization; the standalone
Studio is unaffected. Collapse section navigation when its Hide navigation control first
appears. On first entry to each prototype or system in the embedded session, reveal its
section navigation using Show navigation so visitors discover the artifacts and resources.
After that, respect their choice to collapse or reopen it. Match project routes
against the demo's base path (`/design-studio-demo/`); a hard-coded older path
silently stopped this reveal when the base moved. These controls also update Studio's
saved theme and navigation preferences. Control labels are integration contracts.

Use a fixed-size skeleton/error overlay rather than an appended status bar.
Loading text is screen-reader-only. The overlay covers the route only: wait for
hydration, theme synchronization and, on an artifact page, its content in place.
Do not wait for previews, diagrams or canvases embedded in that content; they show
their own loading states, and waiting for them (a canvas embedded in a document
takes about a second) kept the overlay over a page that was already there, which
read as slow and buggy. Reveal immediately when ready, with a 100ms fade. After
the initial load, delay the skeleton by 120ms so fast navigation completes
without flashing an overlay. Respect reduced motion.

This adapter requires a shared origin. Vite development and preview proxies
serve the published demo under localhost. The website's production deployment
checks out a passing Studio source commit from its GitHub repository, builds it
with `/design-studio-demo/` as its base, and includes it in the combined Pages
artifact. Local `pnpm build` still builds Astro alone; see the deployment section
in `agent-os/system-map.md` for assembling a local combined preview. The root
404 page loads Studio only for demo application routes and redirects the former
`/design-studio-starter/` path. Check accessible control labels and rendering
markers when Studio is updated.

The lower document gallery and artifact explorer remain separate explanatory
sections using their original components.
