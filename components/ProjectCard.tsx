import { Github, Globe, Smartphone } from 'lucide-react'
import type { Project } from '@/lib/db'
import { LIVE_DEMO_LABELS, resolveLiveDemoType, type LiveDemoType } from '@/lib/liveDemo'

type Props = {
  project: Project
  onLiveClick?: (url: string, title: string, type: LiveDemoType) => void
}

const TAG_STYLES: Record<string, string> = {
  go: 'bg-blue-950 text-blue-400',
  rn: 'bg-purple-950 text-purple-400',
  py: 'bg-green-950 text-green-400',
  kt: 'bg-red-950 text-red-400',
  ml: 'bg-amber-950 text-amber-400',
}

const TAG_LABELS: Record<string, string> = {
  go: 'Go',
  rn: 'React Native',
  py: 'Python',
  kt: 'Kotlin',
  ml: 'ML / AI',
}

export default function ProjectCard({ project, onLiveClick }: Props) {
  const liveType = resolveLiveDemoType(project)
  const liveLabel = liveType ? LIVE_DEMO_LABELS[liveType].button : 'Live'
  const LiveIcon = liveType === 'app' ? Smartphone : Globe

  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl p-5 hover:border-[#333] hover:bg-[#1e1e1e] transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{project.emoji}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          project.status === 'in_progress'
            ? 'bg-amber-950 text-amber-400'
            : 'bg-green-950 text-green-400'
        }`}>
          {project.status === 'in_progress' ? 'In progress' : 'Baigtas'}
        </span>
      </div>

      <div>
        <h3 className="text-[15px] font-medium text-white mb-1.5">{project.title}</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">{project.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map(tag => (
          <span key={tag} className={`text-[11px] px-2 py-0.5 rounded font-medium ${TAG_STYLES[tag] || 'bg-gray-800 text-gray-400'}`}>
            {TAG_LABELS[tag] || tag}
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
            <Github size={13} /> GitHub
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
