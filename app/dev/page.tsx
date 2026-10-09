import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/db'
import DevPageClient from '@/components/DevPageClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PageTransition from '@/components/PageTransition'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kęstas Trybė — Full-stack Developer & AI/ML Engineer',
  description: 'Full-stack ir AI/ML kūrėjas iš Vilniaus. Projektai, kodas, kontaktai.',
}

export default async function DevPage() {
  const projects = await getAllProjects()
  return (
    <div className="flex min-h-screen flex-col">
      <Header current="dev" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6">
        <PageTransition>
          <DevPageClient projects={projects} />
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
