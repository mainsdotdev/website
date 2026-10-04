import Script from "next/script";

const Analytics = ({ token }: { token?: string }) => {
  const siteToken = token?.trim();

  // Do not load the beacon without a valid Cloudflare Web Analytics site token.
  if (!siteToken || !/^[A-Za-z0-9]+$/.test(siteToken)) return null;

  // Cookieless: the beacon uses no cookies or browser storage, and tracks
  // client-side navigation itself (SPA mode is on by default).
  return (
    <Script
      id="cloudflare-web-analytics"
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: siteToken })}
    />
  );
};

export default Analytics;
