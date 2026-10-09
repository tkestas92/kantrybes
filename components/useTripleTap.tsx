'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export const OPEN_BPM_EVENT = 'open-bpm'
const BPM_SEEN_KEY = 'bpm-opened'

export const BPM_HINTS = [
  { delay: 500, text: 'tap tap tap' },
  { delay: 3000, text: 'na, paspausk' },
  { delay: 6000, text: 'trys kartus, rimtai' },
] as const

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

function bpmAlreadySeen() {
  try {
    return sessionStorage.getItem(BPM_SEEN_KEY) === '1'
  } catch {
    return false
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
  const seenRef = useRef(false)
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

  function reveal(next: string, token: number) {
    if (seenRef.current || generation.current !== token) return
    if (textRef.current === null) {
      textRef.current = next
      setText(next)
      setOpaque(true)
      return
    }
    if (textRef.current === next) return
    setOpaque(false)
    fadeTimer.current = window.setTimeout(() => {
      fadeTimer.current = null
      if (seenRef.current || generation.current !== token) return
      textRef.current = next
      setText(next)
      setOpaque(true)
    }, 150)
  }

  useEffect(() => {
    seenRef.current = bpmAlreadySeen()
    function onOpen() {
      seenRef.current = true
      hideRef.current()
    }
    window.addEventListener(OPEN_BPM_EVENT, onOpen)
    return () => {
      window.removeEventListener(OPEN_BPM_EVENT, onOpen)
      clearTimers()
    }
  }, [])

  function onEnter() {
    if (!pointerCanHover() || seenRef.current || bpmAlreadySeen()) return
    hide()
    const token = generation.current
    for (const hint of BPM_HINTS) {
      timers.current.push(
        window.setTimeout(() => reveal(hint.text, token), hint.delay)
      )
    }
  }

  return { onEnter, onLeave: hide, text, opaque }
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

export function useTripleTap(onTrigger: () => void) {
  const state = useRef({ count: 0, last: 0 })
  const triggerRef = useRef(onTrigger)
  triggerRef.current = onTrigger

  return function onClick() {
    const now = performance.now()
    const secret = state.current
    secret.count = now - secret.last < 600 ? secret.count + 1 : 1
    secret.last = now
    if (secret.count < 3) return
    secret.count = 0
    triggerRef.current()
  }
}

export function BpmTrigger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const onClick = useTripleTap(requestOpenBpm)
  const hint = useBpmHint()
  return (
    <span
      onClick={onClick}
      onMouseEnter={hint.onEnter}
      onMouseLeave={hint.onLeave}
      className={['relative', className].filter(Boolean).join(' ')}
    >
      <BpmHint text={hint.text} opaque={hint.opaque} />
      {children}
    </span>
  )
}
