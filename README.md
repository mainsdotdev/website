# Mains Landing

Website for [Mains](https://mains.dev) — a macOS desktop app for running AI coding agents (Claude Code, Copilot, Codex, Cursor) in secure, Git-backed workspaces.

The site covers what Mains does, download links for the latest release, integrations, changelog, and the blog.

- **App repository:** [mainsdotdev/mains](https://github.com/mainsdotdev/mains)
- **Live site:** [mains.dev](https://mains.dev)

## Analytics

The site uses [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/),
which is cookieless: the beacon sets no cookies and uses no browser storage.

In the Cloudflare dashboard, go to **Analytics & Logs → Web Analytics → Add a site**,
enter `mains.dev`, and copy the `token` value from the JS snippet's
`data-cf-beacon` attribute. Copy `.env.example` to `.env.local` and set
`NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` to that token. Set the same variable in the
production hosting environment **before building**, then rebuild and deploy.
A missing, empty or invalid token disables analytics; the development server
never loads it.

The beacon tracks Next.js client navigation on its own (SPA mode is on by
default), so no extra page-view code is needed. After deployment, open the site
with an ad blocker disabled and check for a request to
`cloudflareinsights.com/cdn-cgi/rum`; visits appear in the dashboard within a
few minutes.
