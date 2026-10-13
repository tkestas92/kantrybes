'use client'

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const choosing = useRef(false)
  const returnFocus = useRef<HTMLElement | null>(null)
  const titleId = useId()

  useEffect(() => {
    setConsent(readConsent())
    setReady(true)
    setMounted(true)
  }, [])

  const showBanner = ready && consent.thirdParty === null

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

  function commitChoice(thirdParty: boolean) {
    if (choosing.current) return
    choosing.current = true
    const finish = () => {
      const record = writeConsent(thirdParty)
      if (!thirdParty) {
        clearAnalyticsCookies()
        denyAnalyticsConsent()
      }
      setConsent(record)
      setSettingsOpen(false)
      setLeaving(false)
      choosing.current = false
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (showBanner && !reduceMotion) {
      setLeaving(true)
      window.setTimeout(finish, 200)
      return
    }
    finish()
  }

  function accept() {
    commitChoice(true)
  }

  function decline() {
    commitChoice(false)
  }

  function openSettings() {
    setSettingsOpen(true)
  }

  const status =
    consent.thirdParty === true ? copy.accepted : consent.thirdParty === false ? copy.declined : copy.unset

  return (
    <ConsentCtx.Provider value={{ consent, ready, accept, decline, openSettings }}>
      {children}
      {mounted && showBanner
        ? createPortal(
            <div
              role="dialog"
              aria-label={copy.settingsTitle}
              className="fixed left-1/2 z-[80] w-[calc(100%-2rem)] max-w-[720px] rounded-xl border border-[#3a3a3a] bg-[#161616] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
              style={{
                bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
                transform: leaving ? 'translate(-50%, 12px)' : 'translate(-50%, 0)',
                opacity: leaving ? 0 : 1,
                transition: 'transform 200ms ease, opacity 200ms ease',
                pointerEvents: leaving ? 'none' : 'auto',
              }}
            >
              <p className="text-[13px] leading-relaxed text-white">
                {copy.banner}{' '}
                <Link href="/privatumas" className="bg-transparent text-[#4afa8a] hover:opacity-85">
                  {copy.privacy}
                </Link>
                .
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => commitChoice(true)} className={CHOICE_BUTTON}>
                  {copy.accept}
                </button>
                <button type="button" onClick={() => commitChoice(false)} className={CHOICE_BUTTON}>
                  {copy.decline}
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
      {mounted && settingsOpen
        ? createPortal(
            <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-4 sm:items-center">
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
                  <button type="button" onClick={() => commitChoice(true)} className={CHOICE_BUTTON}>
                    {copy.accept}
                  </button>
                  <button type="button" onClick={() => commitChoice(false)} className={CHOICE_BUTTON}>
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
            </div>,
            document.body
          )
        : null}
    </ConsentCtx.Provider>
  )
}
