'use client'

import { useEffect } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { getLiveIframeUrl, type LiveDemoType } from '@/lib/liveDemo'
import type { t } from '@/lib/translations'
import { trackDemoOpen, trackDemoOpenNewTab } from '@/lib/analytics'

type Props = {
  url: string
  title: string
  type: LiveDemoType
  labels: (typeof t)['lt']['liveDemo']
  onClose: () => void
}

export default function LiveDemoModal({ url, title, type, labels, onClose }: Props) {
  const iframeUrl = getLiveIframeUrl(url, type)
  const subtitle = type === 'app' ? labels.appSubtitle : labels.webSubtitle
  const isApp = type === 'app'

  useEffect(() => {
    trackDemoOpen({ title, type, url })
  }, [title, type, url])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const html = document.documentElement
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = html.style.overflow
    const previousHtmlOverflowX = html.style.overflowX
    document.body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    html.style.overflowX = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      html.style.overflow = previousHtmlOverflow
      html.style.overflowX = previousHtmlOverflowX
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className={`surface-solid fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        isApp ? 'p-0 sm:p-6' : 'p-4 sm:p-6'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} ${subtitle}`}
    >
      <button
        type="button"
        className="surface-solid absolute inset-0"
        onClick={onClose}
        aria-label={labels.closeDemo}
      />

      <div
        className={`surface-card relative z-10 flex w-full flex-col overflow-hidden border-[#2a2a2a] shadow-2xl ${
          isApp
            ? 'h-[100dvh] max-h-[100dvh] max-w-none rounded-none border-0 sm:h-auto sm:max-h-none sm:max-w-[420px] sm:rounded-2xl sm:border'
            : 'max-w-6xl rounded-2xl border'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#222] px-4 py-3">
          <div className="min-w-0 pr-2">
            <p className="truncate text-[13px] font-medium text-white">{title}</p>
            <p className="truncate text-[11px] text-white">{subtitle}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {!isApp && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackDemoOpenNewTab({ title, type, url })}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-[#222] hover:text-white"
                aria-label={labels.openNewTab}
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-[#222] hover:text-white"
              aria-label={labels.close}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className={`relative min-h-0 w-full overflow-hidden bg-[#0a0a0a] ${
            isApp
              ? 'flex flex-1 items-center justify-center sm:aspect-[9/19.5] sm:flex-none'
              : 'h-[75vh] min-h-[420px]'
          }`}
        >
          <iframe
            src={iframeUrl}
            title={`${title} ${subtitle}`}
            className="absolute inset-0 h-full w-full max-w-full border-0"
            allow="autoplay; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  )
}
