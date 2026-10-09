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
      <div className="flex min-h-screen flex-col bg-[#0f0f0f]">
        <Header innerClassName="mx-auto flex w-full max-w-[680px] items-center justify-between gap-4 px-4 py-4 md:px-6" />
        <main className="mx-auto w-full max-w-[680px] flex-1 px-4 md:px-6">
          <PrivacyContent />
        </main>
        <Footer innerClassName="mx-auto flex w-full max-w-[680px] flex-col items-center justify-between gap-4 px-4 pb-6 pt-6 text-[12px] text-white sm:flex-row md:px-6" />
      </div>
      <ScrollToTop />
    </>
  )
}
