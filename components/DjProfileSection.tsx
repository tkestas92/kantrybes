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

function dedupeSocialLinks(links: DjProfile['socialLinks']) {
  const seen = new Set<string>()
  return links.filter((link) => {
    if (seen.has(link.url)) return false
    seen.add(link.url)
    return true
  })
}

export default function DjProfileSection({ profile }: Props) {
  const photos = [...profile.photos].sort((a, b) => a.sortOrder - b.sortOrder)
  const upcomingEvents = getUpcomingEvents(profile.events)
  const socialLinks = dedupeSocialLinks(profile.socialLinks)

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-[28px] font-medium text-white mb-4">{profile.djName}</h1>
        <p className="text-[15px] text-gray-500 leading-relaxed whitespace-pre-line max-w-lg">
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
                key={link.url}
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
      </section>

      {photos.length > 0 && (
        <section>
          <SectionHeader title="Galerija" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.url}
                className="relative aspect-square overflow-hidden rounded-lg border border-[#252525] bg-[#161616]"
              >
                <Image
                  src={resolvePhotoUrl(photo.url)}
                  alt={`${profile.djName} — nuotrauka ${photo.sortOrder + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
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
