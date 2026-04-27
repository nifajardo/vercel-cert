import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QRCodeDisplay } from "@/components/qr-code-display"
import type { Certificate } from "@/lib/types"
import { CheckCircle, Calendar, Mail, Phone, Building, Award } from "lucide-react"

interface CertificateCardProps {
  certificate: Certificate
  verificationUrl: string
}

export function CertificateCard({ certificate, verificationUrl }: CertificateCardProps) {
  const formattedDate = new Date(certificate.date_issued).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="w-full max-w-2xl border-2 border-primary/20">
      <CardHeader className="text-center border-b bg-primary/5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Verified Certificate
          </Badge>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">
          {certificate.event_attended}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Certificate Number: {certificate.certificate_number}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-1">This is to certify that</p>
              <h2 className="text-2xl font-bold text-primary">{certificate.full_name}</h2>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{certificate.email}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Issued on {formattedDate}</span>
              </div>

              {certificate.affiliation && (
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{certificate.affiliation}</span>
                </div>
              )}

              {certificate.contact_number && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{certificate.contact_number}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{certificate.event_attended}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <QRCodeDisplay value={verificationUrl} size={120} className="rounded-lg border p-2 bg-white" />
            <p className="text-xs text-muted-foreground text-center">
              Scan to verify
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
