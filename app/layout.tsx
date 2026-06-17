import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kantrybės — DJ & Dev',
  description: 'Kęstas Trybė — DJ Kantrybės ir full-stack developer iš Vilniaus.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  )
}
