'use client'

import Link from 'next/link'
import { useLang } from '@/components/LangProvider'
import LangSwitcher from '@/components/LangSwitcher'
import { t } from '@/lib/translations'

export default function NotFound() {
  const { lang, setLang } = useLang()
  const copy = t[lang].notFound
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute top-6 right-6">
        <LangSwitcher lang={lang} onChange={setLang} />
      </div>
      <p className="text-[13px] text-white uppercase tracking-widest mb-4">404</p>
      <h1 className="text-2xl font-medium text-white mb-3">{copy.title}</h1>
      <p className="text-[14px] text-white mb-8">{copy.text}</p>
      <Link href="/" className="text-[13px] font-medium bg-[#4afa8a] text-black px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity">
        {copy.home}
      </Link>
    </main>
  )
}
