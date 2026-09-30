import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    // Small wordmark art and hero cards should not jump from 384px to 640px.
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 160, 192, 224, 256, 320, 384, 448, 512],
  },
};

export default nextConfig;
