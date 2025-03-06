import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Match all requests to /api/<endpoint>
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/:path*`, // Forward to your backend URL
      },
    ];
  },
};

export default nextConfig;
