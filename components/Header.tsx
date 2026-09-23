'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import LangSwitcher from '@/components/LangSwitcher'

type Props = { current: 'dev' | 'dj' }

export default function Header({ current }: Props) {
  const { lang, setLang } = useLang()
  return (
    <header className="border-b border-[#1e1e1e] mb-8">
      <div className="flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-gray-400 transition-colors">
          <ArrowLeft size={13} /> kantrybes.lt
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1 text-[12px]">
            <Link href="/dev" className={`px-3 py-1.5 rounded-md transition-colors ${current === 'dev' ? 'text-[#4afa8a] bg-[#161616]' : 'text-gray-600 hover:text-gray-400'}`}>Dev</Link>
            <Link href="/dj" className={`px-3 py-1.5 rounded-md transition-colors ${current === 'dj' ? 'text-[#4afa8a] bg-[#161616]' : 'text-gray-600 hover:text-gray-400'}`}>DJ</Link>
          </nav>
          <LangSwitcher lang={lang} onChange={setLang} />
        </div>
      </div>
    </header>
  )
}
