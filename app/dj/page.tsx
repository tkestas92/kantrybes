import type { Metadata } from 'next'
import DjPageClient from '@/components/DjPageClient'
import { getPublicDjProfile } from '@/lib/djbook'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PageTransition from '@/components/PageTransition'
import ContentColumn from '@/components/ContentColumn'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Kantrybės — DJ Vilniuje',
  description: 'DJ paslaugos ir renginių įgarsinimas Vilniuje.',
}

export default async function DjPage() {
  const profile = await getPublicDjProfile('kantrybes')
  return (
    <div className="flex min-h-screen flex-col">
      <Header current="dj" />
      <ContentColumn connectFooter>
        <PageTransition>
          <DjPageClient profile={profile} />
        </PageTransition>
      </ContentColumn>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
