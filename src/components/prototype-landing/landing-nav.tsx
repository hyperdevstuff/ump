"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { PrimaryActions } from "@/components/prototype-landing/primary-actions";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/status", label: "Status" },
] as const;

/**
 * The landing header.
 *
 * Sticky with a translucent backdrop so content passing underneath stays
 * legible without the bar reading as a separate slab.
 *
 * The mobile panel closes on Escape and on navigation. Both are cheap, and
 * without them a user who opens the menu and picks a link lands on the anchor
 * with the panel still covering the content they were sent to.
 */
export function LandingNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-sm font-medium tracking-tight"
        >
          <BrandLogo size={22} />
          <span>Sentinel</span>
        </Link>

        {/* Section anchors. Hidden below md, where they would crowd the CTAs. */}
        <nav className="ml-4 hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="pl-rule-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Signed-out, this is two buttons — too wide for 390px once the
              wordmark is in, so the desktop CTAs drop below sm. */}
          <div className="hidden sm:block">
            <PrimaryActions />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="pl-press md:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </Button>
        </div>
      </div>

      {/*
        Rendered only while open, so it is not in the accessibility tree or the
        tab order when collapsed. The border sits on the wrapper rather than the
        panel so the two never disagree about the header's 1px bottom edge.
      */}
      {open && (
        <div
          id="landing-mobile-nav"
          className="border-t border-border bg-background md:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2 sm:px-6"
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border py-3 sm:flex-row">
              <PrimaryActions />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
