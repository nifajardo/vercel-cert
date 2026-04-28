"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CertificateTemplate } from "@/components/certificate-template"
import type { Certificate } from "@/lib/types"
import { FileImage, FileText, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface CertificateDownloadProps {
  certificate: Certificate
  verificationUrl: string
}

export function CertificateDownload({ certificate, verificationUrl }: CertificateDownloadProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState<"pdf" | "png" | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Wait for all resources (fonts, images, QR code) to be ready
  useEffect(() => {
    const checkReady = async () => {
      // Wait for document fonts
      await document.fonts.ready
      
      // Wait for template image to load
      const templateImg = document.querySelector('img[alt="Certificate template"]') as HTMLImageElement
      if (templateImg && !templateImg.complete) {
        await new Promise<void>((resolve) => {
          templateImg.onload = () => resolve()
          templateImg.onerror = () => resolve()
        })
      }
      
      // Wait for QR code image to load
      const qrImg = certificateRef.current?.querySelector('img[alt="QR Code"]') as HTMLImageElement
      if (qrImg && !qrImg.complete) {
        await new Promise<void>((resolve) => {
          qrImg.onload = () => resolve()
          qrImg.onerror = () => resolve()
        })
      }
      
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100))
      setIsReady(true)
    }

    checkReady()
  }, [certificate, verificationUrl])

  const capture = async () => {
    if (!certificateRef.current) throw new Error("No ref")

    await document.fonts.ready

    return html2canvas(certificateRef.current, {
      scale: 3, // 🔥 higher quality
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,

      width: 1122,
      height: 794,

      windowWidth: 1122,
      windowHeight: 794,

      scrollX: 0,
      scrollY: 0,

      onclone: (doc) => {
        doc.body.style.margin = "0"
      },
    })
  }

  const downloadAsPNG = async () => {
    setIsDownloading("png")
    try {
      const canvas = await capture()
      const link = document.createElement("a")
      link.download = `certificate-${certificate.certificate_number}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (err) {
      console.error("PNG export error:", err)
    } finally {
      setIsDownloading(null)
    }
  }

  const downloadAsPDF = async () => {
    setIsDownloading("pdf")
    try {
      const canvas = await capture()
      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1122, 794],
      })

      pdf.addImage(imgData, "PNG", 0, 0, 1122, 794)
      pdf.save(`certificate-${certificate.certificate_number}.pdf`)
    } catch (err) {
      console.error("PDF export error:", err)
    } finally {
      setIsDownloading(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* ── Download buttons ── */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={downloadAsPDF} disabled={isDownloading !== null || !isReady} className="gap-2">
          {isDownloading === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Download PDF
        </Button>

        <Button
          onClick={downloadAsPNG}
          disabled={isDownloading !== null || !isReady}
          variant="outline"
          className="gap-2"
        >
          {isDownloading === "png" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileImage className="h-4 w-4" />
          )}
          Download PNG
        </Button>
      </div>

      {/*
        ── Hidden render target ──────────────────────────────────────────────
        Positioned off-screen so it never affects layout but remains mounted
        and fully painted — html2canvas requires a live DOM node.
        The CertificateTemplate uses fixed pixel dimensions (1122 × 794) and
        100 % inline styles so the capture is resolution-independent.
      */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <CertificateTemplate
          ref={certificateRef}
          certificate={certificate}
          verificationUrl={verificationUrl}
        />
      </div>
    </div>
  )
}
