import { getAllProjects } from '@/lib/db'
import DevPageClient from '@/components/DevPageClient'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export const dynamic = 'force-dynamic'

export default async function DevPage() {
  const projects = await getAllProjects()
  return (
    <>
      <main className="min-h-screen bg-[#0f0f0f] px-6 py-12 max-w-3xl mx-auto">
        <Header current="dev" />
        <DevPageClient projects={projects} />
        <Footer />
      </main>
      <ScrollToTop />
    </>
  )
}
