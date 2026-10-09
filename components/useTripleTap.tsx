'use client'

import { useRef, type ReactNode } from 'react'

export const OPEN_BPM_EVENT = 'open-bpm'

export function requestOpenBpm() {
  window.dispatchEvent(new Event(OPEN_BPM_EVENT))
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
  return (
    <span onClick={onClick} className={className}>
      {children}
    </span>
  )
}
