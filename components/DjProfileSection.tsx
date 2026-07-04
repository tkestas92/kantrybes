import Image from 'next/image'
import { Calendar, ExternalLink, MapPin, Music2, Smartphone, Ticket } from 'lucide-react'
import ProfilePhoto from '@/components/ProfilePhoto'
import { type DjProfile, type DjSocialLink } from '@/lib/djbook'

type Props = {
  profile: DjProfile
}

const CARD_BORDER = 'border border-white/[0.07]'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] text-gray-500 uppercase tracking-widest">{title}</span>
      <div className="flex-1 h-px bg-white/[0.07]" />
    </div>
  )
}

function formatEventDate(date: string, startTime: string): string {
  const [hours, minutes] = startTime.split(':')
  const d = new Date(`${date}T${hours}:${minutes}:00`)
  return d.toLocaleDateString('lt-LT', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatEventTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':')
  return `${hours}:${minutes}`
}

function getUpcomingEvents(events: DjProfile['events']) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return events
    .filter((event) => new Date(`${event.date}T00:00:00`) >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
}

function groupSocialLinksByPlatform(links: DjProfile['socialLinks']) {
  const byPlatform = new Map<string, string>()

  for (const link of links) {
    if (!byPlatform.has(link.platform)) {
      byPlatform.set(link.platform, link.url)
    }
  }

  return Array.from(byPlatform.entries()).map(([platform, url]) => ({ platform, url }))
}

function getSoundCloudProfileUrl(links: DjSocialLink[]): string | null {
  return links.find((link) => link.platform === 'SoundCloud')?.url ?? null
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1).split('/')[0] || null
    }

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2] || null
      }
      return parsed.searchParams.get('v')
    }
  } catch {
    return null
  }

  return null
}

function getYouTubeVideos(links: DjSocialLink[]) {
  const seen = new Set<string>()

  return links
    .filter((link) => link.platform === 'YouTube')
    .map((link) => {
      const id = extractYouTubeVideoId(link.url)
      if (!id || seen.has(id)) return null
      seen.add(id)
      return { id, url: link.url }
    })
    .filter((video): video is { id: string; url: string } => video !== null)
}

function normalizeSoundCloudUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.hostname = parsed.hostname.replace(/^www\./, '')
    return `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '')
  } catch {
    return url.replace(/^https?:\/\/www\./i, 'https://').replace(/\/$/, '')
  }
}

function getSoundCloudEmbedUrl(profileUrl: string) {
  const normalized = normalizeSoundCloudUrl(profileUrl)
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(normalized)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`
}

