'use client'

import NameAnimation from '@/components/NameAnimation'
import DjProfileSection from '@/components/DjProfileSection'
import PageHeader from '@/components/PageHeader'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'
import type { DjProfile } from '@/lib/djbook'

type Props = {
  profile: DjProfile | null
}

export default function DjPageClient({ profile }: Props) {
  const { lang } = useLang()
  const labels = t[lang].dj

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 max-w-3xl mx-auto">
      <PageHeader
        backLabel={labels.back}
        extra={
          <span className="text-[13px] text-gray-600 border border-[#2a2a2a] rounded-full px-3 py-1.5 ml-2">
            {labels.djbook}
          </span>
        }
      />

      {!profile && (
        <section className="mb-10">
          <div className="mb-4">
            <NameAnimation />
          </div>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-2 max-w-lg">{labels.fallbackBio}</p>
        </section>
      )}

      {profile ? (
        <DjProfileSection profile={profile} labels={labels} lang={lang} />
      ) : (
        <div className="bg-[#161616] border border-[#252525] rounded-xl px-5 py-4">
          <p className="text-[14px] text-gray-400">{labels.loadError}</p>
          <a
            href="mailto:kestas@kantrybes.lt"
            className="inline-block mt-4 text-[13px] font-medium bg-[#4afa8a] text-black px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
          >
            {labels.write}
          </a>
        </div>
      )}
    </main>
  )
}
