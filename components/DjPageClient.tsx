'use client'

import NameAnimation from '@/components/NameAnimation'
import DjProfileSection from '@/components/DjProfileSection'
import DjBookBadge from '@/components/DjBookBadge'
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
    <>
      <div className="flex justify-end -mt-4 mb-8">
        <DjBookBadge />
      </div>

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
    </>
  )
}
