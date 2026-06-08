import { ImageResponse } from "next/og";
import { nicheConfig } from "@/lib/niche.config";

// Next.js auto-registers this as the site-wide default og:image.
export const alt = `${nicheConfig.siteNaam} — ${nicheConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #dbeafe 100%)",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "28px",
            fontWeight: 600,
            color: nicheConfig.accentKleur,
            letterSpacing: "-0.01em",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "9999px",
              background: nicheConfig.accentKleur,
            }}
          />
          {nicheConfig.domein}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              maxWidth: "1000px",
            }}
          >
            {nicheConfig.tagline}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "32px",
              fontWeight: 500,
              color: "#475569",
              lineHeight: 1.3,
              maxWidth: "960px",
            }}
          >
            {`Vergelijk gecertificeerde ${nicheConfig.naamMeervoud} in Nederland.`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "24px",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex" }}>Gratis offertes vergelijken</div>
          <div
            style={{
              display: "flex",
              padding: "14px 28px",
              background: nicheConfig.accentKleur,
              color: "white",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "26px",
            }}
          >
            {nicheConfig.siteNaam}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
