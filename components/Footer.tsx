'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'
import ContactModal from '@/components/ContactModal'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'
import { BpmTrigger } from '@/components/useTripleTap'

type Props = { innerClassName?: string; variant?: 'landing' }

const DEFAULT_INNER = 'mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 px-6 pb-6 pt-6 text-[12px] text-white sm:flex-row'
const LANDING_INNER = 'mx-auto flex w-full max-w-3xl items-center justify-center px-6 pb-6 pt-6 text-[12px] text-white'

export default function Footer({ innerClassName, variant }: Props) {
  const year = new Date().getFullYear()
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const onDj = usePathname() === '/dj'
  const landing = variant === 'landing'
  return (
    <>
    <footer className="mt-16 w-full border-t border-[#262626] bg-[var(--surface-solid)]">
    <div className={innerClassName ?? (landing ? LANDING_INNER : DEFAULT_INNER)}>
      <div className={`flex max-w-full flex-wrap items-center justify-center${landing ? '' : ' sm:justify-start'}`}>
        <p className="whitespace-nowrap">
          <BpmTrigger>© {year} Kęstas Trybė</BpmTrigger>
        </p>
        <Link href="/privatumas" className="inline-flex items-center whitespace-nowrap hover:text-[#4afa8a] transition-colors">
          <span aria-hidden="true" className="mx-3 text-white">·</span>
          {t[lang].footer.privacy}
        </Link>
      </div>
      {landing ? null : (
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
        <Link href={onDj ? '/dev' : '/dj'} className="hover:text-[#4afa8a] transition-colors">
          {onDj ? 'Dev →' : 'DJ profilis →'}
        </Link>
      </div>
      )}
    </div>
    </footer>
    {landing ? null : <ContactModal open={open} onClose={() => setOpen(false)} />}
    </>
  )
}
