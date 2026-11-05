const DJBOOK_API_URL = 'https://djbook-backend-production.up.railway.app/query'
export const DJBOOK_BASE_URL = 'https://djbook-backend-production.up.railway.app'

export type DjPhoto = {
  url: string
  sortOrder: number
}

export type DjSocialLink = {
  platform: string
  url: string
  title: string | null
  thumbnailUrl: string | null
}

export type DjEvent = {
  id: string
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
  id: string
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
      socialLinks { platform url title thumbnailUrl }
      sectionOrder
      events {
        id
        title
        venue
        date
        startTime
        eventStatus
        ticketsUrl
      }
      releases {
        id
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

export function resolvePhotoUrl(relativeUrl: string): string {
  if (relativeUrl.startsWith('http')) return relativeUrl
  return `${DJBOOK_BASE_URL}${relativeUrl}`
}

function buildTikTokCards(links: DjSocialLink[]): DjTikTokCard[] {
  return links
    .filter((link) => link.platform.toLowerCase() === 'tiktok' && link.url)
    .map((link) => {
      const title = typeof link.title === 'string' ? link.title.trim() : ''
      const thumbnail = typeof link.thumbnailUrl === 'string' ? link.thumbnailUrl.trim() : ''
      return {
        href: link.url,
        title: title || null,
        thumbnailUrl: thumbnail ? resolvePhotoUrl(thumbnail) : null,
      }
    })
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
    const releases = (profile.releases ?? []).map((release) => ({
      id: release.id,
      title: release.title ?? '',
      artist: release.artist ?? '',
      artworkUrl: release.artworkUrl ?? '',
      songLinkUrl: release.songLinkUrl ?? '',
      platforms: release.platforms ?? [],
    }))
    console.log('[dj releases] fetch length', releases.length)
    const socialLinks = (profile.socialLinks ?? []).map((link) => ({
      platform: link.platform,
      url: link.url,
      title: link.title ?? null,
      thumbnailUrl: link.thumbnailUrl ?? null,
    }))

    return {
      ...profile,
      socialLinks,
      photos: profile.photos ?? [],
      events: profile.events ?? [],
      releases,
      genres: profile.genres ?? [],
      sectionOrder: profile.sectionOrder ?? null,
      tiktokCards: buildTikTokCards(socialLinks),
    }
  } catch {
    return null
  }
}
