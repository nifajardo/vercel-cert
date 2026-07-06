"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CertificateGenerator } from "@/components/certificate-generator"
import { createClient } from "@/lib/supabase/client"
import type { Certificate, CertificateType } from "@/lib/types"
import { Loader2, Search, RefreshCw, AlertCircle, FileText } from "lucide-react"

export function AttendeeManagement() {
  const [attendees, setAttendees] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [certificateType, setCertificateType] = useState<CertificateType>("completion")

  // Certificates currently queued up for the generator/preview panel below.
  const [toGenerate, setToGenerate] = useState<Certificate[]>([])
  const [generateType, setGenerateType] = useState<CertificateType>("completion")

  const fetchAttendees = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError
      setAttendees((data as Certificate[]) ?? [])
    } catch (err) {
      console.error("Error fetching attendees:", err)
      setError(err instanceof Error ? err.message : "Failed to load attendees")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendees()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return attendees
    return attendees.filter((a) =>
      [a.full_name, a.email, a.event_attended, a.certificate_number, a.venue ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
  }, [attendees, search])

  const allFilteredSelected = filtered.length > 0 && filtered.every((a) => selectedIds.has(a.id))
  const someFilteredSelected = filtered.some((a) => selectedIds.has(a.id))

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  const toggleAllFiltered = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const a of filtered) {
        if (checked) next.add(a.id)
        else next.delete(a.id)
      }
      return next
    })
  }

  const handleGenerate = () => {
    const selected = attendees.filter((a) => selectedIds.has(a.id))
    setToGenerate(selected)
    setGenerateType(certificateType)
  }

  const selectedCount = selectedIds.size

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="text-lg">Existing Attendees</CardTitle>
              <CardDescription>
                Select attendees below and choose which certificate to generate for them.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{attendees.length} total</Badge>
              <Button variant="outline" size="sm" onClick={fetchAttendees} disabled={isLoading} className="gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filter */}
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name, email, event, or cert #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allFilteredSelected ? true : someFilteredSelected ? "indeterminate" : false}
                      onCheckedChange={(checked) => toggleAllFiltered(checked === true)}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Certificate #</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Venue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                      Loading attendees...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No attendees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id} data-state={selectedIds.has(a.id) ? "selected" : undefined}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(a.id)}
                          onCheckedChange={(checked) => toggleOne(a.id, checked === true)}
                          aria-label={`Select ${a.full_name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{a.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{a.email}</TableCell>
                      <TableCell className="text-muted-foreground">{a.certificate_number}</TableCell>
                      <TableCell>{a.event_attended}</TableCell>
                      <TableCell>{a.date_issued}</TableCell>
                      <TableCell className="text-muted-foreground">{a.venue || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Certificate type + generate action */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
            <p className="text-sm text-muted-foreground">
              {selectedCount} attendee{selectedCount === 1 ? "" : "s"} selected
            </p>
            <div className="flex items-center gap-3">
              <Select value={certificateType} onValueChange={(v) => setCertificateType(v as CertificateType)}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Certificate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completion">Certificate of Completion</SelectItem>
                  <SelectItem value="attendance">Certificate of Attendance</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleGenerate} disabled={selectedCount === 0} className="gap-2">
                <FileText className="h-4 w-4" />
                Generate {selectedCount > 0 ? `(${selectedCount})` : ""}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CertificateGenerator certificates={toGenerate} certificateType={generateType} />
    </div>
  )
}
