import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Kantrybės — Dev & DJ',
  description: 'Kęstas Trybė — full-stack developer ir DJ Kantrybės iš Vilniaus.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
