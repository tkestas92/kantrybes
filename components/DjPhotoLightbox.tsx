'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { resolvePhotoUrl, type DjPhoto } from '@/lib/djbook'

type Props = {
  photos: DjPhoto[]
  index: number
  alt: string
  onClose: () => void
  onIndexChange: (index: number) => void
}

export default function DjPhotoLightbox({ photos, index, alt, onClose, onIndexChange }: Props) {
  const touchStartX = useRef<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const photo = photos[index]
  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && index > 0) onIndexChange(index - 1)
      if (event.key === 'ArrowRight' && index < photos.length - 1) onIndexChange(index + 1)
    }
    document.addEventListener('keydown', onKey)
    const scrollY = window.scrollY
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    const prevPosition = document.body.style.position
    const prevTop = document.body.style.top
    const prevWidth = document.body.style.width
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
      document.body.style.position = prevPosition
      document.body.style.top = prevTop
      document.body.style.width = prevWidth
      window.scrollTo(0, scrollY)
    }
  }, [index, onClose, onIndexChange, photos.length])

  if (!mounted || !photo) return null

  return createPortal(
    <div
      className="surface-solid fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2"
      >
        <X size={22} />
      </button>

      <button
        type="button"
        aria-label="Previous photo"
        disabled={!hasPrev}
        onClick={(event) => {
          event.stopPropagation()
          if (hasPrev) onIndexChange(index - 1)
        }}
        className="absolute left-3 z-10 p-2 text-white disabled:text-white/25"
      >
        <ChevronLeft size={36} />
      </button>

      <div
        className="relative max-w-[min(100%,960px)] max-h-[85vh] px-14"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current
          const end = event.changedTouches[0]?.clientX
          touchStartX.current = null
          if (start == null || end == null) return
          const delta = end - start
          if (delta > 40 && hasPrev) onIndexChange(index - 1)
          if (delta < -40 && hasNext) onIndexChange(index + 1)
        }}
      >
        <img
          src={resolvePhotoUrl(photo.url)}
          alt={`${alt} ${index + 1}`}
          className="max-w-full max-h-[85vh] object-contain"
        />
      </div>

      <button
        type="button"
        aria-label="Next photo"
        disabled={!hasNext}
        onClick={(event) => {
          event.stopPropagation()
          if (hasNext) onIndexChange(index + 1)
        }}
        className="absolute right-3 z-10 p-2 text-white disabled:text-white/25"
      >
        <ChevronRight size={36} />
      </button>

      <p className="absolute bottom-4 left-0 right-0 text-center text-[13px] text-white/70">
        {index + 1} / {photos.length}
      </p>
    </div>,
    document.body
  )
}
