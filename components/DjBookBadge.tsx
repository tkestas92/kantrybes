'use client'

import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

export default function DjBookBadge() {
  const { lang } = useLang()
  const labels = t[lang].dj

  return (
    <div className="flex w-full min-w-0 items-start gap-2 rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-[11px] leading-[1.4] text-white sm:w-auto sm:items-center sm:rounded-full sm:px-3 sm:py-1.5">
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center text-[14px] leading-none" aria-hidden="true">
        📱
      </span>
      <p className="min-w-0 text-left text-white">
        {labels.badgePrefix}{' '}
        <strong className="font-semibold text-white">DJBook</strong>{' '}
        {labels.badgeSuffix}
      </p>
    </div>
  )
}
