"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

/**
 * The single primary action on the page.
 *
 * Signed out, it starts a free account. Signed in, the same weight of action
 * leads to the dashboard. There is only one filled button here; the secondary
 * is an outline and never competes.
 *
 * Note this deliberately does NOT use `SignedIn`/`SignedOut` from
 * better-auth-ui. Those render nothing during server rendering — the session is
 * unknown until the client resolves it — so on a page whose entire job is one
 * recognisable CTA, the button was absent from the HTML entirely: invisible to
 * crawlers, to no-JS visitors, and to anyone reading the page before hydration.
 *
 * Rendering the signed-out CTA by default and swapping after the session
 * resolves keeps the CTA in the markup, hydrates identically (the first client
 * render also has no session yet), and holds the same box dimensions so there
 * is no layout shift when it flips.
 */
export function PrimaryActions({
  size = "default",
}: {
  size?: "default" | "lg";
}) {
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const box = size === "lg" ? "h-11 px-6 text-[0.9375rem]" : "h-10 px-5";

  if (signedIn) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/dashboard"
          className={`pl-cta inline-flex items-center justify-center border border-transparent bg-primary font-medium text-primary-foreground hover:bg-primary/80 active:scale-[0.97] ${box}`}
        >
          Open dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Link
        href="/sign-up"
        className={`pl-cta inline-flex items-center justify-center border border-transparent bg-primary font-medium text-primary-foreground hover:bg-primary/80 active:scale-[0.97] ${box}`}
      >
        Start monitoring
      </Link>
      <Link
        href="/sign-in"
        className={`pl-cta inline-flex items-center justify-center border border-border bg-background font-medium text-foreground hover:bg-muted ${box}`}
      >
        Sign in
      </Link>
    </div>
  );
}
