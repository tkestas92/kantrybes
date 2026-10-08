import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { LangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kantrybes.lt'),
  title: 'Kęstas Trybė — Full-stack ir AI/ML kūrėjas',
  description: 'Full-stack ir AI/ML kūrėjas iš Vilniaus. Projektai, kodas, kontaktai.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <body>
        <GoogleAnalytics />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
