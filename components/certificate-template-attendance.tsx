import { forwardRef } from "react"
import { QRCodeDisplay } from "@/components/qr-code-display"
import type { Certificate } from "@/lib/types"

interface CertificateTemplateAttendanceProps {
  certificate: Certificate
  verificationUrl: string
}

/**
 * Certificate of Attendance template.
 *
 * This is a starting-point clone of CertificateTemplate (Completion). The field
 * overlays below are wired up and working — all that's left is:
 *
 *   1. Drop your Certificate of Attendance background image into /public
 *      (e.g. /public/TWP_2026_attendance.png)
 *   2. Update the `src` on the <img> below to point to it
 *   3. Nudge the top/left/right px values on each overlay so they line up
 *      with your new artwork (the current values match the Completion layout)
 *
 * Canvas: 1122 × 794 px (A4 landscape)
 */
export const CertificateTemplateAttendance = forwardRef<HTMLDivElement, CertificateTemplateAttendanceProps>(
  ({ certificate, verificationUrl }, ref) => {
    const issued = new Date(certificate.date_issued)
    const event_date = certificate.event_dates

    const ordinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"]
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }

    const day = issued.getDate()
    const month = issued.toLocaleDateString("en-US", { month: "long" })
    const year = issued.getFullYear()

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
            TODO: replace with the Certificate of Attendance artwork.
            Place the file in /public and update the src below.        */}
        <img
          src="/ATTENDANCE.png"
          alt="Certificate of Attendance template"
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
            Adjust top/left/right values to match the new artwork.
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
          For his/her attendance in the <strong>{certificate.event_attended}</strong> held on{" "}
          <strong>{event_date}</strong>.
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
          Given this <strong>{ordinal(day)}</strong> day of <strong>{month}</strong> <strong>{year}</strong>
          {certificate.venue && (
            <>
              {" "}
              at <strong>{certificate.venue}</strong>
            </>
          )}
          .
        </div>
      </div>
    )
  },
)

CertificateTemplateAttendance.displayName = "CertificateTemplateAttendance"
