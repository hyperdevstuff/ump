"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
 *
 * `nativeButton={false}` is required on each Button. The shared Button wraps
 * Base UI's `ButtonPrimitive`, which assumes a real <button> and emits
 * `type`/`tabindex` accordingly. Rendering an anchor through it without this
 * produces `<a type="button" tabindex="0">` — button attributes on a link,
 * no Enter/Space activation, and a dev-mode warning. With it, the anchor
 * keeps real link semantics.
 */
export function PrimaryActions({
  size = "default",
}: {
  size?: "default" | "lg";
}) {
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);

  if (signedIn) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          size={size}
          className="w-full sm:w-auto"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          Open dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button
        size={size}
        className="w-full sm:w-auto"
        nativeButton={false}
        render={<Link href="/sign-up" />}
      >
        Start monitoring
      </Button>
      <Button
        size={size}
        variant="outline"
        className="w-full sm:w-auto"
        nativeButton={false}
        render={<Link href="/sign-in" />}
      >
        Sign in
      </Button>
    </div>
  );
}
