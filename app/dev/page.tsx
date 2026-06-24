import Link from 'next/link'
import { Github, Linkedin, Mail, FileText, ArrowLeft } from 'lucide-react'
import { getAllProjects } from '@/lib/db'
import ProjectGrid from '@/components/ProjectGrid'
import NameAnimation from '@/components/NameAnimation'

// Visada nuskaityt naujausius duomenis iš DB (ne cache'int statiškai)
export const dynamic = 'force-dynamic'

export default async function DevPage() {
  const projects = await getAllProjects()

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-6 py-12 max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-gray-400 transition-colors mb-8">
        <ArrowLeft size={13} /> kantrybes.lt
      </Link>

      {/* Hero */}
      <section className="mb-12 w-full">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <div className="mb-4 flex w-full justify-center">
            <NameAnimation />
          </div>
          <p className="mb-6 max-w-lg text-[15px] leading-relaxed text-gray-500">
            Full-stack developer ir AI/ML inžinierius iš Vilniaus.
            Kuriu mobilias aplikacijas, backend servisus ir machine learning sprendimus.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
          <a href="https://github.com/tkestas92" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all">
            <Github size={15} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/kestas-trybe/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all">
            <Linkedin size={15} /> LinkedIn
          </a>
          <a href="/cv.pdf" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all">
            <FileText size={15} /> CV
          </a>
          <a href="mailto:tkestas92@gmail.com"
            className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all">
            <Mail size={15} /> Email
          </a>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-gray-600 uppercase tracking-widest">Projektai</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>

        <ProjectGrid projects={projects} />
      </section>

      {/* CTA */}
      <section className="mt-12 p-6 bg-[#161616] border border-[#2a2a2a] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[15px] text-white font-medium">Ieškau full-stack arba AI/ML pozicijos</p>
          <p className="text-[13px] text-gray-500 mt-1">Vilnius · Atviras remote galimybėms</p>
        </div>
        <a href="mailto:tkestas92@gmail.com"
          className="text-[13px] font-medium bg-[#4afa8a] text-black px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity whitespace-nowrap">
          Susisiekti
        </a>
      </section>
    </main>
  )
}
