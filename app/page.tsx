'use client'

import Link from 'next/link'
import NameAnimation from '@/components/NameAnimation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContentColumn from '@/components/ContentColumn'
import PageTransition from '@/components/PageTransition'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

export default function Landing() {
  const { lang } = useLang()
  const labels = t[lang].landing

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="landing" />
      <ContentColumn center solid={false}>
        <PageTransition>
          <div className="flex w-full flex-col items-center">
            <div className="mb-12">
              <NameAnimation />
            </div>

            <Link
              href="/dev"
              className="group flex w-full max-w-xs flex-col items-center gap-3 rounded-xl border border-[#252525] bg-[#161616] p-8 transition-all hover:border-[#4afa8a]/30 hover:bg-[#1e1e1e]"
            >
              <span className="text-white font-medium text-[15px]">{labels.devTitle}</span>
              <span className="text-white text-[12px] text-center">{labels.devDesc}</span>
            </Link>
          </div>
        </PageTransition>
      </ContentColumn>
      <Footer variant="landing" />
    </div>
  )
}
