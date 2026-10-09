'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BPM_COPY } from '@/components/useTripleTap'

type Props = { onClose: () => void }

const MAX_TAPS = 8
const RESET_GAP_MS = 2000

function genreKey(bpm: number): 'downtempo' | 'house' | 'houseTechno' | 'techno' | null {
  if (bpm >= 80 && bpm <= 100) return 'downtempo'
  if (bpm >= 118 && bpm <= 123) return 'house'
  if (bpm >= 124 && bpm <= 132) return 'houseTechno'
  if (bpm >= 133 && bpm <= 150) return 'techno'
  return null
}

export default function BpmTapper({ onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const tapRef = useRef<HTMLButtonElement>(null)
  const tapsRef = useRef<number[]>([])
  const flashRef = useRef<number | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const [bpm, setBpm] = useState<number | null>(null)
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

  const genre = bpm === null ? null : genreKey(bpm)

  return createPortal(
    <div className="surface-solid fixed inset-0 z-50">
      <div className="surface-solid absolute inset-0" onClick={() => onCloseRef.current()} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={BPM_COPY.dialog}
        className="flex flex-col items-center gap-4 overflow-x-hidden border border-[#262626] bg-[#161616] px-6 py-6 text-center text-white"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 360px)',
          maxHeight: '85dvh',
          overflowY: 'auto',
          borderRadius: 16,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="font-mono text-[56px] leading-none text-white">
          {bpm === null ? BPM_COPY.empty : bpm}
        </p>
        {genre ? (
          <p className="font-mono text-[12px] text-[#4afa8a]">{BPM_COPY.genres[genre]}</p>
        ) : null}
        <p className="text-[14px] text-white/70">{BPM_COPY.hint}</p>

        <button
          ref={tapRef}
          type="button"
          data-bpm-action="tap"
          aria-label={BPM_COPY.tap}
          onClick={registerTap}
          className="flex h-[120px] w-[120px] max-h-[160px] max-w-[160px] shrink-0 items-center justify-center rounded-full border border-[#4afa8a] text-[14px] font-medium tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4afa8a]"
          style={{ backgroundColor: pressed ? '#1a3d2c' : 'var(--surface-solid)' }}
        >
          {BPM_COPY.tap}
        </button>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            data-bpm-action="reset"
            aria-label={BPM_COPY.reset}
            onClick={reset}
            className="surface-card inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-[13px] text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]"
          >
            {BPM_COPY.reset}
          </button>
          <button
            type="button"
            data-bpm-action="close"
            aria-label={BPM_COPY.close}
            onClick={() => onCloseRef.current()}
            className="surface-card inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-[13px] text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4afa8a]"
          >
            {BPM_COPY.close}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
