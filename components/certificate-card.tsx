import { QRCodeDisplay } from "@/components/qr-code-display"
import type { Certificate } from "@/lib/types"

interface CertificateCardProps {
  certificate: Certificate
  verificationUrl: string
}

export function CertificateCard({ certificate, verificationUrl }: CertificateCardProps) {
  const issued = new Date(certificate.date_issued)

  const day = issued.getDate()
  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }
  const month = issued.toLocaleDateString("en-US", { month: "long" })
  const year = issued.getFullYear()

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "900px",
        aspectRatio: "1.414 / 1",
        background: "#ffffff",
        fontFamily: "'Georgia', serif",
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        borderRadius: "4px",
      }}
    >
      {/* ── Bottom-left dark navy corner ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "28%",
          height: "28%",
          background: "#1a2457",
          clipPath: "polygon(0 100%, 100% 100%, 0 0)",
          zIndex: 1,
        }}
      />

      {/* ── Gold diagonal stripe (bottom-left area) ── */}
      <div
        style={{
          position: "absolute",
          bottom: "2%",
          left: "18%",
          width: "14%",
          height: "6px",
          background: "#f0a500",
          transform: "rotate(-38deg)",
          transformOrigin: "left center",
          zIndex: 2,
        }}
      />

      {/* ── Right-side decorative panel (light tan + arabesque watermark) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "22%",
          height: "100%",
          background: "linear-gradient(160deg, #f5e9c8 0%, #ede0b0 100%)",
          clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
          zIndex: 1,
          opacity: 0.55,
        }}
      />

      {/* ── Diagonal gold accent (top-right) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "18%",
          width: "4px",
          height: "48%",
          background: "#f0a500",
          transform: "rotate(20deg)",
          transformOrigin: "top right",
          zIndex: 3,
        }}
      />

      {/* ── Puzzle-piece watermark ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "320px",
          color: "rgba(26,36,87,0.04)",
          userSelect: "none",
          zIndex: 0,
          lineHeight: 1,
          fontFamily: "sans-serif",
        }}
      >
        ⬡
      </div>

      {/* ══════════════════════════════════════════
          CONTENT LAYER
      ══════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "5% 6% 4% 6%",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header row ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Left: org + title */}
          <div style={{ flex: 1, paddingRight: "4%" }}>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(9px, 1.3vw, 13px)",
                letterSpacing: "0.18em",
                color: "#1a2457",
                fontFamily: "'Arial', sans-serif",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Sibol-Pinoy Management Consultancy
            </p>
            <h1
              style={{
                margin: "2px 0 0",
                fontSize: "clamp(22px, 4.8vw, 52px)",
                lineHeight: 1.05,
                fontFamily: "'Georgia', serif",
                fontWeight: 900,
                color: "#1a2457",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
              }}
            >
              Certificate of<br />Completion
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "clamp(9px, 1.2vw, 13px)",
                color: "#444",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              is hereby presented to
            </p>
          </div>

          {/* Right: QR + cert number */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "100px" }}>
            <div
              style={{
                border: "3px solid #1a2457",
                padding: "4px",
                background: "#fff",
                borderRadius: "2px",
              }}
            >
              <QRCodeDisplay value={verificationUrl} size={90} />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(7px, 0.9vw, 10px)",
                fontWeight: 700,
                color: "#1a2457",
                fontFamily: "'Arial', sans-serif",
                textAlign: "center",
              }}
            >
              {certificate.certificate_number}
            </p>
          </div>
        </div>

        {/* ── Recipient name ── */}
        <div style={{ textAlign: "center", margin: "3% 0 1%" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(26px, 5.5vw, 60px)",
              fontFamily: "'Georgia', serif",
              fontWeight: 900,
              color: "#1a2457",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {certificate.full_name}
          </h2>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: "2px",
            background: "#1a2457",
            margin: "0 0 3%",
          }}
        />

        {/* ── Body text ── */}
        <div style={{ textAlign: "center", lineHeight: 1.7 }}>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(9px, 1.25vw, 13px)",
              color: "#222",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            For his/her active participation in the{" "}
            <strong>{certificate.event_attended}</strong> held on{" "}
            <strong>
              {issued.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </strong>
            .
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "clamp(9px, 1.25vw, 13px)",
              color: "#222",
              fontFamily: "'Arial', sans-serif",
            }}
          >
            This also certifies that he/she has satisfactorily completed all the workshop outputs which validates
            his/her achievement of the intended learning outcomes.
          </p>
        </div>

        {/* ── Given this day ── */}
        <p
          style={{
            textAlign: "center",
            margin: "3% 0 0",
            fontSize: "clamp(9px, 1.2vw, 13px)",
            color: "#222",
            fontFamily: "'Arial', sans-serif",
          }}
        >
          Given this{" "}
          <strong>{ordinal(day)}</strong> day of{" "}
          <strong>{month}</strong>{" "}
          <strong>{year}</strong>
          {certificate.venue ? (
            <> at <strong>{certificate.venue}</strong></>
          ) : null}
          .
        </p>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Signature block ── */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: "2%" }}>
          <div style={{ textAlign: "center" }}>
            {/* Signature line */}
            <div
              style={{
                width: "220px",
                height: "1px",
                background: "#1a2457",
                margin: "0 auto 4px",
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "clamp(9px, 1.2vw, 13px)",
                fontWeight: 700,
                color: "#1a2457",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              Dr. Ceazar Valerei E. Navarro
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(8px, 1.05vw, 11px)",
                color: "#444",
                fontFamily: "'Arial', sans-serif",
              }}
            >
              Founder and Principal Consultant
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
