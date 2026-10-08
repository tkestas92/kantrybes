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

const TIKTOK_BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const TIKTOK_SUCCESS_REVALIDATE = 3600
const TIKTOK_FAILURE_REVALIDATE = 60

function extractTikTokVideoId(url: string): string | null {
  return url.match(/\/video\/(\d+)/)?.[1] ?? null
}

function tiktokWatchUrl(videoId: string): string {
  return `https://www.tiktok.com/@/video/${videoId}`
}

async function tiktokFetch(url: string, revalidate: number): Promise<Response> {
  return fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': TIKTOK_BROWSER_UA,
      Accept: '*/*',
    },
    next: { revalidate },
  })
}

/** Successes stay cached for an hour. A failed response is requested again with a 60s lifetime. */
async function tiktokFetchCached(url: string): Promise<Response> {
  try {
    const res = await tiktokFetch(url, TIKTOK_SUCCESS_REVALIDATE)
    if (res.ok) return res
    console.error('[TikTok] response not ok', { url, status: res.status })
  } catch (error) {
    console.error('[TikTok] fetch failed', { url, error })
  }

  return tiktokFetch(url, TIKTOK_FAILURE_REVALIDATE)
}

async function resolveTikTokVideoId(shortUrl: string): Promise<string | null> {
  const directId = extractTikTokVideoId(shortUrl)
  if (directId) return directId

  const res = await tiktokFetchCached(shortUrl)
  const videoId = extractTikTokVideoId(res.url)
  if (!res.ok || !videoId) {
    console.error('[TikTok] short link did not yield a video id', {
      shortUrl,
      status: res.status,
      finalUrl: res.url,
      videoId,
    })
    return null
  }
  return videoId
}

async function fetchTikTokOEmbed(
  videoId: string
): Promise<{ title: string | null; thumbnailUrl: string | null; status: number } | null> {
  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokWatchUrl(videoId))}`
  const res = await tiktokFetchCached(endpoint)
  if (!res.ok) return { title: null, thumbnailUrl: null, status: res.status }

  let data: { title?: string; thumbnail_url?: string }
  try {
    data = (await res.json()) as { title?: string; thumbnail_url?: string }
  } catch (error) {
    console.error('[TikTok] oEmbed JSON parse failed', { videoId, status: res.status, error })
    return { title: null, thumbnailUrl: null, status: res.status }
  }

  const title = typeof data.title === 'string' ? data.title.trim() : ''
  if (!data.thumbnail_url) {
    console.error('[TikTok] oEmbed missing thumbnail_url', { videoId, status: res.status })
    return { title: title || null, thumbnailUrl: null, status: res.status }
  }

  return {
    title: title || null,
    thumbnailUrl: data.thumbnail_url,
    status: res.status,
  }
}

export async function loadTikTokCards(links: DjSocialLink[]): Promise<DjTikTokCard[]> {
  const tiktokLinks = links.filter((link) => link.platform.toLowerCase() === 'tiktok' && link.url)
  const cards = await Promise.all(
    tiktokLinks.map(async (link): Promise<DjTikTokCard> => {
      let videoId: string | null = null
      let oembedStatus: number | null = null
      try {
        videoId = await resolveTikTokVideoId(link.url)
        if (!videoId) {
          console.log('[TikTok]', { shortUrl: link.url, videoId, oembedStatus })
          return { href: link.url, title: null, thumbnailUrl: null }
        }

        const href = tiktokWatchUrl(videoId)
        const oembed = await fetchTikTokOEmbed(videoId)
        oembedStatus = oembed?.status ?? null
        console.log('[TikTok]', { shortUrl: link.url, videoId, oembedStatus })

        if (!oembed?.thumbnailUrl) {
          return { href, title: null, thumbnailUrl: null }
        }
        return { href, title: oembed.title, thumbnailUrl: oembed.thumbnailUrl }
      } catch (error) {
        console.error('[TikTok] link failed', { shortUrl: link.url, videoId, oembedStatus, error })
        console.log('[TikTok]', { shortUrl: link.url, videoId, oembedStatus })
        return {
          href: videoId ? tiktokWatchUrl(videoId) : link.url,
          title: null,
          thumbnailUrl: null,
        }
      }
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
    const releases = (profile.releases ?? []).map((release) => ({
      id: release.id,
      title: release.title ?? '',
      artist: release.artist ?? '',
      artworkUrl: release.artworkUrl ?? '',
      songLinkUrl: release.songLinkUrl ?? '',
      platforms: release.platforms ?? [],
    }))
    console.log('[dj releases] fetch length', releases.length)
    const socialLinks = profile.socialLinks ?? []
    let tiktokCards: DjTikTokCard[] = socialLinks
      .filter((link) => link.platform.toLowerCase() === 'tiktok' && link.url)
      .map((link) => ({ href: link.url, title: null, thumbnailUrl: null }))
    try {
      tiktokCards = await loadTikTokCards(socialLinks)
    } catch (error) {
      console.error('[TikTok] failed to load cards', error)
    }

    return {
      ...profile,
      socialLinks,
      photos: profile.photos ?? [],
      events: profile.events ?? [],
      releases,
      genres: profile.genres ?? [],
      sectionOrder: profile.sectionOrder ?? null,
      tiktokCards,
    }
  } catch {
    return null
  }
}
