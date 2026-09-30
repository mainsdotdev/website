# Mains Landing

Website for [Mains](https://mains.dev) — a macOS desktop app for running AI coding agents (Claude Code, Copilot, Codex, Cursor) in secure, Git-backed workspaces.

The site covers what Mains does, download links for the latest release, integrations, changelog, and the blog.

- **App repository:** [mainsdotdev/mains](https://github.com/mainsdotdev/mains)
- **Live site:** [mains.dev](https://mains.dev)

## Google Analytics 4

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GA_MEASUREMENT_ID`
to the GA4 web stream's `G-...` measurement ID. `.env.local` is ignored by Git;
keep the actual measurement ID out of tracked files. Set the same variable in
the production hosting environment **before building**, then rebuild and deploy.
A missing, empty or invalid ID disables Analytics; the development server
never loads it.

Find the ID in Google Analytics under **Admin → Data streams → your web stream**.
Keep Enhanced Measurement's **Page views → Page changes based on browser history
events** enabled to measure Next.js client navigation. The site uses Google's
automatic page views; do not add a second page-view tag for the same stream.

The Google tag uses cookie-less measurement with `analytics_storage`,
`ad_storage`, `ad_user_data` and `ad_personalization` set to `denied` before
configuration. Google still receives measurement requests. Google signals and
advertising personalization are disabled. Reporting is more limited than
consented tracking; modeled data depends on Google's eligibility thresholds.
See [Consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode).

After deployment, use [Tag Assistant](https://tagassistant.google.com/) to verify
the measurement ID and denied consent settings, then navigate between pages and
check requests to Google Analytics. Verify that no `_ga` cookies are created in
a fresh browser session. Report availability can vary for cookie-less traffic.
