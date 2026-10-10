'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'grid-pulse'
const TAP_GAP_MS = 600
const TOAST_MS = 1500

type PulseContext = {
  enabled: boolean
  onGenreTap: () => void
}

const Context = createContext<PulseContext | null>(null)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function readStored() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeStored(on: boolean) {
  try {
    sessionStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  } catch {
    /* private mode */
  }
}

export function GridPulseProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const enabledRef = useRef(false)
  const taps = useRef({ count: 0, last: 0 })
  const toastTimer = useRef(0)

  useEffect(() => {
    if (readStored() && !prefersReducedMotion()) {
      enabledRef.current = true
      setEnabled(true)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast(text)
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  const toggle = useCallback(() => {
    if (prefersReducedMotion()) {
      enabledRef.current = false
      setEnabled(false)
      writeStored(false)
      showToast('grid pulse off')
      return
    }
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    writeStored(next)
    showToast(next ? 'grid pulse on' : 'grid pulse off')
  }, [showToast])

  const onGenreTap = useCallback(() => {
    const now = performance.now()
    const next = now - taps.current.last <= TAP_GAP_MS ? taps.current.count + 1 : 1
    taps.current.last = now
    taps.current.count = next >= 3 ? 0 : next
    if (next >= 3) toggle()
  }, [toggle])

  return (
    <Context.Provider value={{ enabled, onGenreTap }}>
      {children}
      {toast ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-[#262626] bg-[#161616] px-3 py-1.5 font-mono text-[12px] text-white"
        >
          {toast}
        </div>
      ) : null}
    </Context.Provider>
  )
}

export function useGridPulse() {
  const value = useContext(Context)
  if (!value) throw new Error('useGridPulse must be used within GridPulseProvider')
  return value
}
