import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://ai-powered-taskflow-api.vercel.app/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
