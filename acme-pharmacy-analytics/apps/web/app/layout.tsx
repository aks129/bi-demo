import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ACME Pharmacy Analytics',
  description: 'Sigma-class analytics demo for pharmacy products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
