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

export type DjProfile = {
  id: string
  djName: string
  bio: string
  genres: string[]
  photos: DjPhoto[]
  socialLinks: DjSocialLink[]
  events: DjEvent[]
  releases: DjRelease[]
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
      next: { revalidate: 300 },
    })

    if (!res.ok) return null

    const json = await res.json()
    if (json.errors?.length || !json.data?.publicDjProfile) return null

    return json.data.publicDjProfile as DjProfile
  } catch {
    return null
  }
}
