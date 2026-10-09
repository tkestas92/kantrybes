import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PrivacyContent from '@/components/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privatumo politika',
  description: 'Privatumo informacija. Kęstas Trybė, Vilnius.',
}

export default function PrivacyPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0f0f0f] px-4 py-12 md:px-6">
        <div className="mx-auto w-full max-w-[680px]">
          <Header />
          <PrivacyContent />
          <Footer />
        </div>
      </main>
      <ScrollToTop />
    </>
  )
}