function SocialIcon({ platform }: { platform: string }) {
  const className = 'h-[18px] w-[18px]'

  switch (platform) {
    case 'TikTok':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
        </svg>
      )
    case 'YouTube':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      )
    case 'Facebook':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6.04 4.42 11.06 10.2 11.97v-8.47H7.13v-3.5h3.07V9.41c0-3.02 1.8-4.69 4.56-4.69 1.32 0 2.7.23 2.7.23v2.97h-1.52c-1.5 0-1.97.93-1.97 1.88v2.26h3.35l-.53 3.5h-2.82v8.47C19.58 23.13 24 18.11 24 12.07z" />
        </svg>
      )
    case 'Instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.67.52.73.29 1.35.68 1.97 1.3.62.62 1.01 1.24 1.3 1.97.28.7.47 1.5.52 2.67.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.52 2.67-.29.73-.68 1.35-1.3 1.97-.62.62-1.24 1.01-1.97 1.3-.7.28-1.5.47-2.67.52-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.67-.52a5.3 5.3 0 0 1-1.97-1.3 5.3 5.3 0 0 1-1.3-1.97c-.28-.7-.47-1.5-.52-2.67C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.52-2.67.29-.73.68-1.35 1.3-1.97.62-.62 1.24-1.01 1.97-1.3.7-.28 1.5-.47 2.67-.52C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.75.07-1.01.05-1.56.22-1.93.37-.48.19-.82.41-1.18.77-.36.36-.58.7-.77 1.18-.15.37-.32.92-.37 1.93-.06 1.23-.07 1.6-.07 4.75s.01 3.52.07 4.75c.05 1.01.22 1.56.37 1.93.19.48.41.82.77 1.18.36.36.7.58 1.18.77.37.15.92.32 1.93.37 1.23.06 1.6.07 4.75.07s3.52-.01 4.75-.07c1.01-.05 1.56-.22 1.93-.37.48-.19.82-.41 1.18-.77.36-.36.58-.7.77-1.18.15-.37.32-.92.37-1.93.06-1.23.07-1.6.07-4.75s-.01-3.52-.07-4.75c-.05-1.01-.22-1.56-.37-1.93a3.2 3.2 0 0 0-.77-1.18 3.2 3.2 0 0 0-1.18-.77c-.37-.15-.92-.32-1.93-.37-1.23-.06-1.6-.07-4.75-.07zm0 3.67a4.37 4.37 0 1 1 0 8.74 4.37 4.37 0 0 1 0-8.74zm0 1.8a2.57 2.57 0 1 0 0 5.14 2.57 2.57 0 0 0 0-5.14zm4.9-3.03a1.02 1.02 0 1 1-2.04 0 1.02 1.02 0 0 1 2.04 0z" />
        </svg>
      )
    case 'SoundCloud':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
          <path d="M1.175 13.5c-.22 0-.4.18-.4.4v2.4c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-2.4c0-.22-.18-.4-.4-.4h-1.2zm1.8-1.2c-.22 0-.4.18-.4.4v3.6c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-3.6c0-.22-.18-.4-.4-.4h-1.2zm1.8-.6c-.22 0-.4.18-.4.4v4.2c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-4.2c0-.22-.18-.4-.4-.4h-1.2zm1.8-.6c-.22 0-.4.18-.4.4v4.8c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-4.8c0-.22-.18-.4-.4-.4h-1.2zm1.8-.3c-.22 0-.4.18-.4.4v5.1c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-5.1c0-.22-.18-.4-.4-.4h-1.2zm1.8 0c-.22 0-.4.18-.4.4v5.1c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-5.1c0-.22-.18-.4-.4-.4h-1.2zm1.8.3c-.22 0-.4.18-.4.4v4.8c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-4.8c0-.22-.18-.4-.4-.4h-1.2zm1.8.6c-.22 0-.4.18-.4.4v4.2c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-4.2c0-.22-.18-.4-.4-.4h-1.2zm1.8 1.2c-.22 0-.4.18-.4.4v3.6c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-3.6c0-.22-.18-.4-.4-.4h-1.2zm1.8 1.8c-.22 0-.4.18-.4.4v2.4c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-2.4c0-.22-.18-.4-.4-.4h-1.2zm2.1-8.1c-.22 0-.4.18-.4.4v11.4c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4V8.7c0-.22-.18-.4-.4-.4h-1.2zm2.1 1.5c-.22 0-.4.18-.4.4v9.6c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-9.6c0-.22-.18-.4-.4-.4h-1.2zm2.1 1.5c-.22 0-.4.18-.4.4v7.2c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-7.2c0-.22-.18-.4-.4-.4h-1.2zm2.1 1.5c-.22 0-.4.18-.4.4v4.8c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-4.8c0-.22-.18-.4-.4-.4h-1.2zm2.1 0c-.22 0-.4.18-.4.4v4.8c0 .22.18.4.4.4h1.2c.22 0 .4-.18.4-.4v-4.8c0-.22-.18-.4-.4-.4h-1.2z" />
        </svg>
      )
    default:
      return <ExternalLink size={18} aria-hidden />
  }
}

function DjBookBadge() {
  return (
    <div className="mb-4 flex flex-col items-start gap-1.5">
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[12px] text-white/60"
        title="DJ profile powered by my DJBook app"
      >
        <Smartphone size={12} className="shrink-0 text-white/50" aria-hidden />
        <span>
          <span className="text-white/70">DJBook</span>
          <span className="text-white/45"> · new name in progress</span>
        </span>
      </span>
      <p className="text-[11px] text-white/35 leading-snug">
        DJ profile powered by my DJBook app
      </p>
    </div>
  )
}

