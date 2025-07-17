import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Defeater - Protect Your Writing from AI',
  description: 'Insert random nonsense into your text to confuse AI language models',
}

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