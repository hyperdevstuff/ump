"use client";

import { useEffect, useMemo, useState } from "react";

function formatElapsed(ms: number) {
  if (ms < 0) return "—";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${String(minutes % 60).padStart(2, "0")}m`;
}

/**
 * Time since the last recorded check, counting on the client.
 *
 * The timestamp is real, read from the health_check table on the server. The
 * first render is server-rendered from the same value, so hydration matches and
 * there is no placeholder that jumps. This is the live readout on the page: it
 * counts real elapsed time, not a simulated one.
 */
export function ElapsedSince({ iso }: { iso: string }) {
  const start = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(start);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{formatElapsed(now - start)}</span>;
}
