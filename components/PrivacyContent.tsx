'use client'

import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

function withLinks(text: string) {
  const parts = text.split(/(tkestas92@gmail.com|vdai\.lrv\.lt)/g)
  return parts.map((part, index) => {
    if (part === 'tkestas92@gmail.com') {
      return (
        <a key={index} href="mailto:tkestas92@gmail.com" className="text-[#4afa8a] hover:opacity-85">
          {part}
        </a>
      )
    }
    if (part === 'vdai.lrv.lt') {
      return (
        <a
          key={index}
          href="https://vdai.lrv.lt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4afa8a] hover:opacity-85"
        >
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export default function PrivacyContent() {
  const { lang } = useLang()
  const copy = t[lang].privacy

  return (
    <article>
      <h1 className="text-[28px] font-semibold tracking-tight text-white">{copy.title}</h1>
      <div className="mt-8 flex flex-col gap-8">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[16px] font-medium text-white">{section.heading}</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-white/75">{withLinks(section.body)}</p>
          </section>
        ))}
      </div>
    </article>
  )
}
