import { avg, count, desc, eq, gte, sql } from "drizzle-orm";
import { healthCheck, incident, monitor } from "@/db/schema";

/**
 * Aggregate, non-identifying telemetry for the landing page readouts.
 *
 * Every number rendered on /prototype-landing comes from here, so nothing on
 * that page is invented. When the database is unreachable we return `null` and
 * the page renders an explicitly idle instrument instead of placeholder values.
 */
export type HourlyBucket = {
  /** Checks recorded in this hour. 0 means the instrument was idle. */
  checks: number;
  /** Share of checks that came back up, 0-1. null when there were none. */
  upRatio: number | null;
  /** Mean response time in ms. null when there were none. */
  avgMs: number | null;
};

export type SentinelTelemetry = {
  checks24h: number;
  uptime24h: number | null;
  avgResponseMs: number | null;
  monitors: number;
  activeMonitors: number;
  incidents7d: number;
  lastIncidentAt: Date | null;
  lastCheckedAt: Date | null;
  /** 24 hourly buckets, oldest first. Counts and ratios only — no URLs, no names. */
  hourly: HourlyBucket[];
};

export async function getSentinelTelemetry(): Promise<SentinelTelemetry | null> {
  try {
    // Imported lazily on purpose: `@/db` throws at module scope when
    // DATABASE_URL is unset, which would take the whole route down with it.
    const { db } = await import("@/db");

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      [checks],
      [monitors],
      [active],
      [incidents],
      [lastIncident],
      [latest],
      hourlyRows,
    ] = await Promise.all([
      db
        .select({
          total: count(),
          up: sql<number>`count(*) filter (where ${healthCheck.status} = 'up')::int`,
          avgMs: avg(healthCheck.responseTime),
        })
        .from(healthCheck)
        .where(gte(healthCheck.checkedAt, since24h)),
      db.select({ total: count() }).from(monitor),
      db
        .select({ total: count() })
        .from(monitor)
        .where(eq(monitor.isActive, true)),
      db
        .select({ total: count() })
        .from(incident)
        .where(gte(incident.detectedAt, since7d)),
      db
        .select({ detectedAt: incident.detectedAt })
        .from(incident)
        .orderBy(desc(incident.detectedAt))
        .limit(1),
      db
        .select({ checkedAt: healthCheck.checkedAt })
        .from(healthCheck)
        .orderBy(desc(healthCheck.checkedAt))
        .limit(1),
      // One bucket per hour of the last 24, for the block-line chart.
      db
        .select({
          bucket: sql<string>`date_trunc('hour', ${healthCheck.checkedAt})`,
          total: count(),
          up: sql<number>`count(*) filter (where ${healthCheck.status} = 'up')::int`,
          avgMs: avg(healthCheck.responseTime),
        })
        .from(healthCheck)
        .where(gte(healthCheck.checkedAt, since24h))
        .groupBy(sql`1`)
        .orderBy(sql`1`),
    ]);

    const total = checks.total ?? 0;
    // `avg()` over a Postgres integer column comes back as a numeric string.
    const avgMs = Number(checks.avgMs);

    // Align the 24 buckets on wall-clock hours, oldest first, so a quiet hour
    // reads as an idle tick rather than silently shifting the whole series.
    const byBucket = new Map(
      hourlyRows.map((row) => [
        new Date(row.bucket).toISOString(),
        {
          total: row.total ?? 0,
          up: row.up ?? 0,
          avgMs: Number(row.avgMs),
        },
      ]),
    );
    const currentHour = new Date();
    currentHour.setMinutes(0, 0, 0);
    const hourly: HourlyBucket[] = Array.from({ length: 24 }, (_, i) => {
      const start = new Date(currentHour.getTime() - (23 - i) * 60 * 60 * 1000);
      const row = byBucket.get(start.toISOString());
      if (!row || row.total === 0) {
        return { checks: 0, upRatio: null, avgMs: null };
      }
      return {
        checks: row.total,
        upRatio: row.up / row.total,
        avgMs: Number.isFinite(row.avgMs) ? Math.round(row.avgMs) : null,
      };
    });

    return {
      checks24h: total,
      uptime24h:
        total > 0 ? Math.round((checks.up / total) * 10000) / 100 : null,
      avgResponseMs: Number.isFinite(avgMs) ? Math.round(avgMs) : null,
      monitors: monitors.total ?? 0,
      activeMonitors: active.total ?? 0,
      incidents7d: incidents.total ?? 0,
      lastIncidentAt: lastIncident?.detectedAt ?? null,
      lastCheckedAt: latest?.checkedAt ?? null,
      hourly,
    };
  } catch (error) {
    // A landing page must not 500 because Postgres is down or absent.
    console.error("[prototype-landing] telemetry unavailable:", error);
    return null;
  }
}
