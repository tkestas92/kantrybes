import type { LiveDemoType } from '@/lib/liveDemo'

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  window.gtag?.(...args)
}

export function trackDemoOpen(params: {
  title: string
  type: LiveDemoType
  url: string
}) {
  gtag('event', 'demo_open', {
    project_title: params.title,
    demo_type: params.type,
    demo_url: params.url,
  })
}

export function trackDemoOpenNewTab(params: {
  title: string
  type: LiveDemoType
  url: string
}) {
  gtag('event', 'demo_open_new_tab', {
    project_title: params.title,
    demo_type: params.type,
    demo_url: params.url,
  })
}
