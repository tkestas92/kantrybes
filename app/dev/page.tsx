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
  description:
    'Full-stack ir AI/ML projektai iš Vilniaus — mobilios aplikacijos, backend servisai, machine learning sprendimai.',
}

export default async function DevPage() {
  const projects = await getAllProjects()
  return (
    <>
      <main className="min-h-screen bg-[#0f0f0f] px-6 py-12 max-w-3xl mx-auto">
        <PageTransition>
          <Header current="dev" />
          <DevPageClient projects={projects} />
          <Footer />
        </PageTransition>
      </main>
      <ScrollToTop />
    </>
  )
}
