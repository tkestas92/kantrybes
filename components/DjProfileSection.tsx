'use client'

import { useState, type ReactNode } from 'react'
import { useGridPulse } from '@/components/GridPulse'
import Image from 'next/image'
import { Calendar, MapPin, Music2, Ticket } from 'lucide-react'
import { FaFacebook, FaInstagram, FaPlay, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import ProfilePhoto from '@/components/ProfilePhoto'
import DjPhotoLightbox from '@/components/DjPhotoLightbox'
import ConsentEmbed from '@/components/ConsentEmbed'
import {
  parseSectionOrder,
  type DjProfile,
  type DjSectionKey,
  type DjSocialLink,
  type DjTikTokCard,
} from '@/lib/djbook'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { BpmTrigger } from '@/components/useTripleTap'

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
      <div className="h-px flex-1 bg-[#262626]" />
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

const SOCIAL_BRAND_ICONS = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  Twitter: FaXTwitter,
} as const

function SocialBrandIcon({ platform }: { platform: keyof typeof SOCIAL_BRAND_ICONS }) {
  const Icon = SOCIAL_BRAND_ICONS[platform]
  return <Icon size={22} color="#fff" aria-hidden />
}

function TikTokCardView({ card }: { card: DjTikTokCard }) {
  if (!card.thumbnailUrl) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full items-center justify-center bg-[#161616]"
      >
        <FaTiktok size={40} color="#fff" aria-hidden />
      </a>
    )
  }

  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block h-full w-full overflow-hidden bg-[#161616]"
    >
      <img src={card.thumbnailUrl} alt={card.title ?? 'TikTok'} className="h-full w-full object-cover" />
      <div className="surface-solid pointer-events-none absolute inset-x-0 top-0 h-16" />
      {card.title ? (
        <p className="pointer-events-none absolute left-3 right-3 top-3 text-[13px] font-bold leading-snug text-white line-clamp-2">
          {card.title}
        </p>
      ) : null}
      <span className="surface-solid pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white">
        <FaPlay size={24} color="#fff" aria-hidden className="ml-0.5" />
      </span>
    </a>
  )
}

export default function DjProfileSection({ profile, labels, lang }: Props) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)
  const { onGenreTap } = useGridPulse()
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
  const releases = profile.releases
  console.log('[dj releases] render length', releases.length)

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
        <ConsentEmbed service="SoundCloud" frameClassName="h-[300px] w-full">
          <iframe
            title="SoundCloud player"
            width="100%"
            height="300"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={getSoundCloudEmbedUrl(soundCloudUrl)}
            className="block h-full w-full border-0"
          />
        </ConsentEmbed>
      </section>
    ) : null,
    youtube:
      youtubeVideos.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title="YouTube" />
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory">
            {youtubeVideos.map((video) => (
              <ConsentEmbed
                key={video.id}
                service="YouTube"
                thumbnailUrl={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                className="w-[min(100%,320px)] shrink-0 snap-start"
                frameClassName="aspect-video w-full"
              >
                <iframe
                  title={`YouTube video ${video.id}`}
                  src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="block h-full w-full border-0"
                />
              </ConsentEmbed>
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
              <ConsentEmbed
                key={card.href}
                service="TikTok"
                className="w-[min(100%,320px)] shrink-0 snap-start"
                frameClassName="h-[180px] w-full"
              >
                <TikTokCardView card={card} />
              </ConsentEmbed>
            ))}
          </div>
        </section>
      ) : null,
    releases:
      releases.length > 0 ? (
        <section className="px-6 pt-8">
          <SectionHeader title={labels.releases} />
          <div
            className={
              releases.length > 2
                ? 'flex gap-3 overflow-x-auto overflow-y-hidden pb-1 scrollbar-hide snap-x snap-mandatory'
                : releases.length === 2
                  ? 'grid grid-cols-2 gap-3'
                  : 'grid grid-cols-1'
            }
          >
            {releases.map((release) => (
              <a
                key={release.id}
                href={release.songLinkUrl || undefined}
                target={release.songLinkUrl ? '_blank' : undefined}
                rel={release.songLinkUrl ? 'noopener noreferrer' : undefined}
                className={`group flex min-w-0 items-center gap-3 rounded-[14px] bg-[#161616] p-3 ${CARD_BORDER} hover:bg-[#1a1a1a] transition-colors ${
                  releases.length > 2 ? 'w-[240px] shrink-0 snap-start' : ''
                }`}
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
                className={`flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#161616] ${
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
    <div className="-mx-6 pb-10 text-white">
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
            background: 'linear-gradient(to bottom, transparent 35%, rgba(15, 15, 15, 0.55) 65%, #0f0f0f 100%)',
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-5">
          <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-white">
            <BpmTrigger className="pointer-events-auto">{profile.djName}</BpmTrigger>
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
                onClick={onGenreTap}
                className={`select-none text-[11px] px-3 py-1.5 rounded-full font-medium bg-[#161616] text-gray-300 ${CARD_BORDER}`}
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
