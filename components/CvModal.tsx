'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, X } from 'lucide-react'

type Props = {
  title: string
  src: string
  closeLabel: string
  openNewTabLabel: string
  onClose: () => void
}

export default function CvModal({ title, src, closeLabel, openNewTabLabel, onClose }: Props) {
  const [pages, setPages] = useState<string[]>([])
  const [error, setError] = useState(false)

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

  useEffect(() => {
    let cancelled = false

    async function renderPdf() {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'
      const document = await pdfjs.getDocument(src).promise
      const rendered: string[] = []
      const scale = Math.min(2, Math.max(1.25, window.devicePixelRatio || 1))

      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber)
        const viewport = page.getViewport({ scale })
        const canvas = window.document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas is unavailable')
        await page.render({ canvasContext: context, viewport }).promise
        rendered.push(canvas.toDataURL('image/png'))
      }

      if (!cancelled) setPages(rendered)
    }

    renderPdf().catch(() => {
      if (!cancelled) setError(true)
    })

    return () => {
      cancelled = true
    }
  }, [src])

  return createPortal(
    <div
      className="surface-solid fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="surface-solid absolute inset-0"
        onClick={onClose}
        aria-label={closeLabel}
      />
      <div className="relative z-10 flex h-[min(90vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#333] bg-[#161616]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#252525] bg-[#161616] px-4 py-3">
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
        <div className="min-h-0 flex-1 overflow-auto bg-[#0f0f0f] p-3">
          {error ? (
            <p className="p-6 text-center text-[13px] text-white">Nepavyko parodyti CV.</p>
          ) : pages.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-white">Kraunama...</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pages.map((page, index) => (
                <img key={index} src={page} alt={`${title} ${index + 1}`} className="w-full h-auto bg-white" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
