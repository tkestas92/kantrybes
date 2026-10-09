'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { OPEN_BPM_EVENT, markBpmSeen } from '@/components/useTripleTap'

const BpmTapper = dynamic(() => import('@/components/BpmTapper'), { ssr: false })

export default function BpmProvider() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onOpen() {
      markBpmSeen()
      setOpen((current) => current || true)
    }
    window.addEventListener(OPEN_BPM_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_BPM_EVENT, onOpen)
  }, [])

  if (!open) return null
  return <BpmTapper onClose={() => setOpen(false)} />
}
