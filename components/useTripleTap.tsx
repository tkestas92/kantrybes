'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'

export const OPEN_BPM_EVENT = 'open-bpm'
export const CLOSE_BPM_EVENT = 'close-bpm'
const BPM_SEEN_KEY = 'bpm-opened'

export const BPM_COPY = {
  dialog: 'BPM',
  empty: '--',
  hint: 'Tap the beat',
  tap: 'TAP',
  reset: 'Reset',
  close: 'Close',
  genres: {
    downtempo: 'downtempo',
    house: 'house',
    houseTechno: 'house / techno',
    techno: 'techno',
  },
} as const

const TAP_GAP_MS = 600
const HINT_FADE_MS = 150
const PHONE_HINT_MS = 1500

export const BPM_HINTS = [
  { delay: 500, text: 'tap tap tap' },
  { delay: 3000, text: 'go on, click it' },
  { delay: 6000, text: 'three times, seriously' },
] as const

const PROGRESS_HINTS = ['two more', 'one more'] as const

export function requestOpenBpm() {
  window.dispatchEvent(new Event(OPEN_BPM_EVENT))
}

export function markBpmSeen() {
  try {
    sessionStorage.setItem(BPM_SEEN_KEY, '1')
  } catch {
    /* private mode */
  }
}

function pointerCanHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function useBpmHint() {
  const [text, setText] = useState<string | null>(null)
  const [opaque, setOpaque] = useState(true)
  const textRef = useRef<string | null>(null)
  const timers = useRef<number[]>([])
  const fadeTimer = useRef<number | null>(null)
  const hoveringRef = useRef(false)
  const hostRef = useRef<Element | null>(null)
  const pointRef = useRef({ x: 0, y: 0 })
  const generation = useRef(0)
  const hideRef = useRef<() => void>(() => {})

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    if (fadeTimer.current !== null) {
      window.clearTimeout(fadeTimer.current)
      fadeTimer.current = null
    }
  }

  function hide() {
    generation.current += 1
    clearTimers()
    textRef.current = null
    setText(null)
    setOpaque(true)
  }
  hideRef.current = hide

  function armIdle(token: number, delays: readonly number[]) {
    BPM_HINTS.forEach((hint, index) => {
      timers.current.push(window.setTimeout(() => reveal(hint.text, token), delays[index]))
    })
  }

  function showProgress(next: string) {
    clearTimers()
    generation.current += 1
    reveal(next, generation.current)
  }

  function dismissPhone(token: number) {
    if (generation.current !== token) return
    setOpaque(false)
    fadeTimer.current = window.setTimeout(() => {
      fadeTimer.current = null
      if (generation.current !== token) return
      textRef.current = null
      setText(null)
      setOpaque(true)
    }, HINT_FADE_MS)
  }

  function showPhoneProgress(next: string) {
    showProgress(next)
    const token = generation.current
    timers.current.push(window.setTimeout(() => dismissPhone(token), PHONE_HINT_MS))
  }

  function resumeIdle() {
    clearTimers()
    generation.current += 1
    const first = BPM_HINTS[0].delay
    armIdle(
      generation.current,
      BPM_HINTS.map((hint) => hint.delay - first),
    )
  }

  function reveal(next: string, token: number) {
    if (generation.current !== token) return
    if (textRef.current === null) {
      textRef.current = next
      setText(next)
      setOpaque(true)
      return
    }
    if (textRef.current === next) {
      setOpaque(true)
      return
    }
    setOpaque(false)
    fadeTimer.current = window.setTimeout(() => {
      fadeTimer.current = null
      if (generation.current !== token) return
      textRef.current = next
      setText(next)
      setOpaque(true)
    }, HINT_FADE_MS)
  }

  function pointerOverHost() {
    const host = hostRef.current
    if (!host) return false
    const { x, y } = pointRef.current
    const hit = document.elementFromPoint(x, y)
    return hit !== null && (hit === host || host.contains(hit))
  }

  function restartIdle() {
    hide()
    if (!pointerCanHover() || !pointerOverHost()) {
      hoveringRef.current = false
      return
    }
    hoveringRef.current = true
    armIdle(
      generation.current,
      BPM_HINTS.map((hint) => hint.delay),
    )
  }
  const restartRef = useRef(restartIdle)
  restartRef.current = restartIdle

  useEffect(() => {
    function onOpen() {
      hideRef.current()
    }
    function onClose() {
      restartRef.current()
    }
    function track(event: PointerEvent) {
      pointRef.current = { x: event.clientX, y: event.clientY }
    }
    window.addEventListener(OPEN_BPM_EVENT, onOpen)
    window.addEventListener(CLOSE_BPM_EVENT, onClose)
    window.addEventListener('pointermove', track)
    return () => {
      window.removeEventListener(OPEN_BPM_EVENT, onOpen)
      window.removeEventListener(CLOSE_BPM_EVENT, onClose)
      window.removeEventListener('pointermove', track)
      clearTimers()
    }
  }, [])

  function onEnter(event: MouseEvent) {
    if (!pointerCanHover()) return
    if (event.currentTarget instanceof Element) hostRef.current = event.currentTarget
    pointRef.current = { x: event.clientX, y: event.clientY }
    hoveringRef.current = true
    hide()
    armIdle(
      generation.current,
      BPM_HINTS.map((hint) => hint.delay),
    )
  }

  function onLeave(event: MouseEvent) {
    if (pointerStillOver(event)) return
    hoveringRef.current = false
    hide()
  }

  function onProgress(count: number) {
    if (count === 0) {
      if (hoveringRef.current && pointerCanHover()) resumeIdle()
      return
    }
    if (count !== 1 && count !== 2) return
    const next = PROGRESS_HINTS[count - 1]
    if (pointerCanHover()) {
      hoveringRef.current = true
      showProgress(next)
      return
    }
    showPhoneProgress(next)
  }

  return { onEnter, onLeave, onProgress, text, opaque }
}

