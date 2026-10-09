'use client'

import { useState } from 'react'
import { ChevronDown, Mail } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

const LINK_CLASS =
  'text-[#4afa8a] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[#4afa8a]/60'

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]'

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

function HeroTitle({ text, highlight }: { text: string; highlight: string }) {
  const start = text.toLowerCase().indexOf(highlight.toLowerCase())
  if (start < 0) return <>{text}</>
  const end = start + highlight.length
  return (
    <>
      {text.slice(0, start)}
      <span className="text-[#4afa8a]">{text.slice(start, end)}</span>
      {text.slice(end)}
    </>
  )
}

export default function PrivacyContent() {
  const { lang } = useLang()
  const copy = t[lang].privacy
  const [open, setOpen] = useState<boolean[]>(() => copy.sections.map((_, index) => index === 0))
  const allOpen = open.length === copy.sections.length && open.every(Boolean)
  const highlight = lang === 'lt' ? 'tik tai' : 'only'

  function toggle(index: number) {
    setOpen((current) => current.map((value, item) => (item === index ? !value : value)))
  }

  function toggleAll() {
    setOpen(copy.sections.map(() => !allOpen))
  }

  return (
    <article>
      <header className="privacy-rise">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#4afa8a]">{copy.kicker}</p>
        <h1 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-tight text-white md:text-[48px]">
          <HeroTitle text={copy.heroTitle} highlight={highlight} />
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-white/70">{copy.heroSub}</p>
        <p className="mt-3 font-mono text-[12px] text-white/50">{copy.updated}</p>
      </header>

      <ul className="privacy-rise mt-8 flex flex-wrap gap-2" style={{ animationDelay: '60ms' }}>
        {copy.highlights.map((item) => (
          <li
            key={item}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#232323] bg-[#161616] px-3.5 py-1.5 text-[14px] text-white"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#4afa8a]" aria-hidden />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-3">
        {copy.sections.map((section, index) => {
          const isOpen = open[index] ?? false
          return (
            <section
              key={section.heading}
              className="privacy-rise rounded-2xl border border-[#232323] bg-[#161616] px-6 py-5 transition-colors duration-200 hover:border-[rgba(74,250,138,0.4)]"
              style={{ animationDelay: `${(index + 2) * 60}ms` }}
            >
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                  className={`flex w-full items-center justify-between gap-4 rounded-lg text-left ${FOCUS_RING}`}
                >
                  <span className="text-[16px] font-medium text-white">{section.heading}</span>
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={`shrink-0 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </h2>
              {isOpen ? (
                <p className="min-w-0 pt-3 text-[15px] leading-[1.7] text-[rgba(255,255,255,0.85)] [overflow-wrap:anywhere]">
                  {withLinks(section.body)}
                </p>
              ) : null}
            </section>
          )
        })}
      </div>

      <button
        type="button"
        onClick={toggleAll}
        className={`privacy-rise mt-4 text-[13px] text-white/80 underline decoration-transparent underline-offset-4 transition-colors hover:text-[#4afa8a] hover:decoration-[#4afa8a]/60 ${FOCUS_RING}`}
        style={{ animationDelay: `${(copy.sections.length + 2) * 60}ms` }}
      >
        {allOpen ? copy.collapseAll : copy.expandAll}
      </button>

      <div
        className="privacy-rise mt-8 flex flex-col gap-4 rounded-2xl border border-[#232323] bg-[#161616] p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: `${(copy.sections.length + 3) * 60}ms` }}
      >
        <div>
          <p className="text-[18px] text-white">{copy.contactTitle}</p>
          <p className="mt-1 text-[15px] text-white/70">{copy.contactNote}</p>
        </div>
        <a
          href="mailto:tkestas92@gmail.com"
          className={`inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-[#2a2a2a] px-4 py-2 text-[13px] text-white transition-all hover:border-[#4afa8a] hover:bg-[#0e2a1a] hover:text-[#4afa8a] sm:self-center ${FOCUS_RING}`}
        >
          <Mail size={14} aria-hidden />
          tkestas92@gmail.com
        </a>
      </div>
    </article>
  )
}
