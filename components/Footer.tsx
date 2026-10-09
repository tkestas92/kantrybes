'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import ContactModal from '@/components/ContactModal'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'
import { BpmTrigger } from '@/components/useTripleTap'

export default function Footer() {
  const year = new Date().getFullYear()
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  return (
    <>
    <footer className="mt-16 pt-6 border-t border-[#1e1e1e] bg-[#0f0f0f] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white">
      <div className="flex max-w-full flex-wrap items-center justify-center sm:justify-start">
        <p className="whitespace-nowrap">
          <BpmTrigger>© {year} Kęstas Trybė</BpmTrigger>
        </p>
        <Link href="/privatumas" className="inline-flex items-center whitespace-nowrap hover:text-[#4afa8a] transition-colors">
          <span aria-hidden="true" className="mx-3 text-white">·</span>
          {t[lang].footer.privacy}
        </Link>
      </div>
      <div className="flex max-w-full flex-wrap items-center justify-center gap-4">
        <a href="https://github.com/tkestas92" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <Github size={13} /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/kestas-trybe/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <Linkedin size={13} /> LinkedIn
        </a>
        <button type="button" onClick={() => setOpen(true)} className="hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <Mail size={13} /> Email
        </button>
        <Link href="/dj" className="hover:text-[#4afa8a] transition-colors">
          DJ profilis →
        </Link>
      </div>
    </footer>
    <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
