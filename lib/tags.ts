export const PROJECT_TAGS = [
  { label: 'Python', className: 'bg-green-950 text-green-400' },
  { label: 'ML / AI', className: 'bg-amber-950 text-amber-400' },
  { label: 'TypeScript', className: 'bg-indigo-950 text-indigo-300' },
  { label: 'Next.js', className: 'bg-white/15 text-zinc-100' },
  { label: 'React Native', className: 'bg-purple-950 text-purple-400' },
  { label: 'Kotlin', className: 'bg-red-950 text-red-400' },
  { label: 'Go', className: 'bg-blue-950 text-blue-400' },
  { label: 'MySQL', className: 'bg-orange-950 text-orange-300' },
  { label: 'Docker', className: 'bg-sky-950 text-sky-400' },
  { label: 'Linux / DevOps', className: 'bg-slate-950 text-slate-300' },
] as const

export type ProjectTag = (typeof PROJECT_TAGS)[number]['label']

export const CARD_TAG_LIMIT = 5

const ALIASES: Record<string, ProjectTag> = {
  py: 'Python',
  python: 'Python',
  ml: 'ML / AI',
  'ml / ai': 'ML / AI',
  typescript: 'TypeScript',
  'next.js': 'Next.js',
  nextjs: 'Next.js',
  rn: 'React Native',
  'react native': 'React Native',
  kt: 'Kotlin',
  kotlin: 'Kotlin',
  go: 'Go',
  mysql: 'MySQL',
  docker: 'Docker',
  linux: 'Linux / DevOps',
  devops: 'Linux / DevOps',
  'linux / devops': 'Linux / DevOps',
}

export function normalizeTags(input: string[] | null | undefined): ProjectTag[] {
  const found = new Set<ProjectTag>()
  for (const raw of input ?? []) {
    if (typeof raw !== 'string') continue
    const label = ALIASES[raw.trim().toLowerCase()]
    if (label) found.add(label)
  }
  return PROJECT_TAGS.map((tag) => tag.label).filter((label) => found.has(label))
}

export function tagClass(label: string): string {
  return PROJECT_TAGS.find((tag) => tag.label === label)?.className ?? 'bg-gray-800 text-white'
}
