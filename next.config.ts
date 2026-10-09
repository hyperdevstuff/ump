import type { NextConfig } from "next";

/**
 * NOTE: Next.js resolves config files in a fixed order —
 * `next.config.js`, then `.mjs`, then `.ts`. A `next.config.js` sitting
 * alongside this file wins silently, which previously meant the settings below
 * were dead code. Keep this as the single config file for the project.
 */
const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/account",
        destination: "/dashboard/settings",
        permanent: true,
      },
      {
        source: "/account/settings",
        destination: "/dashboard/settings",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
