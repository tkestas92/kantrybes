import type { Metadata } from 'next'
import DjPageClient from '@/components/DjPageClient'
import { getPublicDjProfile } from '@/lib/djbook'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PageTransition from '@/components/PageTransition'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Kantrybės — DJ Vilniuje',
  description: 'DJ paslaugos ir renginių įgarsinimas Vilniuje.',
}

export default async function DjPage() {
  const profile = await getPublicDjProfile('kantrybes')
  return (
    <>
      <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 max-w-3xl mx-auto">
        <PageTransition>
          <Header current="dj" />
          <DjPageClient profile={profile} />
          <Footer />
        </PageTransition>
      </main>
      <ScrollToTop />
    </>
  )
}