export default function DjProfileSection({ profile }: Props) {
  const photos = [...profile.photos].sort((a, b) => a.sortOrder - b.sortOrder)
  const heroPhoto = photos[0] ?? null
  const galleryPhotos = heroPhoto ? photos.slice(1) : photos
  const upcomingEvents = getUpcomingEvents(profile.events)
  const socialLinks = groupSocialLinksByPlatform(profile.socialLinks)
  const soundCloudUrl = getSoundCloudProfileUrl(profile.socialLinks)
  const youtubeVideos = getYouTubeVideos(profile.socialLinks)

  return (
    <div className="-mx-6 bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="relative w-full h-[50vh] min-h-[280px] max-h-[520px] overflow-hidden bg-[#161616]">
        {heroPhoto ? (
          <ProfilePhoto
            src={heroPhoto.url}
            alt={`${profile.djName} — profilio nuotrauka`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
        )}

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 35%, rgba(10, 10, 10, 0.55) 65%, #0a0a0a 100%)',
          }}
        />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-5">
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-white">
            {profile.djName}
          </h1>
          <p className="mt-1 text-[14px] text-white/70">DJ · Vilnius</p>
        </div>
      </section>

      {/* Bio & genres */}
      <section className="px-6 pt-5 pb-2">
        <DjBookBadge />
        <p className="text-[15px] text-gray-400 leading-relaxed whitespace-pre-line">
          {profile.bio}
        </p>

        {profile.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {profile.genres.map((genre) => (
              <span
                key={genre}
                className={`text-[11px] px-3 py-1.5 rounded-full font-medium bg-[#161616] text-gray-300 ${CARD_BORDER}`}
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Gallery */}
      {galleryPhotos.length > 0 && (
        <section className="px-6 pt-8">
          <SectionHeader title="Galerija" />
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory">
            {galleryPhotos.map((photo) => (
              <div
                key={`${photo.sortOrder}-${photo.url}`}
                className={`shrink-0 snap-start overflow-hidden rounded-[12px] bg-[#161616] ${CARD_BORDER}`}
              >
                <ProfilePhoto
                  src={photo.url}
                  alt={`${profile.djName} — nuotrauka ${photo.sortOrder + 1}`}
                  className="block h-[120px] w-[120px] object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Events */}
      {upcomingEvents.length > 0 && (
        <section className="px-6 pt-8">
          <SectionHeader title="Artimiausi renginiai" />
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={`${event.date}-${event.startTime}-${event.title}`}
                className={`bg-[#161616] rounded-2xl px-5 py-4 ${CARD_BORDER}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-white">{event.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[12px] text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        {event.venue}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatEventDate(event.date, event.startTime)}
                      </span>
                      <span>{formatEventTime(event.startTime)}</span>
                    </div>
                  </div>
                  {event.ticketsUrl && (
                    <a
                      href={event.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`shrink-0 flex items-center gap-1.5 text-[12px] text-gray-300 bg-[#0a0a0a] rounded-xl px-3 py-1.5 ${CARD_BORDER} hover:text-white transition-colors`}
                    >
                      <Ticket size={13} />
                      Bilietai
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SoundCloud */}
      {soundCloudUrl && (
        <section className="px-6 pt-8">
          <SectionHeader title="SoundCloud" />
          <div className={`overflow-hidden rounded-2xl bg-[#161616] ${CARD_BORDER}`}>
            <iframe
              title="SoundCloud player"
              width="100%"
              height="300"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={getSoundCloudEmbedUrl(soundCloudUrl)}
              className="block w-full border-0"
            />
          </div>
        </section>
      )}

      {/* YouTube */}
      {youtubeVideos.length > 0 && (
        <section className="px-6 pt-8">
          <SectionHeader title="YouTube" />
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory">
            {youtubeVideos.map((video) => (
              <div
                key={video.id}
                className={`shrink-0 snap-start w-[min(100%,320px)] overflow-hidden rounded-2xl bg-[#161616] ${CARD_BORDER}`}
              >
                <iframe
                  title={`YouTube video ${video.id}`}
                  width="100%"
                  height="180"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="block w-full border-0"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Releases */}
      {profile.releases.length > 0 && (
        <section className="px-6 pt-8">
          <SectionHeader title="Leidiniai" />
          <div className="flex flex-col gap-3">
            {profile.releases.map((release) => (
              <a
                key={`${release.title}-${release.artist}`}
                href={release.songLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group bg-[#161616] rounded-2xl p-4 flex items-center gap-4 ${CARD_BORDER} hover:bg-[#1a1a1a] transition-colors`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={release.artworkUrl}
                    alt={`${release.title} — viršelis`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-white group-hover:text-[#4afa8a] transition-colors truncate">
                    {release.title}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5 truncate">{release.artist}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-600">
                    <Music2 size={12} />
                    <span>Klausyti visur</span>
                  </div>
                </div>
                <ExternalLink size={16} className="shrink-0 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Social links */}
      {socialLinks.length > 0 && (
        <section className="px-6 pt-8 pb-10">
          <SectionHeader title="Social" />
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                title={link.platform}
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#161616] text-gray-300 ${CARD_BORDER} hover:text-white hover:bg-[#1a1a1a] transition-colors`}
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
