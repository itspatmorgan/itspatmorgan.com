# Deployment

How the site is built, previewed and published, and how dependencies and
automation stay safe. Checks and commands are in `AGENTS.md`.

## Build and hosting

Pushes to `main` and manual dispatches trigger `.github/workflows/deploy.yml`.
Design Studio's `Publish demo` workflow also dispatches it after successful source
checks. The Studio repository owns the `WEBSITE_DEPLOY_TOKEN` secret: a fine-grained
token with Actions read/write access to this website repository only.

The workflow builds Astro with its declared pnpm version, resolves the Studio
repository by permanent GitHub ID `1401250166`, and selects the latest successful
`main` push of its `checks.yml` workflow. It checks out that exact source commit,
builds with Studio's mise toolchain and `STUDIO_BASE_PATH=/design-studio-demo/`,
then copies the result into `dist/design-studio-demo/`. These build steps live in
`.github/actions/build-site/`, shared by production and previews. The combined
output is deployed to the `itspatmorgan` Cloudflare Worker (static assets only,
configured in `wrangler.jsonc`), which serves itspatmorgan.com and www as custom
domains. Studio source stays in its own repository. Never rename the Worker:
deploys and preview links depend on its name.
A failed source run cannot replace the last passing demo. An absent passing run
fails the website build rather than publishing an unverified source commit.

Pull requests from this repository run `.github/workflows/preview.yml`: the same
build, then `wrangler versions upload --preview-alias pr-<number>`, which leaves
production untouched and comments a stable `pr-<number>-itspatmorgan.<subdomain>.workers.dev`
link on the PR. Both workflows use the `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` repository secrets. Dependabot and fork PRs are built
and checked but get no preview link. The preview build is a pull request's only
build: `.github/workflows/checks.yml` runs the audit, script tests and type check
without building. Every build ends with `pnpm check:site`, which fails on broken
local links and pages missing a title, description or share image.

Cloudflare Web Analytics runs with automatic setup on the itspatmorgan.com zone:
Cloudflare injects its cookieless beacon at the edge, so the site has no analytics
code. Don't add a manual beacon snippet, which would count visits twice.

The root `404.html` supports direct demo URLs without redirecting their path and
provides browser redirects from `/design-studio-starter/`. Cloudflare serves it
for missing routes (`not_found_handling: "404-page"`) with HTTP 404. Other missing website paths retain the website's 404 page.

Local `pnpm build` builds Astro alone. To preview the combined output, first build
Studio in its own checkout with `STUDIO_BASE_PATH=/design-studio-demo/ pnpm build`,
then run `node scripts/include-studio-demo.mjs /absolute/path/to/studio/dist` after
the Astro build. A host must serve root `404.html` for missing routes. Local Vite
preview continues to proxy the live demo for ordinary website development.

## Dependencies

- Keep the portfolio lockfile committed and install with `pnpm install --frozen-lockfile`.
- Run `pnpm audit` when updating dependencies. PR checks, scheduled checks, and
  deployment block high and critical advisories with `pnpm audit --audit-level=high`.
  Registry errors must fail the check rather than silently skip the audit.
- Dependabot proposes weekly npm and GitHub Actions updates. Review and validate
  these changes before merging; dependency updates are not automatically merged.
- The shadcn component generator is not an installed dependency. Its shared CSS
  from version 4.0.0 is preserved with its MIT license in
  `src/styles/ui-utilities.css`; existing components remain in `src/components/ui/`.
- Do not force incompatible transitive dependency versions solely to clear audit counts.

## Advisory triage

Reviewed October 23, 2026: the refreshed lockfile has one low-severity advisory,
[GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr),
in esbuild 0.27.3 through Vite. It concerns esbuild's development server on Windows;
the published portfolio contains static files and runs no esbuild server. Local
macOS development and Ubuntu CI do not meet its platform condition. The fix is
esbuild 0.28.1; retain Vite's compatible dependency range until upstream adopts it.
Do not expose a development server to untrusted networks. Reassess this entry when
updating Astro/Vite or changing development platforms. No advisory is hidden from
the audit output.

## GitHub Actions

- Pin actions to verified full commit SHAs, with version comments for review.
- Keep build and PR jobs read-only and disable persisted checkout credentials.
- Workflows default to `contents: read`; only the preview job may comment on pull requests (`pull-requests: write`).
- Keep portfolio checks independent of the separately built Studio application.

Dependabot alerts, automatic security updates, secret scanning, and secret push
protection are repository settings rather than files in this checkout. Keep them
enabled. Recheck these settings after moving or recreating the repository.
