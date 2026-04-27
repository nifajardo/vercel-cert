"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CertificateInput } from "@/lib/types"

interface CSVUploaderProps {
  onDataParsed: (data: CertificateInput[]) => void
  onClear: () => void
}

const REQUIRED_FIELDS = ["full_name", "email", "date_issued", "event_attended"]
const OPTIONAL_FIELDS = ["affiliation", "contact_number"]
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]

export function CSVUploader({ onDataParsed, onClear }: CSVUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateHeaders = (headers: string[]): string | null => {
    const normalizedHeaders = headers.map((h) => h.toLowerCase().trim().replace(/\s+/g, "_"))
    const missingRequired = REQUIRED_FIELDS.filter((field) => !normalizedHeaders.includes(field))

    if (missingRequired.length > 0) {
      return `Missing required columns: ${missingRequired.join(", ")}`
    }

    return null
  }

  const normalizeData = (rawData: Record<string, string>[]): CertificateInput[] => {
    return rawData.map((row) => {
      const normalizedRow: Record<string, string> = {}

      Object.entries(row).forEach(([key, value]) => {
        const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, "_")
        if (ALL_FIELDS.includes(normalizedKey)) {
          normalizedRow[normalizedKey] = value?.trim() || ""
        }
      })

      return {
        full_name: normalizedRow.full_name || "",
        email: normalizedRow.email || "",
        date_issued: normalizedRow.date_issued || "",
        event_attended: normalizedRow.event_attended || "",
        affiliation: normalizedRow.affiliation || undefined,
        contact_number: normalizedRow.contact_number || undefined,
      }
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      const file = acceptedFiles[0]

      if (!file) return

      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file")
        return
      }

      setFileName(file.name)

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || []
          const headerError = validateHeaders(headers)

          if (headerError) {
            setError(headerError)
            setFileName(null)
            return
          }

          const normalizedData = normalizeData(results.data as Record<string, string>[])

          if (normalizedData.length === 0) {
            setError("No valid data found in the CSV file")
            setFileName(null)
            return
          }

          onDataParsed(normalizedData)
        },
        error: (err) => {
          setError(`Error parsing CSV: ${err.message}`)
          setFileName(null)
        },
      })
    },
    [onDataParsed]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
  })

  const handleClear = () => {
    setFileName(null)
    setError(null)
    onClear()
  }

  return (
    <div className="space-y-4">
      {fileName ? (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-muted-foreground">File uploaded successfully</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? "Drop the CSV file here" : "Drag and drop a CSV file here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <p className="text-xs text-muted-foreground">
            Required columns: full_name, email, date_issued, event_attended
          </p>
          <p className="text-xs text-muted-foreground">
            Optional columns: affiliation, contact_number
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
