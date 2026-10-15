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
        className="box-border flex w-[min(calc(100vw-32px),340px)] max-w-[340px] min-w-0 flex-col items-stretch gap-5 overflow-x-hidden text-center text-white"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '85dvh',
          overflowY: 'auto',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-full min-w-0 flex-col items-center gap-4 rounded-2xl border border-[#262626] bg-[#161616] p-6">
          <div className="flex h-[72px] items-center justify-center">
            <p
              className={
                bpm === null
                  ? 'font-mono text-[40px] leading-none text-white/25'
                  : 'font-mono text-[68px] tabular-nums leading-none text-white'
              }
            >
              {bpm === null ? '—' : bpm}
            </p>
          </div>
          <div className="flex min-h-[1.25rem] w-full min-w-0 flex-col items-center text-[13px] leading-snug text-white/50">
            {bpm === null ? (
              <p className="max-w-full">
                {copy.waiting}
                <br />
                {copy.hint}
              </p>
            ) : mood ? (
              <p className="max-w-full">{mood}</p>
            ) : null}
          </div>
          <button
            ref={tapRef}
            type="button"
            data-bpm-action="tap"
            aria-label={copy.tap}
            onClick={registerTap}
            className="flex h-[120px] w-[120px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#4afa8a] px-3 text-[12px] font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4afa8a]"
            style={{ backgroundColor: pressed ? '#1a3d2c' : 'var(--surface-solid)' }}
          >
            {copy.tap}
          </button>
          <div className="flex w-full items-center justify-between border-t border-white/10 pt-4">
            <button
              type="button"
              data-bpm-action="reset"
              aria-label={copy.reset}
              onClick={reset}
              className="bg-transparent px-1 py-1 text-[13px] text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]"
            >
              {copy.reset}
            </button>
            <button
              type="button"
              data-bpm-action="close"
              aria-label={copy.close}
              onClick={() => onCloseRef.current()}
              className="bg-transparent px-1 py-1 text-[13px] text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]"
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
