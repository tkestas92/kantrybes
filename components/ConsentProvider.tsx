'use client'

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangProvider'
import {
  clearAnalyticsCookies,
  denyAnalyticsConsent,
  EMPTY_CONSENT,
  readConsent,
  writeConsent,
  type ConsentRecord,
} from '@/lib/consent'
import { t } from '@/lib/translations'

type ConsentContextValue = {
  consent: ConsentRecord
  ready: boolean
  accept: () => void
  decline: () => void
  openSettings: () => void
}

const ConsentCtx = createContext<ConsentContextValue>({
  consent: EMPTY_CONSENT,
  ready: false,
  accept: () => {},
  decline: () => {},
  openSettings: () => {},
})

const CHOICE_BUTTON =
  'w-full rounded-lg border border-[#333] bg-[#0f0f0f] px-4 py-2 text-center text-[13px] font-medium text-white hover:bg-[#1e1e1e]'

export function useConsent() {
  return useContext(ConsentCtx)
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLang()
  const copy = t[lang].consent
  const [consent, setConsent] = useState<ConsentRecord>(EMPTY_CONSENT)
  const [ready, setReady] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
  }, [])

  const showBanner = ready && consent.thirdParty === null

  useEffect(() => {
    const root = document.documentElement
    if (!showBanner || !bannerRef.current) {
      root.style.removeProperty('--consent-bar')
      return
    }
    const element = bannerRef.current
    const update = () => root.style.setProperty('--consent-bar', `${element.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--consent-bar')
    }
  }, [showBanner, lang])

  useEffect(() => {
    if (!settingsOpen) return
    const previouslyFocused = document.activeElement
    returnFocus.current = previouslyFocused instanceof HTMLElement ? previouslyFocused : null
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSettingsOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      returnFocus.current?.focus()
    }
  }, [settingsOpen])

  function accept() {
    writeConsent(true)
    window.location.reload()
  }

  function decline() {
    writeConsent(false)
    clearAnalyticsCookies()
    denyAnalyticsConsent()
    window.location.reload()
  }

  function openSettings() {
    setSettingsOpen(true)
  }

  const status =
    consent.thirdParty === true ? copy.accepted : consent.thirdParty === false ? copy.declined : copy.unset

  return (
    <ConsentCtx.Provider value={{ consent, ready, accept, decline, openSettings }}>
      {children}
      {showBanner ? (
        <div ref={bannerRef} className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4">
          <section
            aria-label={copy.settingsTitle}
            className="mx-auto w-full max-w-3xl rounded-xl border border-[#252525] bg-[#161616] p-4"
          >
            <p className="text-[13px] leading-relaxed text-white">
              {copy.banner}{' '}
              <Link href="/privatumas" className="bg-transparent text-[#4afa8a] hover:opacity-85">
                {copy.privacy}
              </Link>
              .
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={accept} className={CHOICE_BUTTON}>
                {copy.accept}
              </button>
              <button type="button" onClick={decline} className={CHOICE_BUTTON}>
                {copy.decline}
              </button>
            </div>
          </section>
        </div>
      ) : null}
      {settingsOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key !== 'Tab' || !dialogRef.current) return
              const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button')]
              if (focusable.length === 0) return
              const first = focusable[0]
              const last = focusable[focusable.length - 1]
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
              }
            }}
            className="w-full max-w-sm rounded-xl border border-[#252525] bg-[#161616] p-5 outline-none"
          >
            <h2 id={titleId} className="text-[15px] font-medium text-white">
              {copy.settingsTitle}
            </h2>
            <p className="mt-2 text-[13px] text-white/80">{status}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={accept} className={CHOICE_BUTTON}>
                {copy.accept}
              </button>
              <button type="button" onClick={decline} className={CHOICE_BUTTON}>
                {copy.decline}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="mt-3 w-full bg-transparent py-2 text-[12px] text-white/70 hover:text-white"
            >
              {copy.close}
            </button>
          </div>
        </div>
      ) : null}
    </ConsentCtx.Provider>
  )
}
