import { forwardRef } from "react"
import { QRCodeDisplay } from "@/components/qr-code-display"
import type { Certificate } from "@/lib/types"

interface CertificateTemplateProps {
  certificate: Certificate
  verificationUrl: string
}

/**
 * Renders the Sibol-Pinoy certificate by overlaying all dynamic fields directly
 * on top of the official template image (public/certificate-template.png).
 *
 * Canvas: 1122 × 794 px  (A4 landscape — exactly half of the native 2245 × 1587 px image)
 *
 * Fields overlaid:
 *   • Full Name          – large centered block, mid-certificate
 *   • Event Name         – inline inside participation sentence
 *   • Date               – inline inside participation sentence
 *   • Venue              – inline inside "Given this…" line
 *   • Certificate Number – below QR code, top-right
 *   • QR Code            – top-right corner
 *
 * All styles are inline so html2canvas captures the full certificate faithfully
 * even after stripping external stylesheets.
 */
export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ certificate, verificationUrl }, ref) => {
    const issued = new Date(certificate.date_issued)

    const ordinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"]
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }

    const day      = issued.getDate()
    const month    = issued.toLocaleDateString("en-US", { month: "long" })
    const year     = issued.getFullYear()
    const longDate = issued.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Shared text style for body paragraphs
    const bodyText: React.CSSProperties = {
      position: "absolute",
      left: "50px",
      right: "178px",
      textAlign: "center",
      fontSize: "12.5px",
      color: "#1a1a1a",
      lineHeight: 1.75,
      fontFamily: "'Arial', sans-serif",
    }

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "1122px",
          height: "794px",
          overflow: "hidden",
          fontFamily: "'Arial', sans-serif",
          lineHeight: 1,
        }}
      >
        {/* ── Template background ─────────────────────────────────────────
            Place the original PNG at: /public/certificate-template.png   */}
        {/* <img
          src="/TWP_2026.png"
          alt="Certificate template"
          width={1122}
          height={794}
          style={{ position: "absolute", inset: 0, display: "block" }}
          crossOrigin="anonymous"
        /> */}
        {/* Background (IMPORTANT: use inline base64 or absolute URL) */}
        <img
          src="/TWP_2026.png"
          alt="Certificate template"
          width={1122}
          height={794}
          style={{
            position: "absolute",
            inset: 0,
            width: "1122px",
            height: "794px",
            objectFit: "cover",
          }}
          crossOrigin="anonymous"
        />
        {/* ═══════════════════════════════════════════════════════════════
            FIELD OVERLAYS  (absolute px on the 1122 × 794 canvas)
            Adjust top/left/right values if your template image differs.
        ═══════════════════════════════════════════════════════════════ */}

       {/* QR Code */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "38px",
            width: "140px",
            height: "140px",
            background: "#fff",
            color: "#110071",
            padding: "6px",
            boxSizing: "border-box",
          }}
        >
          <QRCodeDisplay value={verificationUrl} size={128} />
        </div>

        {/* Certificate Number */}
        <div
          style={{
            position: "absolute",
            top: "150px",
            right: "30px",
            width: "160px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: 700,
            color: "#000",
            letterSpacing: "0.03em",
            fontFamily: "Glacial Indifference, 'Arial', sans-serif",
          }}
        >
          {certificate.certificate_number}
        </div>

        {/* Full Name */}
        <div
          style={{
            position: "absolute",
            top: "270px",
            left: "100px",
            right: "100px",
            textAlign: "center",
            fontSize: "45px",
            fontWeight: 700,
            color: "#000",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontFamily: "'Georgia', serif",
          }}
        >
          {certificate.full_name}
        </div>

        {/* Participation Line */}
        <div
          style={{
            position: "absolute",
            top: "360px",
            left: "80px",
            right: "100px",
            textAlign: "center",
            fontSize: "21px",
            lineHeight: 1,
            fontFamily: "Montserrat, 'Arial', sans-serif",
          }}
        >
          For his/her active participation in the{" "}
          <strong>{certificate.event_attended}</strong> held on{" "}
          <strong>{longDate}</strong>.
        </div>

        {/* Description */}
        <div
          style={{
            position: "absolute",
            top: "410px",
            left: "80px",
            right: "100px",
            textAlign: "center",
            fontSize: "21px",
            lineHeight: 1,
          }}
        >
          This also certifies that he/she has satisfactorily completed all the workshop
          outputs which validates his/her achievement of the intended learning outcomes.
        </div>

        {/* Date + Venue */}
        <div
          style={{
            position: "absolute",
            top: "480px",
            left: "80px",
            right: "200px",
            textAlign: "center",
            fontSize: "21px",
          }}
        >
          Given this <strong>{ordinal(day)}</strong> day of{" "}
          <strong>{month}</strong> <strong>{year}</strong>
          {certificate.venue && (
            <>
              {" "}at <strong>{certificate.venue}</strong>
            </>
          )}
          .
        </div>
      </div>
    )
  },
)

CertificateTemplate.displayName = "CertificateTemplate"
