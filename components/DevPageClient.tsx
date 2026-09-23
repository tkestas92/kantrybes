'use client'

import { Github, Linkedin, Mail, FileText } from 'lucide-react'
import type { Project } from '@/lib/db'
import ProjectGrid from '@/components/ProjectGrid'
import NameAnimation from '@/components/NameAnimation'
import CertificationSection from '@/components/CertificationSection'
import WaveCta from '@/components/WaveCta'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

type Props = {
  projects: Project[]
}

export default function DevPageClient({ projects }: Props) {
  const { lang } = useLang()
  const labels = t[lang].dev

  return (
    <>
      <section className="mb-12 w-full">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
          <div className="mb-4 flex w-full justify-center">
            <NameAnimation />
          </div>
          <p className="mb-6 max-w-lg text-[15px] leading-relaxed text-gray-500">{labels.bio}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href="https://github.com/tkestas92"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all"
            >
              <Github size={15} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kestas-trybe/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all"
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all"
            >
              <FileText size={15} /> {labels.cvButton}
            </a>
            <a
              href="mailto:tkestas92@gmail.com"
              className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all"
            >
              <Mail size={15} /> Email
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs text-gray-600 uppercase tracking-widest">{labels.projects}</span>
          <div className="flex-1 h-px bg-[#1e1e1e]" />
        </div>

        <ProjectGrid
          projects={projects}
          labels={{
            filters: t[lang].filters,
            projects: {
              filterAll: labels.allFilter,
              statusInProgress: labels.inProgress,
              statusShipped: labels.shipped,
              github: labels.github,
            },
            liveDemo: t[lang].liveDemo,
          }}
        />
      </section>

      <CertificationSection
        labels={{
          section: labels.certifications,
          button: labels.certificate,
          close: labels.close,
          items: labels.certItems,
        }}
      />
      <WaveCta lang={lang} />
    </>
  )
}
