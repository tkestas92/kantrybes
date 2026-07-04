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
      aria-label={`${title} ${subtitle}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-label={labels.closeDemo}
      />

      <div
        className={`relative z-10 flex w-full flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111] shadow-2xl ${
          isApp ? 'max-w-[420px]' : 'max-w-6xl'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#222] px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-white">{title}</p>
            <p className="text-[11px] text-gray-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-1">
            {!isApp && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackDemoOpenNewTab({ title, type, url })}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-[#222] hover:text-white"
                aria-label={labels.openNewTab}
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-[#222] hover:text-white"
              aria-label={labels.close}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          className={`relative w-full bg-[#0a0a0a] ${
            isApp ? 'aspect-[9/19.5]' : 'h-[75vh] min-h-[420px]'
          }`}
        >
          <iframe
            src={iframeUrl}
            title={`${title} ${subtitle}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  )
}
