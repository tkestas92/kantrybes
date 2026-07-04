import Image from 'next/image'
import { Calendar, ExternalLink, MapPin, Music2, Ticket } from 'lucide-react'
import { resolvePhotoUrl, type DjProfile } from '@/lib/djbook'

type Props = {
  profile: DjProfile
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs text-gray-600 uppercase tracking-widest">{title}</span>
      <div className="flex-1 h-px bg-[#1e1e1e]" />
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

export default function DjProfileSection({ profile }: Props) {
  const photos = [...profile.photos].sort((a, b) => a.sortOrder - b.sortOrder)
  const heroPhoto = photos[0] ?? null
  const galleryPhotos = heroPhoto ? photos.slice(1) : photos
  const upcomingEvents = getUpcomingEvents(profile.events)
  const socialLinks = groupSocialLinksByPlatform(profile.socialLinks)

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {heroPhoto && (
            <div className="shrink-0 w-full sm:w-48 md:w-56">
              <div className="overflow-hidden rounded-xl border border-[#252525] bg-[#161616] aspect-[4/5] sm:aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePhotoUrl(heroPhoto.url)}
                  alt={`${profile.djName} — profilio nuotrauka`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-medium text-white mb-4">{profile.djName}</h1>
            <p className="text-[15px] text-gray-500 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>

            {profile.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {profile.genres.map((genre) => (
                  <span
                    key={genre}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-purple-950 text-purple-400"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-white hover:border-[#444] transition-all"
                  >
                    <ExternalLink size={14} />
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {galleryPhotos.length > 0 && (
        <section>
          <SectionHeader title="Galerija" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {galleryPhotos.map((photo) => (
              <div
                key={photo.url}
                className="overflow-hidden rounded-lg border border-[#252525] bg-[#161616] aspect-square"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePhotoUrl(photo.url)}
                  alt={`${profile.djName} — nuotrauka ${photo.sortOrder + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section>
          <SectionHeader title="Artimiausi renginiai" />
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={`${event.date}-${event.startTime}-${event.title}`}
                className="bg-[#161616] border border-[#252525] rounded-xl px-5 py-4 hover:border-[#333] transition-all"
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
                      className="shrink-0 flex items-center gap-1.5 text-[12px] text-gray-400 border border-[#2a2a2a] rounded-lg px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
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

      {profile.releases.length > 0 && (
        <section>
          <SectionHeader title="Leidiniai" />
          <div className="flex flex-col gap-3">
            {profile.releases.map((release) => (
              <a
                key={`${release.title}-${release.artist}`}
                href={release.songLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#161616] border border-[#252525] rounded-xl p-4 flex items-center gap-4 hover:border-[#333] hover:bg-[#1e1e1e] transition-all"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#2a2a2a]">
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
    </div>
  )
}
