'use client'

import { useState } from 'react'
import type { Project } from '@/lib/db'
import ProjectCard from './ProjectCard'
import FilterBar from './FilterBar'

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.tags.includes(filter))

  return (
    <div>
      <div className="mb-5">
        <FilterBar active={filter} onChange={setFilter} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  )
}
