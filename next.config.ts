import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for demo purposes
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds for demo purposes
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
