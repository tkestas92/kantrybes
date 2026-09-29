'use client'

import { useEffect } from 'react'
import { ExternalLink, X } from 'lucide-react'

type Props = {
  title: string
  src: string
  closeLabel: string
  openNewTabLabel: string
  onClose: () => void
}

export default function CvModal({ title, src, closeLabel, openNewTabLabel, onClose }: Props) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-label={closeLabel}
      />
      <div className="relative z-10 flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-xl border border-[#333] bg-[#161616]">
        <div className="flex items-center justify-between gap-3 border-b border-[#252525] bg-[#161616] px-4 py-3">
          <p className="truncate text-[13px] font-medium text-white">{title}</p>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-white hover:text-[#4afa8a] transition-colors"
            >
              <ExternalLink size={14} />
              {openNewTabLabel}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-white transition-colors"
              aria-label={closeLabel}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <iframe src={src} title={title} className="h-[75vh] w-full border-0 bg-white" />
      </div>
    </div>
  )
}
