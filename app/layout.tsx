import type { Metadata, Viewport } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import GridBackground from '@/components/GridBackground'
import { GridPulseProvider } from '@/components/GridPulse'
import { LangProvider } from '@/components/LangProvider'
import { ConsentProvider } from '@/components/ConsentProvider'
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
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`,
          }}
        />
        <GridPulseProvider>
          <GridBackground />
          <div className="relative z-0">
            <LangProvider>
              <ConsentProvider>
                <GoogleAnalytics />
                {children}
                <BpmProvider />
              </ConsentProvider>
            </LangProvider>
          </div>
        </GridPulseProvider>
      </body>
    </html>
  )
}
