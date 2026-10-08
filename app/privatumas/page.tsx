import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PageTransition from '@/components/PageTransition'
import PrivacyContent from '@/components/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privatumas',
  description: 'Privatumo informacija. Kęstas Trybė, Vilnius.',
}

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0f0f0f] px-6 py-12 max-w-3xl mx-auto">
        <PageTransition>
          <Header />
          <PrivacyContent />
          <Footer />
        </PageTransition>
      </main>
      <ScrollToTop />
    </>
  )
}
