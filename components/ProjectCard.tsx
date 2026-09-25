import { Github, Globe, Smartphone } from 'lucide-react'
import type { Project } from '@/lib/db'
import { resolveLiveDemoType, type LiveDemoType } from '@/lib/liveDemo'
import type { t } from '@/lib/translations'

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
}

export default function ProjectCard({ project, labels, onLiveClick }: Props) {
  const liveType = resolveLiveDemoType(project)
  const liveLabel = liveType
    ? liveType === 'app'
      ? labels.liveDemo.appButton
      : labels.liveDemo.webButton
    : 'Live'
  const LiveIcon = liveType === 'app' ? Smartphone : Globe

  const tagLabels: Record<string, string> = {
    go: labels.filters.go,
    rn: labels.filters.rn,
    py: labels.filters.py,
    kt: labels.filters.kt,
    ml: labels.filters.ml,
  }

  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-5 hover:border-[#333] hover:bg-[#1e1e1e] transition-all duration-200 flex flex-col gap-4 h-full">
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
      {project.image_url ? (
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-black flex items-center justify-center">
          <img src={project.image_url} alt={project.title} className="w-full h-full object-contain" />
        </div>
      ) : (
        project.emoji && <span className="text-2xl">{project.emoji}</span>
      )}

      <div>
        <h3 className="text-[15px] font-medium text-white mb-1.5">{project.title}</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[11px] px-2 py-0.5 rounded font-medium ${TAG_STYLES[tag] || 'bg-gray-800 text-gray-400'}`}
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
            className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
          >
            <Github size={13} /> {labels.github}
          </a>
        )}
        {project.live_url && liveType && (
          onLiveClick ? (
            <button
              type="button"
              onClick={() => onLiveClick(project.live_url!, project.title, liveType)}
              className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
            >
              <LiveIcon size={13} /> {liveLabel}
            </button>
          ) : (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-[#2a2a2a] rounded-md px-3 py-1.5 hover:text-white hover:border-[#444] transition-all"
            >
              <LiveIcon size={13} /> {liveLabel}
            </a>
          )
        )}
      </div>
    </div>
  )
}
