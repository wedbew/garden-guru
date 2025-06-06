import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bs.floristic.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'trefle.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'perenual.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
