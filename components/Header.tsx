'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import LangSwitcher from '@/components/LangSwitcher'

type Props = {
  current?: 'dev' | 'dj'
  innerClassName?: string
  variant?: 'landing'
}

const DEFAULT_INNER = 'mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-6 py-4'

export default function Header({ current, innerClassName, variant }: Props) {
  const { lang, setLang } = useLang()
  const landing = variant === 'landing'
  return (
    <header className="relative z-10 mb-8 w-full border-b border-[#262626] bg-[var(--surface-solid)]">
      <div className={innerClassName ?? DEFAULT_INNER}>
        {landing ? null : (
          <Link href="/" className="inline-flex items-center gap-1.5 bg-[var(--surface-solid)] text-[12px] text-white hover:text-gray-400 transition-colors">
            <ArrowLeft size={13} /> kantrybes.lt
          </Link>
        )}
        <div className={`flex items-center gap-4${landing ? ' ml-auto min-h-[30px]' : ''}`}>
          {landing ? null : (
            <nav className="flex items-center gap-1 bg-[var(--surface-solid)] text-[12px]">
              <Link href="/dev" className={`px-3 py-1.5 rounded-md transition-colors ${current === 'dev' ? 'text-[#4afa8a] bg-[var(--surface-card)]' : 'bg-[var(--surface-solid)] text-white hover:text-gray-400'}`}>Dev</Link>
              <Link href="/dj" className={`px-3 py-1.5 rounded-md transition-colors ${current === 'dj' ? 'text-[#4afa8a] bg-[var(--surface-card)]' : 'bg-[var(--surface-solid)] text-white hover:text-gray-400'}`}>DJ</Link>
            </nav>
          )}
          <LangSwitcher lang={lang} onChange={setLang} />
        </div>
      </div>
    </header>
  )
}
