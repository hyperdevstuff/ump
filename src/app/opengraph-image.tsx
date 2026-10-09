import { ImageResponse } from "next/og";

export const alt =
  "Find outages before your users do — Sentinel uptime monitoring";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card for the landing page.
 *
 * Rendered in the Instrument register: a dark plate, one amber rule, the
 * headline set as the primary visual. Colours match the app's dark theme
 * tokens (--background, --primary) so the card reads as part of the product.
 *
 * It uses ImageResponse's built-in font rather than JetBrains Mono —
 * `next/font/google` downloads at build time and hands back a hashed CSS
 * variable, not a font buffer, so the project mono is not available to Satori
 * here.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0d0d12",
        color: "#f2f2f5",
        padding: "72px 80px",
        // The one hairline rule: a scale mark across the top edge.
        borderTop: "6px solid #e8833a",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8b8b96",
          }}
        >
          Sentinel
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 82,
            lineHeight: 1.04,
            letterSpacing: -3,
            maxWidth: 940,
          }}
        >
          Find outages before your users do
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            lineHeight: 1.4,
            color: "#a5a5b0",
            maxWidth: 860,
          }}
        >
          HTTP, TCP and ping checks. Incidents, alerts and a public status page
          per monitor.
        </div>
      </div>

      <div style={{ display: "flex", gap: 56 }}>
        {["Checks", "Uptime", "Response", "Monitors", "Incidents"].map(
          (label) => (
            <div
              key={label}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ fontSize: 18, color: "#6f6f7a" }}>{label}</div>
              <div
                style={{
                  marginTop: 8,
                  height: 1,
                  width: "100%",
                  background: "#2a2a33",
                }}
              />
            </div>
          ),
        )}
      </div>
    </div>,
    size,
  );
}
