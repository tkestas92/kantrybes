const DJBOOK_API_URL = 'https://djbook-backend-production.up.railway.app/query'
export const DJBOOK_BASE_URL = 'https://djbook-backend-production.up.railway.app'

export type DjPhoto = {
  url: string
  sortOrder: number
}

export type DjSocialLink = {
  platform: string
  url: string
}

export type DjEvent = {
  title: string
  venue: string
  date: string
  startTime: string
  eventStatus: string
  ticketsUrl: string | null
}

export type DjReleasePlatform = {
  name: string
  url: string
  enabled: boolean
}

export type DjRelease = {
  title: string
  artist: string
  artworkUrl: string
  songLinkUrl: string
  platforms: DjReleasePlatform[]
}

export type DjTikTokCard = {
  href: string
  title: string | null
  thumbnailUrl: string | null
}

export const DEFAULT_SECTION_ORDER = [
  'photos',
  'events',
  'soundcloud',
  'youtube',
  'tiktok',
  'releases',
  'social',
] as const

export type DjSectionKey = (typeof DEFAULT_SECTION_ORDER)[number]

const SECTION_KEY_SET = new Set<string>(DEFAULT_SECTION_ORDER)

export type DjProfile = {
  id: string
  djName: string
  bio: string
  genres: string[]
  photos: DjPhoto[]
  socialLinks: DjSocialLink[]
  events: DjEvent[]
  releases: DjRelease[]
  /** JSON array string from the API. Null means the default order. */
  sectionOrder: string | null
  tiktokCards: DjTikTokCard[]
}

const PUBLIC_DJ_PROFILE_QUERY = `
  query PublicDjProfile($username: String!) {
    publicDjProfile(username: $username) {
      id
      djName
      bio
      genres
      photos { url sortOrder }
      socialLinks { platform url }
      sectionOrder
      events {
        title
        venue
        date
        startTime
        eventStatus
        ticketsUrl
      }
      releases {
        title
        artist
        artworkUrl
        songLinkUrl
        platforms { name url enabled }
      }
    }
  }
`

export function parseSectionOrder(value: string | null | undefined): DjSectionKey[] {
  if (!value || !value.trim()) return [...DEFAULT_SECTION_ORDER]

  let raw: unknown
  try {
    raw = JSON.parse(value)
  } catch {
    return [...DEFAULT_SECTION_ORDER]
  }

  if (!Array.isArray(raw)) return [...DEFAULT_SECTION_ORDER]

  const seen = new Set<DjSectionKey>()
  const order: DjSectionKey[] = []
  for (const item of raw) {
    if (typeof item !== 'string' || !SECTION_KEY_SET.has(item) || seen.has(item as DjSectionKey)) {
      continue
    }
    const key = item as DjSectionKey
    seen.add(key)
    order.push(key)
  }

  if (order.length === 0) return [...DEFAULT_SECTION_ORDER]

  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) order.push(key)
  }
  return order
}

function isTikTokVideoPageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (!host.endsWith('tiktok.com') || host === 'vm.tiktok.com' || host === 'vt.tiktok.com') {
      return false
    }
    return /\/video\/[a-zA-Z0-9]+/.test(parsed.pathname)
  } catch {
    return false
  }
}

async function resolveTikTokUrl(url: string): Promise<string | null> {
  if (isTikTokVideoPageUrl(url)) return url

  try {
    const res = await fetch(url, { redirect: 'follow', next: { revalidate: 3600 } })
    if (!isTikTokVideoPageUrl(res.url)) return null
    return res.url
  } catch {
    return null
  }
}

async function fetchTikTokOEmbed(canonicalUrl: string): Promise<{ title: string | null; thumbnailUrl: string | null } | null> {
  try {
    const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(canonicalUrl)}`
    const res = await fetch(endpoint, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = (await res.json()) as { title?: string; thumbnail_url?: string }
    if (!data.thumbnail_url) return null
    return {
      title: data.title?.trim() || null,
      thumbnailUrl: data.thumbnail_url,
    }
  } catch {
    return null
  }
}

export async function loadTikTokCards(links: DjSocialLink[]): Promise<DjTikTokCard[]> {
  const tiktokLinks = links.filter((link) => link.platform.toLowerCase() === 'tiktok' && link.url)
  const cards = await Promise.all(
    tiktokLinks.map(async (link): Promise<DjTikTokCard> => {
      const canonical = await resolveTikTokUrl(link.url)
      if (!canonical) return { href: link.url, title: null, thumbnailUrl: null }
      const oembed = await fetchTikTokOEmbed(canonical)
      if (!oembed) return { href: canonical, title: null, thumbnailUrl: null }
      return { href: canonical, title: oembed.title, thumbnailUrl: oembed.thumbnailUrl }
    })
  )
  return cards
}

export function resolvePhotoUrl(relativeUrl: string): string {
  if (relativeUrl.startsWith('http')) return relativeUrl
  return `${DJBOOK_BASE_URL}${relativeUrl}`
}

export async function getPublicDjProfile(username: string): Promise<DjProfile | null> {
  try {
    const res = await fetch(DJBOOK_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: PUBLIC_DJ_PROFILE_QUERY,
        variables: { username },
      }),
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const json = await res.json()
    if (json.errors?.length || !json.data?.publicDjProfile) return null

    const profile = json.data.publicDjProfile as Omit<DjProfile, 'tiktokCards'>
    const socialLinks = profile.socialLinks ?? []
    let tiktokCards: DjTikTokCard[] = socialLinks
      .filter((link) => link.platform.toLowerCase() === 'tiktok' && link.url)
      .map((link) => ({ href: link.url, title: null, thumbnailUrl: null }))
    try {
      tiktokCards = await loadTikTokCards(socialLinks)
    } catch {
      // Keep the plain link cards when oEmbed is unavailable.
    }

    return {
      ...profile,
      socialLinks,
      photos: profile.photos ?? [],
      events: profile.events ?? [],
      releases: profile.releases ?? [],
      genres: profile.genres ?? [],
      sectionOrder: profile.sectionOrder ?? null,
      tiktokCards,
    }
  } catch {
    return null
  }
}
