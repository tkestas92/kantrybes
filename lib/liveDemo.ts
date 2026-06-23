import type { Project } from '@/lib/db'

export type LiveDemoType = 'web' | 'app'

export function resolveLiveDemoType(project: Pick<Project, 'live_url' | 'live_type'>): LiveDemoType | null {
  if (!project.live_url) return null
  if (project.live_type === 'web' || project.live_type === 'app') {
    return project.live_type
  }

  try {
    const hostname = new URL(project.live_url).hostname
    if (hostname.startsWith('demo-') && hostname.endsWith('.kantrybes.lt')) {
      return 'app'
    }
  } catch {
    return 'web'
  }

  return 'web'
}

export function getLiveIframeUrl(url: string, type: LiveDemoType): string {
  if (type !== 'app') return url

  try {
    const parsed = new URL(url)
    parsed.pathname = '/embed/'
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return url
  }
}

export const LIVE_DEMO_LABELS: Record<LiveDemoType, { button: string; subtitle: string }> = {
  app: { button: 'Live app', subtitle: 'Mobili aplikacija' },
  web: { button: 'Live web', subtitle: 'Web puslapis' },
}
