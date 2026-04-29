-- Create certificates table for storing certificate data
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_issued DATE NOT NULL,
  event_attended TEXT NOT NULL,
  venue TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on certificate_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);

-- Create an index on email for searching by email
CREATE INDEX IF NOT EXISTS idx_certificates_email ON certificates(email);
