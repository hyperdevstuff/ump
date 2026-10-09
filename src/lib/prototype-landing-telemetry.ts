import { avg, count, desc, gte, sql } from "drizzle-orm";
import { healthCheck, incident, monitor } from "@/db/schema";

/**
 * Aggregate, non-identifying telemetry for the landing page readouts.
 *
 * Every number rendered on /prototype-landing comes from here, so nothing on
 * that page is invented. When the database is unreachable we return `null` and
 * the page renders an explicitly idle instrument instead of placeholder values.
 */
export type SentinelTelemetry = {
  checks24h: number;
  uptime24h: number | null;
  avgResponseMs: number | null;
  monitors: number;
  incidents7d: number;
  lastCheckedAt: Date | null;
};

export async function getSentinelTelemetry(): Promise<SentinelTelemetry | null> {
  try {
    // Imported lazily on purpose: `@/db` throws at module scope when
    // DATABASE_URL is unset, which would take the whole route down with it.
    const { db } = await import("@/db");

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [[checks], [monitors], [incidents], [latest]] = await Promise.all([
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
        .from(incident)
        .where(gte(incident.detectedAt, since7d)),
      db
        .select({ checkedAt: healthCheck.checkedAt })
        .from(healthCheck)
        .orderBy(desc(healthCheck.checkedAt))
        .limit(1),
    ]);

    const total = checks.total ?? 0;
    // `avg()` over a Postgres integer column comes back as a numeric string.
    const avgMs = Number(checks.avgMs);

    return {
      checks24h: total,
      uptime24h:
        total > 0 ? Math.round((checks.up / total) * 10000) / 100 : null,
      avgResponseMs: Number.isFinite(avgMs) ? Math.round(avgMs) : null,
      monitors: monitors.total ?? 0,
      incidents7d: incidents.total ?? 0,
      lastCheckedAt: latest?.checkedAt ?? null,
    };
  } catch (error) {
    // A landing page must not 500 because Postgres is down or absent.
    console.error("[prototype-landing] telemetry unavailable:", error);
    return null;
  }
}
