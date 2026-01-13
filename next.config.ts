import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pelikan.cz',
      },
      {
        protocol: 'https',
        hostname: '**.invia.cz',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      }
    ],
  },
};

export default nextConfig;
