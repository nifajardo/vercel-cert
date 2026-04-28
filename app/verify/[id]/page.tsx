import { createClient } from "@/lib/supabase/server"
import { CertificateTemplate } from "@/components/certificate-template"
import { CertificateDownload } from "@/components/certificate-download"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { Certificate } from "@/lib/types"

interface VerifyPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Verify Certificate - ${id}`,
    description: "Verify the authenticity of a certificate",
  }
}

async function getCertificate(certificateNumber: string): Promise<Certificate | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("certificate_number", certificateNumber)
    .single()

  if (error || !data) {
    return null
  }

  return data as Certificate
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { id } = await params
  const certificate = await getCertificate(id)
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000"
  const verificationUrl = `${baseUrl}/verify/${id}`

  if (!certificate) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#808080" }}>
        <Card className="w-full max-w-md border-2 border-destructive/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">Certificate Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The certificate with number <strong>{id}</strong> could not be found in our system.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check the certificate number and try again, or contact the issuing organization for assistance.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-6" style={{ backgroundColor: "#808080" }}>
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Certificate Verification</h1>
        <p className="text-gray-200">This certificate has been verified as authentic.</p>
      </div>

      <div className="w-full flex justify-center overflow-auto" >
        <CertificateTemplate certificate={certificate} verificationUrl={verificationUrl} />
      </div>

      

      <Button asChild variant="ghost" className="mt-4 bg-white/10 hover:bg-white/20 text-white">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </Button>
    </main>
  )
}
