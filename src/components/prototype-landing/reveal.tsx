"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * The default landing-page entrance: clip-path reveal, once, on entry.
 *
 * CSS, not Motion — the page is decoding images and painting at the same time,
 * which is exactly when main-thread rAF drops frames. The observer disconnects
 * after it fires, so a long page does not leak one observer per section.
 */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already on screen at load (the hero): show it without waiting for a tick.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.dataset.visible = "true";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    );

    io.observe(el);

    /*
     * Safety net. The clip-path above hides this subtree until the observer
     * fires, so any path that never fires — a headless screenshot, a print
     * stylesheet, an embedded webview that suppresses IntersectionObserver —
     * leaves the section permanently invisible. Reveal unconditionally after a
     * beat. The animation is decorative; the content is not.
     */
    const failsafe = window.setTimeout(() => {
      el.dataset.visible = "true";
      io.disconnect();
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`pl-reveal ${className}`}>
      {children}
    </div>
  );
}
