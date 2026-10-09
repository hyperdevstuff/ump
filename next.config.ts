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
    // turbopackGc is deliberately NOT enabled. On 16.4.0 it reliably crashes
    // the dev server on HMR:
    //
    //   thread 'tokio-rt-worker' panicked at turbo-tasks-backend/src/backend/
    //   operation/aggregation_update.rs: inner_of_upper_lost_follower is not
    //   able to remove follower TaskId ... from TaskId ...
    //   turbo-tasks: an internal panic occurred outside the per-task panic
    //   boundary. Aborting.
    //
    // The process dies, taking the dev session with it. Reproduced on a clean
    // `.next` and again after an edit-triggered recompile; with the flag off,
    // the same edit/reload cycles run clean. Upstream bug, not a config
    // mistake. Re-test on the next minor before turning it back on.
    //
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
      {
        // The landing page shipped at /prototype-landing before it was
        // promoted to /. Keep the old path working for existing links.
        source: "/prototype-landing",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
