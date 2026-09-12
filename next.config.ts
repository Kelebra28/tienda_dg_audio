import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/:path*',
          destination: 'https://html.dgaudiosound.com/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
 