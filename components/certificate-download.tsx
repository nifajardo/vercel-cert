"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { CertificateTemplate } from "@/components/certificate-template"
import type { Certificate } from "@/lib/types"
import { Download, FileImage, FileText, Loader2 } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface CertificateDownloadProps {
  certificate: Certificate
  verificationUrl: string
}

export function CertificateDownload({ certificate, verificationUrl }: CertificateDownloadProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState<"pdf" | "png" | null>(null)

  const downloadAsImage = async () => {
    if (!certificateRef.current) return

    setIsDownloading("png")
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Remove all stylesheets to avoid lab() color parsing issues
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
          stylesheets.forEach((sheet) => sheet.remove())
        },
      })

      const link = document.createElement("a")
      link.download = `certificate-${certificate.certificate_number}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsDownloading(null)
    }
  }

  const downloadAsPDF = async () => {
    if (!certificateRef.current) return

    setIsDownloading("pdf")
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          // Remove all stylesheets to avoid lab() color parsing issues
          const stylesheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
          stylesheets.forEach((sheet) => sheet.remove())
        },
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      })

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save(`certificate-${certificate.certificate_number}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsDownloading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={downloadAsPDF}
          disabled={isDownloading !== null}
          className="gap-2"
        >
          {isDownloading === "pdf" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Download PDF
        </Button>
        <Button
          onClick={downloadAsImage}
          disabled={isDownloading !== null}
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

      {/* Hidden certificate template for rendering */}
      <div className="absolute -left-[9999px] -top-[9999px]">
        <CertificateTemplate
          ref={certificateRef}
          certificate={certificate}
          verificationUrl={verificationUrl}
        />
      </div>
    </div>
  )
}
