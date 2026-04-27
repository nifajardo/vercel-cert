import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Upload, Shield, FileText } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto py-16 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Certificate Verification System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate, manage, and verify certificates with QR codes. Secure, fast, and reliable.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verify Certificate</CardTitle>
              </div>
              <CardDescription>
                Scan a QR code or enter a certificate number to verify its authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Anyone can verify a certificate by scanning the QR code printed on it. The 
                verification page displays all certificate details and confirms its validity.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">How it works:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Scan the QR code on the certificate</li>
                  <li>You will be redirected to the verification page</li>
                  <li>View certificate details and verification status</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Generate Certificates</CardTitle>
              </div>
              <CardDescription>
                Bulk create certificates from a CSV file with automatic QR code generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a CSV file with participant data and generate professional certificates 
                with unique QR codes for each entry.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/certificates">
                  <FileText className="h-4 w-4 mr-2" />
                  Go to Certificate Generator
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">Secure Verification</p>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-primary">Instant</p>
            <p className="text-sm text-muted-foreground">QR Code Scanning</p>
          </div>
          <div className="text-center p-6 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-primary">PDF/PNG</p>
            <p className="text-sm text-muted-foreground">Download Options</p>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Unique certificate numbers for each certificate",
              "QR code for instant verification",
              "Download certificates as PDF or PNG",
              "Bulk certificate generation from CSV",
              "Professional certificate template design",
              "Secure database storage with Supabase",
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
