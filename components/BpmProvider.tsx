'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { CLOSE_BPM_EVENT, OPEN_BPM_EVENT, markBpmSeen } from '@/components/useTripleTap'

const BpmTapper = dynamic(() => import('@/components/BpmTapper'), { ssr: false })

export default function BpmProvider() {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)

  useEffect(() => {
    function onOpen() {
      markBpmSeen()
      setOpen((current) => current || true)
    }
    window.addEventListener(OPEN_BPM_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_BPM_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (openRef.current && !open) {
      window.dispatchEvent(new Event(CLOSE_BPM_EVENT))
    }
    openRef.current = open
  }, [open])

  if (!open) return null
  return <BpmTapper onClose={() => setOpen(false)} />
}
