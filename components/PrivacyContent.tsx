'use client'

import { Check, Mail } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

const LINK_CLASS =
  'text-[#4afa8a] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[#4afa8a]/60'

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
    <article className="pt-8">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#4afa8a]">{copy.kicker}</p>
      <h1 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-tight text-white md:text-[44px]">
        {copy.title}
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-white/70">{copy.intro}</p>
      <p className="mt-3 font-mono text-[12px] text-white/50">{copy.updated}</p>

      <ul className="mt-10 flex flex-col gap-3 rounded-2xl border border-[#232323] bg-[#161616] p-6">
        {copy.highlights.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-white">
            <Check size={16} strokeWidth={2.25} className="mt-0.5 shrink-0 text-[#4afa8a]" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10">
        {copy.sections.map((section, index) => (
          <section
            key={section.heading}
            className="privacy-rise grid grid-cols-1 gap-3 border-t border-[#232323] py-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 md:py-10"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div>
              <p className="font-mono text-[12px] text-[#4afa8a]">{String(index + 1).padStart(2, '0')}</p>
              <h2 className="mt-1 text-[16px] font-medium leading-snug text-white">{section.heading}</h2>
            </div>
            <p className="min-w-0 text-[16px] leading-[1.7] text-[rgba(255,255,255,0.85)] [overflow-wrap:anywhere]">
              {withLinks(section.body)}
            </p>
          </section>
        ))}
      </div>

      <div className="privacy-rise border-t border-[#232323] pt-10" style={{ animationDelay: '280ms' }}>
        <p className="text-[16px] text-white">{copy.contactPrompt}</p>
        <a
          href="mailto:tkestas92@gmail.com"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-4 py-2 text-[13px] text-white transition-all hover:border-[#4afa8a] hover:bg-[#0e2a1a] hover:text-[#4afa8a]"
        >
          <Mail size={14} aria-hidden />
          tkestas92@gmail.com
        </a>
      </div>
    </article>
  )
}
