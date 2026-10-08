'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Music2, Ticket } from 'lucide-react'
import ProfilePhoto from '@/components/ProfilePhoto'
import DjPhotoLightbox from '@/components/DjPhotoLightbox'
import {
  parseSectionOrder,
  type DjProfile,
  type DjSectionKey,
  type DjSocialLink,
  type DjTikTokCard,
} from '@/lib/djbook'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

type Props = {
  profile: DjProfile
  labels: (typeof t)['lt']['dj']
  lang: Lang
}

const CARD_BORDER = 'border border-white/[0.07]'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] text-white uppercase tracking-widest">{title}</span>
      <div className="flex-1 h-px bg-white/[0.07]" />
    </div>
  )
}

function formatEventDate(date: string, startTime: string, lang: Lang): string {
  const [hours, minutes] = startTime.split(':')
  const d = new Date(`${date}T${hours}:${minutes}:00`)
  return d.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
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
    .filter((event) => {
      if (event.eventStatus !== 'CONFIRMED' && event.eventStatus !== 'PENDING') return false
      return new Date(`${event.date}T00:00:00`) >= today
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
}

function findSocialUrl(links: DjSocialLink[], platform: string): string | null {
  return links.find((link) => link.platform.toLowerCase() === platform.toLowerCase())?.url ?? null
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

const SOCIAL_ICON_BUTTONS: {
  platform: 'Facebook' | 'Instagram' | 'Twitter'
  label: string
  bordered: boolean
}[] = [
  { platform: 'Facebook', label: 'Facebook', bordered: false },
  { platform: 'Instagram', label: 'Instagram', bordered: false },
  { platform: 'Twitter', label: 'X', bordered: true },
]

function SocialBrandIcon({ platform }: { platform: 'Facebook' | 'Instagram' | 'Twitter' }) {
  const className = 'h-[22px] w-[22px] text-white'

  if (platform === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6.04 4.42 11.06 10.2 11.97v-8.47H7.13v-3.5h3.07V9.41c0-3.02 1.8-4.69 4.56-4.69 1.32 0 2.7.23 2.7.23v2.97h-1.52c-1.5 0-1.97.93-1.97 1.88v2.26h3.35l-.53 3.5h-2.82v8.47C19.58 23.13 24 18.11 24 12.07z" />
      </svg>
    )
  }

  if (platform === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.67.52.73.29 1.35.68 1.97 1.3.62.62 1.01 1.24 1.3 1.97.28.7.47 1.5.52 2.67.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.52 2.67-.29.73-.68 1.35-1.3 1.97-.62.62-1.24 1.01-1.97 1.3-.7.28-1.5.47-2.67.52-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.67-.52a5.3 5.3 0 0 1-1.97-1.3 5.3 5.3 0 0 1-1.3-1.97c-.28-.7-.47-1.5-.52-2.67C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.52-2.67.29-.73.68-1.35 1.3-1.97.62-.62 1.24-1.01 1.97-1.3.7-.28 1.5-.47 2.67-.52C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.75.07-1.01.05-1.56.22-1.93.37-.48.19-.82.41-1.18.77-.36.36-.58.7-.77 1.18-.15.37-.32.92-.37 1.93-.06 1.23-.07 1.6-.07 4.75s.01 3.52.07 4.75c.05 1.01.22 1.56.37 1.93.19.48.41.82.77 1.18.36.36.7.58 1.18.77.37.15.92.32 1.93.37 1.23.06 1.6.07 4.75.07s3.52-.01 4.75-.07c1.01-.05 1.56-.22 1.93-.37.48-.19.82-.41 1.18-.77.36-.36.58-.7.77-1.18.15-.37.32-.92.37-1.93.06-1.23.07-1.6.07-4.75s-.01-3.52-.07-4.75c-.05-1.01-.22-1.56-.37-1.93a3.2 3.2 0 0 0-.77-1.18 3.2 3.2 0 0 0-1.18-.77c-.37-.15-.92-.32-1.93-.37-1.23-.06-1.6-.07-4.75-.07zm0 3.67a4.37 4.37 0 1 1 0 8.74 4.37 4.37 0 0 1 0-8.74zm0 1.8a2.57 2.57 0 1 0 0 5.14 2.57 2.57 0 0 0 0-5.14zm4.9-3.03a1.02 1.02 0 1 1-2.04 0 1.02 1.02 0 0 1 2.04 0z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-white" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  )
}

function TikTokCardView({ card }: { card: DjTikTokCard }) {
  if (!card.thumbnailUrl) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex h-[180px] w-[min(100%,280px)] shrink-0 snap-start items-center justify-center rounded-2xl bg-[#161616] ${CARD_BORDER}`}
      >
        <TikTokMark />
      </a>
    )
  }

  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block h-[180px] w-[min(100%,320px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#161616] ${CARD_BORDER}`}
    >
      <img src={card.thumbnailUrl} alt={card.title ?? 'TikTok'} className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
      {card.title ? (
        <p className="pointer-events-none absolute left-3 right-3 top-3 text-[13px] font-bold leading-snug text-white line-clamp-2">
          {card.title}
        </p>
      ) : null}
      <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white">
        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-6 w-6" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </a>
  )
}

export default function DjProfileSection({ profile, labels, lang }: Props) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)
  const photos = [...profile.photos].sort((a, b) => a.sortOrder - b.sortOrder)
  const heroPhoto = photos[0] ?? null
  const galleryPhotos = heroPhoto ? photos.slice(1) : photos
  const upcomingEvents = getUpcomingEvents(profile.events)
  const soundCloudUrl = getSoundCloudProfileUrl(profile.socialLinks)
  const youtubeVideos = getYouTubeVideos(profile.socialLinks)
  const tiktokCards = profile.tiktokCards ?? []
  const socialButtons = SOCIAL_ICON_BUTTONS.flatMap((item) => {
    const url = findSocialUrl(profile.socialLinks, item.platform)
    return url ? [{ ...item, url }] : []
  })
  const sectionOrder = parseSectionOrder(profile.sectionOrder)

  const sections: Record<DjSectionKey, ReactNode> = {
    photos:
      galleryPhotos.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title={labels.gallery} />
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory">
            {galleryPhotos.map((photo, index) => (
              <button
                key={`${photo.sortOrder}-${photo.url}`}
                type="button"
                onClick={() => setPhotoIndex(heroPhoto ? index + 1 : index)}
                className={`shrink-0 snap-start overflow-hidden rounded-[12px] bg-[#161616] ${CARD_BORDER}`}
              >
                <ProfilePhoto
                  src={photo.url}
                  alt={`${profile.djName} — ${labels.photoAlt} ${photo.sortOrder + 1}`}
                  className="block h-[120px] w-[120px] object-cover"
                />
              </button>
            ))}
          </div>
        </section>
      ) : null,
    events:
      upcomingEvents.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title={labels.events} />
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={`${event.date}-${event.startTime}-${event.title}`}
                className={`bg-[#161616] rounded-2xl px-5 py-4 ${CARD_BORDER}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-white">{event.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[12px] text-white">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        {event.venue}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatEventDate(event.date, event.startTime, lang)}
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
                      {labels.tickets}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    soundcloud: soundCloudUrl ? (
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
    ) : null,
    youtube:
      youtubeVideos.length > 0 ? (
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
      ) : null,
    tiktok:
      tiktokCards.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title="TikTok" />
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory">
            {tiktokCards.map((card) => (
              <TikTokCardView key={card.href} card={card} />
            ))}
          </div>
        </section>
      ) : null,
    releases:
      profile.releases.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title={labels.releases} />
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory">
            {profile.releases.map((release) => (
              <a
                key={`${release.title}-${release.artist}`}
                href={release.songLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex w-[min(100%,72vw)] shrink-0 snap-start items-center gap-3 rounded-[14px] bg-[#161616] p-3 ${CARD_BORDER} hover:bg-[#1a1a1a] transition-colors`}
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#0a0a0a]">
                  {release.artworkUrl ? (
                    <Image
                      src={release.artworkUrl}
                      alt={`${release.title} — ${labels.artworkAlt}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/40">
                      <Music2 size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-white group-hover:text-[#4afa8a]">
                    {release.title}
                  </p>
                  <p className="mt-1 truncate text-[13px] text-white/70">{release.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null,
    social:
      socialButtons.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title={labels.social} />
          <div className="flex flex-wrap gap-[10px]">
            {socialButtons.map((button) => (
              <a
                key={button.platform}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={button.label}
                title={button.label}
                className={`flex h-12 w-12 items-center justify-center rounded-[12px] bg-[rgba(255,255,255,0.06)] ${
                  button.bordered ? 'border border-[rgba(255,255,255,0.1)]' : 'border-0'
                }`}
              >
                <SocialBrandIcon platform={button.platform} />
              </a>
            ))}
          </div>
        </section>
      ) : null,
  }

  return (
    <div className="-mx-6 bg-[#0a0a0a] pb-10 text-white">
      {/* Hero */}
      <section className="relative w-full h-[50vh] min-h-[280px] max-h-[520px] overflow-hidden bg-[#161616]">
        {heroPhoto ? (
          <button
            type="button"
            onClick={() => setPhotoIndex(0)}
            className="absolute inset-0"
            aria-label={`${profile.djName} — ${labels.heroPhotoAlt}`}
          >
            <ProfilePhoto
              src={heroPhoto.url}
              alt={`${profile.djName} — ${labels.heroPhotoAlt}`}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 35%, rgba(10, 10, 10, 0.55) 65%, #0a0a0a 100%)',
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-5">
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-white">
            {profile.djName}
          </h1>
          <p className="mt-1 text-[14px] text-white/70">{labels.tagline}</p>
        </div>
      </section>

      {/* Bio & genres */}
      <section className="px-6 pt-5 pb-2">
        <p className="text-[15px] text-white leading-relaxed whitespace-pre-line">
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

      {sectionOrder.map((key) =>
        sections[key] ? <div key={key}>{sections[key]}</div> : null
      )}

      {photoIndex !== null && (
        <DjPhotoLightbox
          photos={photos}
          index={photoIndex}
          alt={profile.djName}
          onClose={() => setPhotoIndex(null)}
          onIndexChange={setPhotoIndex}
        />
      )}
    </div>
  )
}
