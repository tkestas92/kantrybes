'use client'

import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

const LINK_CLASS =
  'text-[#4afa8a] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[#4afa8a]'

function withLinks(text: string) {
  const parts = text.split(/(tkestas92@gmail.com|vdai\.lrv\.lt)/g)
  return parts.map((part, index) => {
    if (part === 'tkestas92@gmail.com') {
      return (
        <a key={index} href="mailto:tkestas92@gmail.com" className={LINK_CLASS}>
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
          className={LINK_CLASS}
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
      <h1 className="text-[30px] font-semibold text-white md:text-[36px]">{copy.title}</h1>
      <p className="mt-2 text-[14px] text-white/60">{copy.updated}</p>

      {copy.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mt-10 text-[20px] font-semibold text-white">{section.heading}</h2>
          <p className="mt-2 text-[16px] leading-[1.7] text-[rgba(255,255,255,0.85)] [overflow-wrap:anywhere]">
            {withLinks(section.body)}
          </p>
        </section>
      ))}

      <p className="mt-10 text-[16px] leading-[1.7] text-[rgba(255,255,255,0.85)]">
        {copy.ask}{' '}
        <a href="mailto:tkestas92@gmail.com" className={LINK_CLASS}>
          tkestas92@gmail.com
        </a>
      </p>
    </article>
  )
}
