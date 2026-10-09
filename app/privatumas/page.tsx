import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ContentColumn from '@/components/ContentColumn'
import PrivacyContent from '@/components/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privatumo politika',
  description: 'Privatumo informacija. Kęstas Trybė, Vilnius.',
}

export default function PrivacyPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <ContentColumn connectFooter>
          <PrivacyContent />
        </ContentColumn>
        <Footer />
      </div>
      <ScrollToTop />
    </>
  )
}
