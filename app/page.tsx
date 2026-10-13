'use client'

import Link from 'next/link'
import NameAnimation from '@/components/NameAnimation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

export default function Landing() {
  const { lang } = useLang()
  const labels = t[lang].landing

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header variant="landing" />
      <div className="flex w-full flex-1 flex-col">
        <main className="relative mx-auto -mt-8 flex min-h-full w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pt-8">
          <PageTransition>
            <div className="flex w-full flex-col items-center">
              <div className="mb-12">
                <NameAnimation />
              </div>
              <Link
                href="/dev"
                className="group mx-auto flex w-[216px] flex-col items-center gap-3 rounded-xl border border-[#252525] bg-[#161616] p-8 text-center transition-all hover:border-[#4afa8a]/30 hover:bg-[#1e1e1e]"
              >
                <span className="text-[15px] font-medium text-white">{labels.devTitle}</span>
                <span className="text-center text-[12px] text-white">{labels.devDesc}</span>
              </Link>
            </div>
          </PageTransition>
        </main>
      </div>
      <Footer variant="landing" />
    </div>
  )
}
