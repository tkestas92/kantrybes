'use client'

import type { ReactNode } from 'react'
import { useConsent } from '@/components/ConsentProvider'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

type Props = {
  service: string
  href: string
  className?: string
  frameClassName?: string
  children: ReactNode
}

export default function ConsentEmbed({ service, href, className, frameClassName, children }: Props) {
  const { lang } = useLang()
  const { consent, ready, openSettings } = useConsent()
  const copy = t[lang].embed
  const allowed = ready && consent.thirdParty === true
  const frame = `relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#161616] ${frameClassName ?? ''}`

  if (allowed) {
    return (
      <div className={className}>
        <div className={frame}>
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={frame}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-[13px] font-medium text-white">{service}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-[13px] text-[#4afa8a] hover:opacity-85"
          >
            {copy.open.replace('{service}', service)}
          </a>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] leading-snug text-white/55">
        <button type="button" onClick={openSettings} className="bg-transparent underline underline-offset-2 hover:text-white">
          {copy.enable}
        </button>
      </p>
    </div>
  )
}
