'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

type Props = { onClose: () => void }

const MAX_TAPS = 8
const RESET_GAP_MS = 2000

function moodKey(bpm: number): 'calm' | 'slow' | 'deepHouse' | 'house' | 'techno' | 'fast' {
  if (bpm < 90) return 'calm'
  if (bpm < 110) return 'slow'
  if (bpm < 122) return 'deepHouse'
  if (bpm < 128) return 'house'
  if (bpm <= 140) return 'techno'
  return 'fast'
}

const EMPTY_BPM = '--'

export default function BpmTapper({ onClose }: Props) {
  const { lang } = useLang()
  const copy = t[lang].bpm
  const dialogRef = useRef<HTMLDivElement>(null)
  const tapRef = useRef<HTMLButtonElement>(null)
  const tapsRef = useRef<number[]>([])
  const flashRef = useRef<number | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const [bpm, setBpm] = useState<number | null>(null)
  const [tapCount, setTapCount] = useState(0)
  const [pressed, setPressed] = useState(false)

  function clearFlash() {
    if (flashRef.current !== null) {
      window.clearTimeout(flashRef.current)
      flashRef.current = null
    }
  }

  function flash() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    clearFlash()
    setPressed(true)
    flashRef.current = window.setTimeout(() => {
      setPressed(false)
      flashRef.current = null
    }, 150)
  }

  function registerTap() {
    const now = performance.now()
    const previous = tapsRef.current
    const last = previous[previous.length - 1]
    const next = last !== undefined && now - last > RESET_GAP_MS ? [] : previous.slice()
    next.push(now)
    const kept = next.length > MAX_TAPS ? next.slice(next.length - MAX_TAPS) : next
    tapsRef.current = kept
    setTapCount(kept.length)
    flash()
    if (kept.length < 2) {
      setBpm(null)
      return
    }
    let total = 0
    for (let i = 1; i < kept.length; i++) total += kept[i] - kept[i - 1]
    setBpm(Math.round(60000 / (total / (kept.length - 1))))
  }

  function reset() {
    tapsRef.current = []
    clearFlash()
    setPressed(false)
    setBpm(null)
    setTapCount(0)
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    tapRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return
        const items = [...dialog.querySelectorAll<HTMLElement>('button')].filter(
          (item) => !item.hasAttribute('disabled')
        )
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
        return
      }

      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      const target = event.target instanceof Element ? event.target : null
      const action = target?.closest('[data-bpm-action]')?.getAttribute('data-bpm-action')
      if (action === 'reset') {
        tapsRef.current = []
        clearFlash()
        setPressed(false)
        setBpm(null)
        setTapCount(0)
        return
      }
      if (action === 'close') {
        onCloseRef.current()
        return
      }
      registerTap()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      clearFlash()
    }
  }, [])

  const mood = bpm !== null && tapCount >= 4 ? copy.moods[moodKey(bpm)] : null

  return createPortal(
    <div className="surface-solid fixed inset-0 z-50">
      <div className="surface-solid absolute inset-0" onClick={() => onCloseRef.current()} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="flex flex-col items-center gap-5 overflow-x-hidden text-center text-white"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 360px)',
          maxHeight: '85dvh',
          overflowY: 'auto',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full max-w-full flex-col items-center gap-1.5">
          <p className="text-[16px] font-medium leading-snug text-white">{copy.title}</p>
          <p className="text-[14px] leading-snug text-white/70">{copy.explain}</p>
        </div>
        <div
          className="flex w-full flex-col items-center gap-4 overflow-x-hidden border border-[#262626] bg-[#161616] px-6 py-4"
          style={{ borderRadius: 16 }}
        >
        <p className="font-mono text-[56px] leading-none text-white">
          {bpm === null ? EMPTY_BPM : bpm}
        </p>
        {bpm === null ? (
          <p className="max-w-full text-[14px] leading-snug text-white/50">{copy.waiting}</p>
        ) : null}
        {mood ? (
          <p className="max-w-full text-[14px] leading-snug text-white/50">{mood}</p>
        ) : null}

        <button
          ref={tapRef}
          type="button"
          data-bpm-action="tap"
          aria-label={copy.tap}
          onClick={registerTap}
          className="flex h-[120px] w-[120px] max-h-[160px] max-w-[160px] shrink-0 items-center justify-center rounded-full border border-[#4afa8a] px-3 text-center text-[14px] font-medium leading-tight tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4afa8a]"
          style={{ backgroundColor: pressed ? '#1a3d2c' : 'var(--surface-solid)' }}
        >
          {copy.tap}
        </button>
        <p className="max-w-full text-[13px] leading-snug text-white/50">{copy.hint}</p>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            data-bpm-action="reset"
            aria-label={copy.reset}
            onClick={reset}
            className="surface-card inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-[13px] text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]"
          >
            {copy.reset}
          </button>
          <button
            type="button"
            data-bpm-action="close"
            aria-label={copy.close}
            onClick={() => onCloseRef.current()}
            className="surface-card inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-[13px] text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]"
          >
            {copy.close}
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
