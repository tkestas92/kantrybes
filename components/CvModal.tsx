'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, X } from 'lucide-react'

type Props = {
  title: string
  src: string
  closeLabel: string
  openNewTabLabel: string
  loadingLabel: string
  errorLabel: string
  onClose: () => void
}

type PdfTextLayer = { cancel: () => void }

type Glyph = {
  str: string
  transform: number[]
  width: number
  height: number
}

type ViewportLike = {
  width: number
  height: number
  convertToViewportRectangle: (rect: number[]) => number[]
}

// Same behavior as pdf.js PDFLinkService with externalLinkTarget = LinkTarget.BLANK.
const linkService = {
  externalLinkEnabled: true,
  addLinkAttributes(link: HTMLAnchorElement, url: string) {
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  },
}

const TEXT_LINKS = [
  { text: 'kestas@kantrybes.lt', href: 'mailto:kestas@kantrybes.lt' },
  { text: 'kantrybes.lt/dev', href: 'https://kantrybes.lt/dev' },
  { text: 'kantrybes.lt', href: 'https://kantrybes.lt' },
]

function isGlyph(item: unknown): item is Glyph {
  if (!item || typeof item !== 'object' || !('str' in item)) return false
  const glyph = item as Glyph
  return typeof glyph.str === 'string' && Array.isArray(glyph.transform)
}

function openOutside(link: HTMLAnchorElement) {
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
}

function addTextLinks(layer: HTMLDivElement, items: unknown[], viewport: ViewportLike) {
  for (const item of items) {
    if (!isGlyph(item) || !item.str) continue
    const match = TEXT_LINKS.find((entry) => item.str.includes(entry.text))
    if (!match) continue
    const start = item.str.indexOf(match.text)
    const charWidth = item.width / item.str.length
    const x = item.transform[4] + charWidth * start
    const y = item.transform[5]
    const height = item.height || Math.abs(item.transform[3]) || 12
    const rect = viewport.convertToViewportRectangle([
      x,
      y - height * 0.25,
      x + charWidth * match.text.length,
      y + height * 0.85,
    ])
    const section = document.createElement('section')
    section.className = 'linkAnnotation'
    section.style.left = `${Math.min(rect[0], rect[2])}px`
    section.style.top = `${Math.min(rect[1], rect[3])}px`
    section.style.width = `${Math.abs(rect[2] - rect[0])}px`
    section.style.height = `${Math.abs(rect[3] - rect[1])}px`
    const link = document.createElement('a')
    link.href = match.href
    link.setAttribute('aria-label', match.href)
    openOutside(link)
    section.append(link)
    layer.append(section)
  }
}

export default function CvModal({ title, src, closeLabel, openNewTabLabel, loadingLabel, errorLabel, onClose }: Props) {
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
    let generation = 0
    let paintedWidth = -1
    const activeLayers: PdfTextLayer[] = []

    const pdfPromise = import('pdfjs-dist').then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs'
      return pdfjs.getDocument(src).promise.then((pdf) => ({ pdfjs, pdf }))
    })

    function isCurrent(gen: number) {
      return !cancelled && gen === generation && host
    }

    async function paint(width: number, gen: number) {
      const { pdfjs, pdf } = await pdfPromise
      if (!isCurrent(gen)) return

      const outputScale = Math.min(2, Math.max(1, window.devicePixelRatio || 1))
      const pages: HTMLDivElement[] = []

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        if (!isCurrent(gen)) return
        const page = await pdf.getPage(pageNumber)
        if (!isCurrent(gen)) return
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
        if (!isCurrent(gen)) return

        const textLayerDiv = document.createElement('div')
        textLayerDiv.className = 'textLayer'
        textLayerDiv.style.setProperty('--scale-factor', String(cssScale))
        const textLayer = new pdfjs.TextLayer({
          textContentSource: page.streamTextContent(),
          container: textLayerDiv,
          viewport,
        })
        activeLayers.push(textLayer)

        const linkLayer = document.createElement('div')
        linkLayer.className = 'annotationLayer'
        const [annotations, textContent] = await Promise.all([
          page.getAnnotations(),
          page.getTextContent(),
        ])
        if (!isCurrent(gen)) return
        const annotationLayer = new pdfjs.AnnotationLayer({
          div: linkLayer,
          accessibilityManager: null,
          annotationCanvasMap: null,
          annotationEditorUIManager: null,
          page,
          viewport,
          structTreeLayer: null,
        })

        const pageEl = document.createElement('div')
        pageEl.className = 'cv-page'
        pageEl.setAttribute('aria-label', `${title} ${pageNumber}`)
        pageEl.append(canvas, textLayerDiv, linkLayer)
        pages.push(pageEl)

        await Promise.all([
          textLayer.render(),
          annotationLayer.render({
            viewport,
            div: linkLayer,
            annotations,
            page,
            linkService: linkService as never,
            renderForms: false,
          }),
        ])
        if (!isCurrent(gen)) return

        addTextLinks(linkLayer, textContent.items, viewport)
        linkLayer.querySelectorAll('a').forEach((anchor) => {
          if (anchor instanceof HTMLAnchorElement) openOutside(anchor)
        })
      }

      if (!isCurrent(gen) || !host) return
      host.replaceChildren(...pages)
      if (loadingRef.current) loadingRef.current.hidden = true
    }

    function requestPaint(width: number) {
      if (Math.abs(width - paintedWidth) < 2) return
      paintedWidth = width
      generation += 1
      const gen = generation
      for (const layer of activeLayers) layer.cancel()
      activeLayers.length = 0
      if (loadingRef.current) loadingRef.current.hidden = false
      paint(width, gen).catch((err) => {
        const name = err && typeof err === 'object' && 'name' in err ? String((err as { name: string }).name) : ''
        if (!cancelled && gen === generation && name !== 'AbortException') setError(true)
      })
    }

    const observer = new ResizeObserver((entries) => {
      const width = Math.floor(entries[0]?.contentRect.width ?? 0)
      if (width < 1) return
      requestPaint(width)
    })
    observer.observe(host)

    return () => {
      cancelled = true
      generation += 1
      for (const layer of activeLayers) layer.cancel()
      observer.disconnect()
      host.replaceChildren()
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
        className="pointer-events-auto relative z-10 flex h-[min(90dvh,900px)] w-full max-w-3xl select-text flex-col overflow-hidden rounded-xl border border-[#333] bg-[#161616]"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#252525] bg-[#161616] px-4 py-3">
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
            <p className="p-6 text-center text-[13px] text-white select-text">{errorLabel}</p>
          ) : (
            <>
              <p ref={loadingRef} className="p-6 text-center text-[13px] text-white">{loadingLabel}</p>
              <div ref={pagesRef} className="cv-pages flex flex-col gap-3" />
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
