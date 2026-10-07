import { useState } from 'react'
import { Github, Globe, Smartphone, ZoomIn } from 'lucide-react'
import type { Project } from '@/lib/db'
import { resolveLiveDemoType, type LiveDemoType } from '@/lib/liveDemo'
import type { t } from '@/lib/translations'
import PhoneMockup from '@/components/PhoneMockup'
import BrowserMockup from '@/components/BrowserMockup'
import ImageLightbox from '@/components/ImageLightbox'
import { cld } from '@/lib/cloudinary'

type Props = {
  project: Project
  labels: {
    statusInProgress: string
    statusShipped: string
    github: string
    filters: (typeof t)['lt']['filters']
    liveDemo: (typeof t)['lt']['liveDemo']
  }
  onLiveClick?: (url: string, title: string, type: LiveDemoType) => void
}

const TAG_STYLES: Record<string, string> = {
  go: 'bg-blue-950 text-blue-400',
  rn: 'bg-purple-950 text-purple-400',
  py: 'bg-green-950 text-green-400',
  kt: 'bg-red-950 text-red-400',
  ml: 'bg-amber-950 text-amber-400',
  devops: 'bg-stone-950 text-stone-300',
  linux: 'bg-slate-950 text-slate-300',
  docker: 'bg-sky-950 text-sky-400',
  bash: 'bg-lime-950 text-lime-400',
  iot: 'bg-cyan-950 text-cyan-400',
}

const TAG_LABELS: Record<string, string> = {
  go: 'Go', rn: 'React Native', py: 'Python', kt: 'Kotlin', ml: 'ML / AI', devops: 'DevOps',
  linux: 'Linux', docker: 'Docker', bash: 'Bash', iot: 'IoT',
}

const GRID_BG = {
  backgroundColor: '#0f0f0f',
  backgroundImage:
    'linear-gradient(#1f1f1f 1px, transparent 1px), linear-gradient(90deg, #1f1f1f 1px, transparent 1px)',
  backgroundSize: '16px 16px',
} as const

export default function ProjectCard({ project, labels, onLiveClick }: Props) {
  const liveType = resolveLiveDemoType(project)
  const liveLabel = liveType
    ? liveType === 'app'
      ? labels.liveDemo.appButton
      : labels.liveDemo.webButton
    : 'Live'
  const LiveIcon = liveType === 'app' ? Smartphone : Globe

  const tagLabels = TAG_LABELS
  const [zoom, setZoom] = useState(false)
  const thumb = cld(project.image_url, 'f_auto,q_auto,w_900')
  const full = cld(project.image_url, 'f_auto,q_auto,w_1800')

  return (
    <>
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-5 hover:border-[#333] hover:bg-[#1e1e1e] transition-all duration-200 flex flex-col gap-4">
      <div className="flex justify-end">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            project.status === 'in_progress'
              ? 'bg-amber-950 text-amber-400'
              : 'bg-green-950 text-green-400'
          }`}
        >
          {project.status === 'in_progress' ? labels.statusInProgress : labels.statusShipped}
        </span>
      </div>
      {project.image_url && (
        <div
          className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-[#1e1e1e] group/media cursor-zoom-in ${project.platform ? '' : 'bg-[#0d0d0d]'}`}
          style={project.platform ? GRID_BG : undefined}
          role="button"
          tabIndex={0}
          aria-label={`Peržiūrėti ${project.title} nuotrauką`}
          onClick={() => setZoom(true)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setZoom(true) } }}
        >
          {project.platform === 'app' ? (
            <PhoneMockup src={thumb} alt={project.title} />
          ) : project.platform === 'web' ? (
            <BrowserMockup src={thumb} alt={project.title} />
          ) : (
            <img src={thumb} alt={project.title} className="w-full h-full object-contain" />
          )}
          <span className="absolute bottom-2 right-2 rounded-md bg-black/60 p-1.5 text-white opacity-0 group-hover/media:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn size={14} />
          </span>
        </div>
      )}

      <div>
        <h3 className="text-[15px] font-medium text-white mb-1.5">{project.title}</h3>
        <p className="text-[13px] text-white leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[11px] px-2 py-0.5 rounded font-medium ${TAG_STYLES[tag] || 'bg-gray-800 text-white'}`}
          >
            {tagLabels[tag] || tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-auto">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
          >
            <Github size={13} /> {labels.github}
          </a>
        )}
        {project.live_url && liveType && (
          onLiveClick ? (
            <button
              type="button"
              onClick={() => onLiveClick(project.live_url!, project.title, liveType)}
              className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
            >
              <LiveIcon size={13} /> {liveLabel}
            </button>
          ) : (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-white border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
            >
              <LiveIcon size={13} /> {liveLabel}
            </a>
          )
        )}
      </div>
    </div>
    {zoom && project.image_url && (
      <ImageLightbox src={full} alt={project.title} onClose={() => setZoom(false)} />
    )}
    </>
  )
}
