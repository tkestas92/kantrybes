import type { Metadata, Viewport } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import GridBackground from '@/components/GridBackground'
import { LangProvider } from '@/components/LangProvider'
import BpmProvider from '@/components/BpmProvider'

const pageTitle = 'Kęstas Trybė - Full stack ir AI/ML kūrėjas'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kantrybes.lt'),
  title: { absolute: pageTitle },
  description: 'Full-stack ir AI/ML kūrėjas iš Vilniaus. Projektai, kodas, kontaktai.',
  openGraph: { title: pageTitle },
  twitter: { title: pageTitle },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <body>
        <GridBackground />
        <GoogleAnalytics />
        <LangProvider>
          {children}
          <BpmProvider />
        </LangProvider>
      </body>
    </html>
  )
}
