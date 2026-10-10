'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, X } from 'lucide-react'

type Props = {
  title: string
  src: string
  closeLabel: string
  openNewTabLabel: string
  onClose: () => void
}

type PdfTextLayer = { cancel: () => void }

export default function CvModal({ title, src, closeLabel, openNewTabLabel, onClose }: Props) {
  const pagesRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLParagraphElement>(null)
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
    const host = pagesRef.current
    if (!host) return

    let cancelled = false
    let started = false
    const activeLayers: PdfTextLayer[] = []

    const clearLayers = () => {
      for (const layer of activeLayers) layer.cancel()
      activeLayers.length = 0
    }

    const pdfPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'
      return pdfjs.getDocument(src).promise.then((pdf) => ({ pdfjs, pdf }))
    })

    async function paint(width: number) {
      const { pdfjs, pdf } = await pdfPromise
      if (cancelled || !host) return

      host.replaceChildren()
      const outputScale = Math.min(2, Math.max(1, window.devicePixelRatio || 1))

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        if (cancelled) return
        const page = await pdf.getPage(pageNumber)
        const unscaled = page.getViewport({ scale: 1 })
        const cssScale = width / unscaled.width
        const viewport = page.getViewport({ scale: cssScale })

        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.className = 'pointer-events-none block h-auto w-full select-none bg-white'
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas is unavailable')
        const renderTask = page.render({
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
        })
        await renderTask.promise
        if (cancelled) return

        const textLayerDiv = document.createElement('div')
        textLayerDiv.className = 'cv-text-layer'
        textLayerDiv.style.setProperty('--scale-factor', String(cssScale))
        const textLayer = new pdfjs.TextLayer({
          textContentSource: page.streamTextContent(),
          container: textLayerDiv,
          viewport,
        })
        activeLayers.push(textLayer)

        const linkLayer = document.createElement('div')
        linkLayer.className = 'cv-links'
        const annotations = await page.getAnnotations()
        for (const annotation of annotations) {
          const href = typeof annotation.url === 'string' ? annotation.url : ''
          if (!href) continue
          const rect = viewport.convertToViewportRectangle(annotation.rect)
          const link = document.createElement('a')
          link.href = href
          link.target = '_blank'
          link.rel = 'noopener noreferrer'
          link.className = 'cv-link'
          link.style.left = `${(Math.min(rect[0], rect[2]) / viewport.width) * 100}%`
          link.style.top = `${(Math.min(rect[1], rect[3]) / viewport.height) * 100}%`
          link.style.width = `${(Math.abs(rect[2] - rect[0]) / viewport.width) * 100}%`
          link.style.height = `${(Math.abs(rect[3] - rect[1]) / viewport.height) * 100}%`
          link.setAttribute('aria-label', href)
          linkLayer.append(link)
        }

        const pageEl = document.createElement('div')
        pageEl.className = 'cv-page'
        pageEl.setAttribute('aria-label', `${title} ${pageNumber}`)
        pageEl.append(canvas, textLayerDiv, linkLayer)
        host.append(pageEl)
        await textLayer.render()
      }

      if (!cancelled && loadingRef.current) loadingRef.current.hidden = true
    }

    function requestPaint(width: number) {
      if (started) return
      started = true
      paint(width).catch((err) => {
        const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: string }).name) : ''
        if (!cancelled && name !== 'AbortException') setError(true)
      })
    }

    const observer = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0]?.contentRect.width ?? 0)
      if (width < 1) return
      requestPaint(width)
    })
    observer.observe(host)

    const onDown = () => host.classList.add('is-selecting')
    const onUp = () => host.classList.remove('is-selecting')
    host.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    return () => {
      cancelled = true
      clearLayers()
      observer.disconnect()
      host.replaceChildren()
      host.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [src, title])

  return createPortal(
    <div
      className="surface-solid pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="pointer-events-auto relative z-10 flex h-[min(90vh,900px)] w-full max-w-3xl select-text flex-col overflow-hidden rounded-xl border border-[#333] bg-[#161616]"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#252525] bg-[#161616] px-4 py-3">
          <p className="truncate text-[13px] font-medium text-white select-text">{title}</p>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex select-text items-center gap-1.5 text-[12px] text-white hover:text-[#4afa8a] transition-colors"
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
        <div className="min-h-0 flex-1 select-text overflow-auto bg-[#0f0f0f] p-3">
          {error ? (
            <p className="p-6 text-center text-[13px] text-white select-text">Nepavyko parodyti CV.</p>
          ) : (
            <>
              <p ref={loadingRef} className="p-6 text-center text-[13px] text-white">Kraunama...</p>
              <div ref={pagesRef} className="cv-pages flex flex-col gap-3" />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
