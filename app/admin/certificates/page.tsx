"use client"

import { useState } from "react"
import { CSVUploader } from "@/components/csv-uploader"
import { DataPreviewTable } from "@/components/data-preview-table"
import { CertificateGenerator } from "@/components/certificate-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import type { Certificate, CertificateInput } from "@/lib/types"
import { Loader2, Upload, ArrowLeft, AlertCircle, CheckCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { nanoid } from "nanoid"

function generateCertificateNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = nanoid(6).toUpperCase()
  return `CERT-${timestamp}-${random}`
}

export default function AdminCertificatesPage() {
  const router = useRouter()
  const [parsedData, setParsedData] = useState<CertificateInput[]>([])
  const [generatedCertificates, setGeneratedCertificates] = useState<Certificate[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const handleDataParsed = (data: CertificateInput[]) => {
    setParsedData(data)
    setError(null)
    setSuccess(null)
    setGeneratedCertificates([])
  }

  const handleClear = () => {
    setParsedData([])
    setError(null)
    setSuccess(null)
    setGeneratedCertificates([])
  }

  const handleSubmit = async () => {
    if (parsedData.length === 0) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    // Generate certificate numbers and prepare data
    const certificatesWithNumbers = parsedData.map((cert) => ({
      ...cert,
      certificate_number: generateCertificateNumber(),
    }))

    try {
      const { data, error: insertError } = await supabase
        .from("certificates")
        .insert(certificatesWithNumbers)
        .select()

      if (insertError) {
        throw insertError
      }

      setGeneratedCertificates(data as Certificate[])
      setSuccess(`Successfully created ${data.length} certificates!`)
      setParsedData([])
    } catch (err) {
      console.error("Error inserting certificates:", err)
      setError(err instanceof Error ? err.message : "Failed to create certificates")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Certificate Generator</h1>
          <p className="text-muted-foreground mt-2">
            Upload a CSV file to bulk generate certificates with QR codes
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>
                Upload a CSV file with the following columns: full_name, email, date_issued,
                event_attended. Optional: venue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVUploader onDataParsed={handleDataParsed} onClear={handleClear} />
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <>
              <DataPreviewTable data={parsedData} />

              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Generate {parsedData.length} Certificates
                </Button>
              </div>
            </>
          )}

          <CertificateGenerator certificates={generatedCertificates} />
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">CSV Format Guide</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your CSV file should have the following structure:
          </p>
          <pre className="bg-background p-4 rounded-md text-sm overflow-x-auto border">
{`full_name,email,date_issued,event_attended,venue
John Doe,john@example.com,2024-01-15,Tech Summit 2024,San Jose City, Nueva Ecija
Jane Smith,jane@example.com,2024-01-15,Tech Summit 2024,Resorts World Manila`}
          </pre>
        </div>
      </div>
    </main>
  )
}
