import type { HourlyBucket } from "@/lib/prototype-landing-telemetry";

function bucketHour(index: number, now: Date) {
  const hour = (((now.getHours() - (23 - index)) % 24) + 24) % 24;
  return `${hour.toString().padStart(2, "0")}:00`;
}

function bucketTitle(bucket: HourlyBucket, index: number, now: Date) {
  const label = bucketHour(index, now);
  if (bucket.checks === 0 || bucket.upRatio === null) {
    return `${label} — no checks`;
  }
  const downs = bucket.checks - Math.round(bucket.upRatio * bucket.checks);
  const up = downs === 0 ? "all up" : `${downs} down of ${bucket.checks}`;
  const ms = bucket.avgMs === null ? "" : ` · ${bucket.avgMs}ms avg`;
  return `${label} — ${bucket.checks} check${bucket.checks === 1 ? "" : "s"}, ${up}${ms}`;
}

/**
 * The block line: one bar per hour of the last 24, tallest where the
 * instrument was busiest, coloured strictly by outcome — up / mixed / down.
 * Counts and ratios only; no customer URLs or names are involved, and an
 * idle hour is an empty tick, never a fabricated zero.
 */
export function UptimeChart({ hourly }: { hourly: HourlyBucket[] }) {
  const now = new Date();
  const maxChecks = Math.max(...hourly.map((bucket) => bucket.checks), 1);

  return (
    <div className="px-4 pb-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="pl-label">Checks, hourly</span>
        <span className="pl-label">oldest → newest</span>
      </div>

      <div className="mt-2 flex h-14 items-end gap-[3px]">
        {hourly.map((bucket, index) => {
          // The hour label is the stable identity of a bucket: 24 slots, one
          // per wall-clock hour, oldest first.
          const label = bucketHour(index, now);
          let bar = "bg-border";
          if (bucket.upRatio !== null) {
            if (bucket.upRatio === 1) bar = "bg-(--color-success)";
            else if (bucket.upRatio > 0) bar = "bg-(--color-degraded)";
            else bar = "bg-(--color-error)";
          }
          const height =
            bucket.checks === 0
              ? 2
              : Math.max(8, Math.round((bucket.checks / maxChecks) * 100));

          return (
            <div
              key={label}
              className={`${bar} min-w-1 flex-1 rounded-[1px]`}
              style={{ height: `${height}%` }}
              title={bucketTitle(bucket, index, now)}
            />
          );
        })}
      </div>

      <div className="mt-1.5 flex items-baseline justify-between gap-3 text-[0.625rem] text-muted-foreground tabular-nums">
        <span>{bucketHour(0, now)}</span>
        <span>now</span>
      </div>
    </div>
  );
}