function pointerStillOver(event: MouseEvent) {
  const el = event.currentTarget
  if (!(el instanceof Element)) return false
  const next = event.relatedTarget
  if (next instanceof Node && el.contains(next)) return true
  const hit = document.elementFromPoint(event.clientX, event.clientY)
  return hit !== null && el.contains(hit)
}

export function BpmHint({ text, opaque }: { text: string | null; opaque: boolean }) {
  if (!text) return null
  return (
    <span
      aria-hidden="true"
      className="bpm-hint pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-[6px] border border-[#262626] bg-[#161616] px-[10px] py-[6px] font-mono text-[12px] leading-none text-white"
      style={{
        bottom: 'calc(100% + 8px)',
        opacity: opaque ? 1 : 0,
        transition: 'opacity 150ms linear',
      }}
    >
      {text}
    </span>
  )
}

export function useTripleTap(onTrigger: () => void, onProgress?: (count: number) => void) {
  const state = useRef({ count: 0, last: 0 })
  const triggerRef = useRef(onTrigger)
  const progressRef = useRef(onProgress)
  const resetTimer = useRef<number | null>(null)
  triggerRef.current = onTrigger
  progressRef.current = onProgress

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current)
    }
  }, [])

  return function onClick() {
    const now = performance.now()
    const secret = state.current
    secret.count = now - secret.last < TAP_GAP_MS ? secret.count + 1 : 1
    secret.last = now
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current)
      resetTimer.current = null
    }
    if (secret.count >= 3) {
      secret.count = 0
      secret.last = 0
      triggerRef.current()
      return
    }
    progressRef.current?.(secret.count)
    resetTimer.current = window.setTimeout(() => {
      resetTimer.current = null
      secret.count = 0
      secret.last = 0
      progressRef.current?.(0)
    }, TAP_GAP_MS)
  }
}

export function useBpmName() {
  const hint = useBpmHint()
  const onClick = useTripleTap(requestOpenBpm, hint.onProgress)
  return {
    onClick,
    onMouseEnter: hint.onEnter,
    onMouseLeave: hint.onLeave,
    text: hint.text,
    opaque: hint.opaque,
  }
}

export function BpmTrigger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const bpm = useBpmName()
  return (
    <span
      onClick={bpm.onClick}
      onMouseEnter={bpm.onMouseEnter}
      onMouseLeave={bpm.onMouseLeave}
      className={['relative', className].filter(Boolean).join(' ')}
    >
      <BpmHint text={bpm.text} opaque={bpm.opaque} />
      {children}
    </span>
  )
}
