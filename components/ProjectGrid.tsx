'use client'

import { useState } from 'react'
import type { Project } from '@/lib/db'
import { PROJECT_TAGS, normalizeTags } from '@/lib/tags'
import ProjectCard from './ProjectCard'
import FilterBar from './FilterBar'
import LiveDemoModal from './LiveDemoModal'
import type { LiveDemoType } from '@/lib/liveDemo'
import type { t } from '@/lib/translations'

type Labels = {
  projects: {
    filterAll: string
    statusInProgress: string
    statusShipped: string
    statusArchived: string
    github: string
  }
  liveDemo: (typeof t)['lt']['liveDemo']
}

type Props = {
  projects: Project[]
  labels: Labels
}

export default function ProjectGrid({ projects, labels }: Props) {
  const [filter, setFilter] = useState('all')
  const [liveDemo, setLiveDemo] = useState<{ url: string; title: string; type: LiveDemoType } | null>(null)

  const visibleProjects = projects.map((project) => ({ ...project, tags: normalizeTags(project.tags) }))
  const filtered = filter === 'all' ? visibleProjects : visibleProjects.filter((project) => project.tags.some((tag) => tag === filter))
  const usedTags = new Set(visibleProjects.flatMap((project) => project.tags))
  const filterTags = PROJECT_TAGS.filter((tag) => usedTags.has(tag.label))

  const cardLabels = {
    ...labels.projects,
    liveDemo: labels.liveDemo,
  }

  return (
    <div>
      <div className="mb-5">
        <FilterBar
          active={filter}
          onChange={setFilter}
          filterAll={labels.projects.filterAll}
          tags={filterTags}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
        {filtered.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            labels={cardLabels}
            onLiveClick={(url, title, type) => setLiveDemo({ url, title, type })}
          />
        ))}
      </div>

      {liveDemo && (
        <LiveDemoModal
          url={liveDemo.url}
          title={liveDemo.title}
          type={liveDemo.type}
          labels={labels.liveDemo}
          onClose={() => setLiveDemo(null)}
        />
      )}
    </div>
  )
}
