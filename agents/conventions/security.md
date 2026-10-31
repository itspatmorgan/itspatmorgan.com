# Security Maintenance

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

## Current Advisory Triage

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
- Grant `pages: write` and `id-token: write` only to the deployment job.
- Keep portfolio checks independent of the separately built Studio application.

Dependabot alerts, automatic security updates, secret scanning, and secret push
protection are repository settings rather than files in this checkout. Keep them
enabled. Recheck these settings after moving or recreating the repository.
