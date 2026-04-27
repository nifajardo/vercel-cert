"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CertificateTemplate } from "@/components/certificate-template"
import { QRCodeDisplay } from "@/components/qr-code-display"
import type { Certificate } from "@/lib/types"
import { Download, FileArchive, Loader2, CheckCircle, Eye } from "lucide-react"
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

  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : ""

  const getVerificationUrl = (certNumber: string) => `${baseUrl}/verify/${certNumber}`

  const downloadSinglePDF = async (cert: Certificate) => {
    setSelectedCert(cert)
    
    // Wait for render and QR code generation
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!certificateRef.current) {
      console.log("[v0] Certificate ref not available")
      setSelectedCert(null)
      return
    }

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
    pdf.save(`certificate-${cert.certificate_number}.pdf`)
    
    setSelectedCert(null)
  }

  const downloadSinglePNG = async (cert: Certificate) => {
    setSelectedCert(cert)
    
    // Wait for render and QR code generation
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!certificateRef.current) {
      console.log("[v0] Certificate ref not available")
      setSelectedCert(null)
      return
    }

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
    link.download = `certificate-${cert.certificate_number}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
    
    setSelectedCert(null)
  }

  const downloadAllPDFs = async () => {
    setIsGenerating(true)
    setProgress(0)

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [800, 600],
    })

    for (let i = 0; i < certificates.length; i++) {
      const cert = certificates[i]
      setSelectedCert(cert)
      
      // Wait for render and QR code generation
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (certificateRef.current) {
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
        
        if (i > 0) {
          pdf.addPage([canvas.width / 2, canvas.height / 2], "landscape")
        }
        
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2)
      }

      setProgress(((i + 1) / certificates.length) * 100)
    }

    pdf.save(`certificates-batch-${Date.now()}.pdf`)
    setIsGenerating(false)
    setSelectedCert(null)
    setProgress(0)
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
                  <span>Generating PDF...</span>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Certificate Preview</DialogTitle>
                          </DialogHeader>
                          <div className="overflow-auto">
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

      {/* Hidden certificate template for rendering */}
      <div className="absolute -left-[9999px] -top-[9999px]">
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
