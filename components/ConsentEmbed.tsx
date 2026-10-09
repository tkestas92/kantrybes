'use client'

import { useState, type ReactNode } from 'react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

type Props = {
  service: string
  thumbnailUrl?: string | null
  className?: string
  frameClassName?: string
  children: ReactNode
}

export default function ConsentEmbed({
  service,
  thumbnailUrl,
  className,
  frameClassName,
  children,
}: Props) {
  const { lang } = useLang()
  const copy = t[lang].embed
  const [loaded, setLoaded] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const notice = copy.notice.replace('{service}', service)

  return (
    <div className={className}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#161616] ${frameClassName ?? ''}`}
      >
        {loaded ? (
          <div className="absolute inset-0">{children}</div>
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          >
            {thumbnailUrl && !thumbFailed ? (
              <img
                src={thumbnailUrl}
                alt=""
                onError={() => setThumbFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <span className="surface-solid relative rounded-md px-3 py-1 text-[13px] font-medium text-white">{service}</span>
            <span className="relative rounded-lg bg-[#4afa8a] px-4 py-2 text-[13px] font-medium text-black hover:opacity-85">
              {copy.play}
            </span>
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-white/55">{notice}</p>
    </div>
  )
}
