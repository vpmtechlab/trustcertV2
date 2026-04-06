import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Proxies requests to your custom subdomain (v1/*) to the Convex backend
        source: "/v1/:path*",
        destination: "https://pleasant-sparrow-60.convex.site/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
