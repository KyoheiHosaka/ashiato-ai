import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable client-side router cache for dynamic routes.
    // Without this, navigating back to the homepage serves a stale cached version
    // where PostListSection's useEffect doesn't re-run, leaving posts stuck in loading state.
    staleTimes: {
      dynamic: 0,
    },
  },
};

export default nextConfig;
