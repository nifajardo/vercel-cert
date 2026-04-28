export interface Certificate {
  id: string
  certificate_number: string
  full_name: string
  email: string
  date_issued: string
  event_attended: string
  venue: string | null
  contact_number: string | null
  created_at: string
  updated_at: string
}

export interface CertificateInput {
  full_name: string
  email: string
  date_issued: string
  event_attended: string
  venue?: string
  contact_number?: string
}
