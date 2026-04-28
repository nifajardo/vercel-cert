"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

interface QRCodeDisplayProps {
  value: string
  size?: number
  className?: string
}

export function QRCodeDisplay({ value, size = 128, className }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: "#110071",
            light: "#ffffff",
          },
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQR()
  }, [value, size])

  if (!qrDataUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-muted/50 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-muted-foreground text-xs">Loading...</span>
      </div>
    )
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      width={size}
      height={size}
      className={className}
    />
  )
}
