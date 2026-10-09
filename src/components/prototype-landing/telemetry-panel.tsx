import { ElapsedSince } from "@/components/prototype-landing/elapsed-since";
import type { SentinelTelemetry } from "@/lib/prototype-landing-telemetry";

function formatClock(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function Readout({
  label,
  value,
  unit,
  empty = false,
}: {
  label: string;
  value: string;
  unit?: string;
  empty?: boolean;
}) {
  return (
    <div className="pl-plate border border-border bg-card px-3 py-2.5">
      <div className="pl-label">{label}</div>
      <div className="pl-value mt-1.5" data-empty={empty ? "true" : "false"}>
        {value}
        {unit && !empty && (
          <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
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
 */
export function TelemetryPanel({
  telemetry,
}: {
  telemetry: SentinelTelemetry | null;
}) {
  return (
    <div className="pl-plate border border-border bg-card">
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="pl-dot"
            data-state={telemetry ? "up" : "down"}
            aria-hidden="true"
          />
          <span className="pl-label">Sentinel telemetry</span>
        </div>
        <span className="pl-label">24h</span>
      </div>

      {telemetry ? (
        <>
          <div className="grid grid-cols-2 gap-px bg-border">
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
              label="Since check"
              value={
                telemetry.lastCheckedAt
                  ? formatClock(telemetry.lastCheckedAt)
                  : "—"
              }
              empty={!telemetry.lastCheckedAt}
            />
          </div>

          {/* Live foot: the one thing on the page that moves on its own. */}
          <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
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
        <div className="px-3 py-4">
          <p className="pl-label">No telemetry</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This panel reads live from the database. Point{" "}
            <code className="text-foreground">DATABASE_URL</code> at a running
            Postgres with recorded health checks and the readouts appear here.
          </p>
        </div>
      )}
    </div>
  );
}
