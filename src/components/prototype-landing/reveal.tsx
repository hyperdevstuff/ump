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
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`pl-reveal ${className}`}>
      {children}
    </div>
  );
}
