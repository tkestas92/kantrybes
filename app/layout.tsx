import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { LangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kantrybes.lt'),
  title: 'Kantrybės — Dev & DJ',
  description: 'Kęstas Trybė — full-stack developer and DJ Kantrybės from Vilnius.',
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
