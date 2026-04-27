"use client"

import { forwardRef, useEffect, useState } from "react"
import QRCode from "qrcode"
import type { Certificate } from "@/lib/types"

interface CertificateTemplateProps {
  certificate: Certificate
  verificationUrl: string
}

// Inline QR code component for html2canvas compatibility
function InlineQRCode({ value, size = 80 }: { value: string; size?: number }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQR()
  }, [value, size])

  if (!qrDataUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <span style={{ color: "#9ca3af", fontSize: "12px" }}>Loading...</span>
      </div>
    )
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      width={size}
      height={size}
      style={{ border: "1px solid #e5e7eb", borderRadius: "4px" }}
    />
  )
}

export const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ certificate, verificationUrl }, ref) => {
    const formattedDate = new Date(certificate.date_issued).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Using inline styles with hex colors for html2canvas compatibility
    return (
      <div
        ref={ref}
        style={{
          width: "800px",
          height: "600px",
          backgroundColor: "#ffffff",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            inset: "16px",
            border: "4px solid #b45309",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "2px solid #d97706",
            borderRadius: "8px",
          }}
        />

        {/* Corner decorations */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            width: "64px",
            height: "64px",
            borderLeft: "4px solid #b45309",
            borderTop: "4px solid #b45309",
            borderRadius: "8px 0 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "32px",
            width: "64px",
            height: "64px",
            borderRight: "4px solid #b45309",
            borderTop: "4px solid #b45309",
            borderRadius: "0 8px 0 0",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            width: "64px",
            height: "64px",
            borderLeft: "4px solid #b45309",
            borderBottom: "4px solid #b45309",
            borderRadius: "0 0 0 8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "32px",
            width: "64px",
            height: "64px",
            borderRight: "4px solid #b45309",
            borderBottom: "4px solid #b45309",
            borderRadius: "0 0 8px 0",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 64px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color: "#92400e",
                letterSpacing: "0.05em",
                marginBottom: "8px",
              }}
            >
              CERTIFICATE
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#b45309",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              of Participation
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "192px",
              height: "2px",
              background: "linear-gradient(to right, transparent, #b45309, transparent)",
              marginBottom: "24px",
            }}
          />

          {/* Introduction */}
          <p style={{ color: "#4b5563", fontSize: "18px", marginBottom: "16px" }}>
            This is to certify that
          </p>

          {/* Name */}
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {certificate.full_name}
          </h2>

          {/* Affiliation */}
          {certificate.affiliation && (
            <p
              style={{
                color: "#4b5563",
                fontSize: "16px",
                marginBottom: "16px",
                fontStyle: "italic",
              }}
            >
              {certificate.affiliation}
            </p>
          )}

          {/* Event */}
          <p style={{ color: "#4b5563", fontSize: "16px", marginBottom: "8px" }}>
            has successfully participated in
          </p>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#92400e",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            {certificate.event_attended}
          </h3>

          {/* Date */}
          <p style={{ color: "#4b5563", fontSize: "16px", marginBottom: "32px" }}>
            Issued on {formattedDate}
          </p>

          {/* Footer with QR Code */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                Certificate No:
              </p>
              <p style={{ fontSize: "14px", fontFamily: "monospace", color: "#374151" }}>
                {certificate.certificate_number}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <InlineQRCode value={verificationUrl} size={80} />
              <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                Scan to verify
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  width: "128px",
                  borderTop: "1px solid #9ca3af",
                  marginBottom: "4px",
                }}
              />
              <p style={{ fontSize: "14px", color: "#4b5563" }}>Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

CertificateTemplate.displayName = "CertificateTemplate"
