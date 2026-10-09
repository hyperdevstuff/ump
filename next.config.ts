import type { NextConfig } from "next";

/**
 * NOTE: Next.js resolves config files in a fixed order —
 * `next.config.js`, then `.mjs`, then `.ts`. A `next.config.js` sitting
 * alongside this file wins silently, which previously meant the settings below
 * were dead code. Keep this as the single config file for the project.
 */
const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Reclaims unreachable compilation work from memory and the disk cache.
    // Worth having here: this repo sat dormant for months, so the cache still
    // holds artifacts for routes and layouts that no longer exist.
    turbopackGc: true,
    // Defers compiling client-side `import()` targets until the browser asks
    // for them, so a dev session never pays for a dependency it never opens.
    turbopackLazyDynamicImports: true,
    // Nudge when a release with a known CVE affects the installed version.
    agentUpgrade: "security",
  },
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
