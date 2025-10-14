import type { Metadata } from 'next'
import './globals.css'

// TODO: Import and configure font

// TODO: Define metadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
