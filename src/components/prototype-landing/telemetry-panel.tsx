import { ElapsedSince } from "@/components/prototype-landing/elapsed-since";
import { UptimeChart } from "@/components/prototype-landing/uptime-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SentinelTelemetry } from "@/lib/prototype-landing-telemetry";

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Compact elapsed readout for the Last-incident tile: minutes, hours, days. */
function elapsedShort(date: Date) {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return { value: String(Math.max(minutes, 1)), unit: "m" };
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return { value: String(hours), unit: "h" };
  return { value: String(Math.floor(hours / 24)), unit: "d" };
}

function Readout({
  label,
  value,
  unit,
  empty = false,
  // Long values (the HH:MM:SS clock) drop a size instead of crowding the tile.
  dense = false,
}: {
  label: string;
  value: string;
  unit?: string;
  empty?: boolean;
  dense?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2.5">
      <div className="pl-label">{label}</div>
      <div
        className={`mt-1.5 ${dense ? "pl-value-sm" : "pl-value"}`}
        data-empty={empty ? "true" : "false"}
      >
        {value}
        {unit && !empty && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * The instrument.
 *
 * Every value below is an aggregate read from the health_check, monitor and
 * incident tables — counts and timings only, never a customer's URL or monitor
 * name. If the database cannot be reached the panel says so plainly instead of
 * rendering plausible-looking filler.
 *
 * Built on the shared Card so it carries the same radius, ring and shadow as
 * every other surface in the app.
 */
export function TelemetryPanel({
  telemetry,
}: {
  telemetry: SentinelTelemetry | null;
}) {
  return (
    <Card size="sm">
      {/* Header strip. CardHeader is a single-column grid; the explicit
          two-column template is what puts the window label on the right. */}
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-3 border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <span
            className="pl-dot"
            data-state={telemetry ? "up" : "down"}
            aria-hidden="true"
          />
          <span className="pl-label">Sentinel telemetry</span>
        </CardTitle>
        <span className="pl-label">24h</span>
      </CardHeader>

      <CardContent className="px-0">
        {telemetry ? (
          <>
            {/* Four-wide once the card has the room for it. */}
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
              <Readout
                label="Checks"
                value={telemetry.checks24h.toLocaleString("en-GB")}
                empty={telemetry.checks24h === 0}
              />
              <Readout
                label="Uptime"
                value={
                  telemetry.uptime24h === null
                    ? "—"
                    : telemetry.uptime24h.toFixed(2)
                }
                unit="%"
                empty={telemetry.uptime24h === null}
              />
              <Readout
                label="Response"
                value={
                  telemetry.avgResponseMs === null
                    ? "—"
                    : telemetry.avgResponseMs.toLocaleString("en-GB")
                }
                unit="ms"
                empty={telemetry.avgResponseMs === null}
              />
              <Readout
                label="Monitors"
                value={telemetry.monitors.toLocaleString("en-GB")}
              />
              <Readout
                label="Incidents"
                value={telemetry.incidents7d.toLocaleString("en-GB")}
              />
              <Readout
                label="Active"
                value={telemetry.activeMonitors.toLocaleString("en-GB")}
              />
              <Readout
                label="Last incident"
                value={
                  telemetry.lastIncidentAt
                    ? elapsedShort(telemetry.lastIncidentAt).value
                    : "—"
                }
                unit={
                  telemetry.lastIncidentAt
                    ? elapsedShort(telemetry.lastIncidentAt).unit
                    : undefined
                }
                empty={!telemetry.lastIncidentAt}
              />
              <Readout
                label="Since check"
                dense
                value={
                  telemetry.lastCheckedAt
                    ? formatClock(telemetry.lastCheckedAt)
                    : "—"
                }
                empty={!telemetry.lastCheckedAt}
              />
            </div>

            {/* The block line: the hero's one chart, drawn from real checks. */}
            <div className="border-t border-border pt-4">
              <UptimeChart hourly={telemetry.hourly} />
            </div>

            {/* Live foot: the one thing on the page that moves on its own. */}
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
              <span className="pl-label">Last check</span>
              {telemetry.lastCheckedAt ? (
                <span className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
                  <ElapsedSince iso={telemetry.lastCheckedAt.toISOString()} />
                  <span className="text-foreground">ago</span>
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  no checks yet
                </span>
              )}
            </div>
          </>
        ) : (
          /* Obviously static, never a zero dressed up as a measurement. */
          <div className="px-4 py-5">
            <p className="pl-label">No telemetry</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This panel reads live from the database. Point{" "}
              <code className="text-foreground">DATABASE_URL</code> at a running
              Postgres with recorded health checks and the readouts appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
