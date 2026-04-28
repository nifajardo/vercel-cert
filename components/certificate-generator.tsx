"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CertificateTemplate } from "@/components/certificate-template"
import { QRCodeDisplay } from "@/components/qr-code-display"
import type { Certificate } from "@/lib/types"
import { FileArchive, Loader2, CheckCircle, Eye } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CertificateGeneratorProps {
  certificates: Certificate[]
}

export function CertificateGenerator({ certificates }: CertificateGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const getVerificationUrl = (certNumber: string) => `${baseUrl}/verify/${certNumber}`

  /** Mount a certificate, wait for paint + QR generation, then capture. */
  const mountAndCapture = async (cert: Certificate): Promise<HTMLCanvasElement | null> => {
    setSelectedCert(cert)
    // Give React time to render and QR code time to generate
    await new Promise((resolve) => setTimeout(resolve, 350))

    if (!certificateRef.current) {
      console.warn("Certificate ref not available for:", cert.certificate_number)
      return null
    }

    return html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      // Template uses only inline styles so stripping sheets has no visual impact,
      // but prevents html2canvas from choking on lab() colour syntax.
      onclone: (clonedDoc) => {
        clonedDoc
          .querySelectorAll<HTMLElement>('link[rel="stylesheet"], style')
          .forEach((el) => el.remove())
      },
    })
  }

  // ── Single-certificate exports ────────────────────────────────────────────

  const downloadSinglePDF = async (cert: Certificate) => {
    try {
      const canvas = await mountAndCapture(cert)
      if (!canvas) return

      const imgData = canvas.toDataURL("image/png")
      const w = canvas.width / 2
      const h = canvas.height / 2

      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [w, h] })
      pdf.addImage(imgData, "PNG", 0, 0, w, h)
      pdf.save(`certificate-${cert.certificate_number}.pdf`)
    } catch (err) {
      console.error("Single PDF export error:", err)
    } finally {
      setSelectedCert(null)
    }
  }

  const downloadSinglePNG = async (cert: Certificate) => {
    try {
      const canvas = await mountAndCapture(cert)
      if (!canvas) return

      const link = document.createElement("a")
      link.download = `certificate-${cert.certificate_number}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (err) {
      console.error("Single PNG export error:", err)
    } finally {
      setSelectedCert(null)
    }
  }

  // ── Batch export ──────────────────────────────────────────────────────────

  const downloadAllPDFs = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Use the first certificate's canvas dimensions to initialise the PDF.
    // Subsequent pages will match because CertificateTemplate has fixed dimensions.
    let pdf: jsPDF | null = null

    try {
      for (let i = 0; i < certificates.length; i++) {
        const cert = certificates[i]
        const canvas = await mountAndCapture(cert)

        if (canvas) {
          const imgData = canvas.toDataURL("image/png")
          const w = canvas.width / 2
          const h = canvas.height / 2

          if (!pdf) {
            pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [w, h] })
          } else {
            pdf.addPage([w, h], "landscape")
          }

          pdf.addImage(imgData, "PNG", 0, 0, w, h)
        }

        setProgress(((i + 1) / certificates.length) * 100)
      }

      pdf?.save(`certificates-batch-${Date.now()}.pdf`)
    } catch (err) {
      console.error("Batch PDF export error:", err)
    } finally {
      setIsGenerating(false)
      setSelectedCert(null)
      setProgress(0)
    }
  }

  if (certificates.length === 0) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Generated Certificates ({certificates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating PDF…</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button
              onClick={downloadAllPDFs}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileArchive className="h-4 w-4" />
              )}
              Download All as Single PDF
            </Button>

            <div className="rounded-md border overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <QRCodeDisplay
                        value={getVerificationUrl(cert.certificate_number)}
                        size={40}
                        className="rounded border"
                      />
                      <div>
                        <p className="font-medium">{cert.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cert.certificate_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* ── Preview dialog ── */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                       <DialogContent className="!w-[60vw] !h-[95vh] !max-w-none">
                          <DialogHeader>
                            <DialogTitle>Certificate Preview</DialogTitle>
                          </DialogHeader>
                          <div className="overflow-auto">
                            {/* Render without ref — preview only, no capture needed */}
                            <CertificateTemplate
                              certificate={cert}
                              verificationUrl={getVerificationUrl(cert.certificate_number)}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSinglePDF(cert)}
                        disabled={isGenerating}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSinglePNG(cert)}
                        disabled={isGenerating}
                      >
                        PNG
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/*
        ── Off-screen render target ─────────────────────────────────────────
        position: fixed keeps it out of the document flow regardless of scroll.
        Only mounts when a capture is in progress (selectedCert !== null).
      */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          transform: "scale(1)",
          transformOrigin: "top left",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        {selectedCert && (
          <CertificateTemplate
            ref={certificateRef}
            certificate={selectedCert}
            verificationUrl={getVerificationUrl(selectedCert.certificate_number)}
          />
        )}
      </div>
    </div>
  )
}
