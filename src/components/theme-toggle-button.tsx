"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * The theme toggle for the public pages.
 *
 * Deliberately NOT the app's `ModeToggle`: that one calls `useSidebar()` and
 * throws outside a `SidebarProvider`, so it can only render inside the
 * dashboard shell. This is the same light/dark pair, without the sidebar
 * dependency and without the three-way segmented control — on a marketing
 * header a single icon that swaps is less to explain and less to animate.
 *
 * No `mounted` gate here. `next-themes` cannot resolve the theme during SSR,
 * so gating the icon on it is the usual way to avoid a hydration mismatch —
 * but that produces a visible icon swap on every page load. Instead both icons
 * are always rendered and swapped by the `dark:` variants, which key off the
 * class the theme provider puts on <html> before paint. Same result, no flash.
 *
 * `resolvedTheme` is only read inside the click handler, where it is always
 * defined because the handler can only run on the client.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      // Press feedback. The shared Button transitions `all`, which is the one
      // place this page overrides it down to the property that actually moves.
      className="pl-press text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Both icons are always mounted and swapped by the `dark` class, which
          lives on <html> before paint. No mounted-gated flash, no mismatch. */}
      <Sun className="size-4 dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-4 dark:block" aria-hidden="true" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
