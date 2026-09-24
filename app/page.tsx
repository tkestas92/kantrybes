'use client'

import Link from 'next/link'
import NameAnimation from '@/components/NameAnimation'
import LangSwitcher from '@/components/LangSwitcher'
import PageTransition from '@/components/PageTransition'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

export default function Landing() {
  const { lang, setLang } = useLang()
  const labels = t[lang].landing

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 relative">
      <div className="absolute top-6 right-6">
        <LangSwitcher lang={lang} onChange={setLang} />
      </div>

      <PageTransition>
        <div className="flex w-full flex-col items-center">
          <div className="mb-12">
            <NameAnimation />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            <Link
              href="/dev"
              className="group bg-[#161616] border border-[#252525] rounded-xl p-8 flex flex-col items-center gap-3 hover:border-[#4afa8a]/30 hover:bg-[#1e1e1e] transition-all"
            >
              <span className="text-3xl">💻</span>
              <span className="text-white font-medium text-[15px]">{labels.devTitle}</span>
              <span className="text-gray-500 text-[12px] text-center">{labels.devDesc}</span>
            </Link>

            <Link
              href="/dj"
              className="group bg-[#161616] border border-[#252525] rounded-xl p-8 flex flex-col items-center gap-3 hover:border-[#4afa8a]/30 hover:bg-[#1e1e1e] transition-all"
            >
              <span className="text-3xl">🎧</span>
              <span className="text-white font-medium text-[15px]">{labels.djTitle}</span>
              <span className="text-gray-500 text-[12px] text-center">{labels.djDesc}</span>
            </Link>
          </div>
        </div>
      </PageTransition>
    </main>
  )
}
