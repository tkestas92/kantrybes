'use client'

import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

export default function DjBookBadge() {
  const { lang } = useLang()
  const labels = t[lang].dj

  return (
    <div className="w-full min-w-0 rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-2.5 text-sm leading-[1.4] text-white/60 sm:w-auto">
      <p className="min-w-0 text-left">
        {labels.badgePrefix}{' '}
        <strong className="font-semibold text-white">DJBook</strong>{' '}
        {labels.badgeSuffix}
      </p>
    </div>
  )
}
