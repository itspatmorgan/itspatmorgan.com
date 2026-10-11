# Design Studio live marketing demo

The portfolio owns the browser presentation and same-origin adapter in
`src/components/design-studio/StudioLiveDemo.astro` and
`src/scripts/studio-live-demo.ts`. Starter owns navigation, prototype behavior,
and artifact readers. Embed its existing deployed homepage under
`/design-studio-starter/` in one persistent iframe; do not copy product code or
depend on the sibling checkout at build time.

One Design Studio browser tab opens the full published environment. Visitors
navigate using its real UI. Observe DOM changes and check location periodically
for SPA/history/hash changes; update both the address text and external-page
link. Keep the iframe document alive so SPA navigation preserves product state.

Hide the entire live demo section, including its heading and spacing, when it
has less than 760px of available width. Match the CSS container query with the
ResizeObserver activation threshold; do not load Starter on an initially narrow
screen. Once activated, preserve the iframe across resizing, hiding it when space
is limited. On larger screens without JavaScript, provide the noscript link.

Follow the portfolio theme using Starter's existing Light mode / Dark mode
control, which the adapter hides from the embedded UI and keyboard navigation
with `display: none`. It remains callable for synchronization; the standalone
Studio is unaffected. Collapse section navigation when its Hide navigation control first
appears. On first entry to each prototype or system in the embedded session, reveal its
section navigation using Show navigation so visitors discover the artifacts and resources. After that,
respect their choice to collapse or reopen it. These controls also update Starter's
saved theme and navigation preferences. Control labels are integration contracts.

Use a fixed-size skeleton/error overlay rather than an appended status bar.
Loading text is screen-reader-only. Wait for hydration, theme synchronization,
and nested preview/diagram/canvas readiness within the visible viewport. Reveal
immediately when ready, with a 100ms fade; do not add a settling delay or wait for
offscreen embeds. After the initial load, delay the skeleton by 120ms so fast
navigation completes without flashing an overlay. Respect reduced motion.
Lifecycle `unknown` on generic reader wrappers
is not necessarily pending: React previews use `data-preview-state`, diagrams
use figure lifecycle attributes, canvases use `data-canvas-opening`. Embedded
content may also load within documents. Watch for visible loading statuses.

This adapter requires a shared origin. Vite development and preview proxies
serve the existing deployment under localhost. The production static build does
not include or proxy Starter. Another host needs Starter at the same path or a
separate integration decision. Check accessible control labels and rendering
markers when Starter is updated. No Starter source changes are required.

The lower document gallery and artifact explorer remain separate explanatory
sections using their original components.
