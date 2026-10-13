'use client'

import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

export default function DjBookBadge() {
  const { lang } = useLang()
  const labels = t[lang].dj

  return (
    <span className="text-[11px] text-white border border-[#2a2a2a] bg-[#0f0f0f] rounded-full px-3 py-1.5 flex items-center gap-1.5">
      <span>📱</span>
      <span className="text-white">{labels.badgePrefix}</span>
      <span className="text-white font-medium">DJBook</span>
      <span className="text-white">{labels.badgeSuffix}</span>
    </span>
  )
}
