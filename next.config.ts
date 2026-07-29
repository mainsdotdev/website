import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/blog/changelog-0-3-0-launch",
        destination: "/blog/mains-0-4-public-release",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
