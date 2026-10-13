export const PROJECT_TAGS = [
  { label: 'Python', color: '#4ade80' },
  { label: 'ML / AI', color: '#fb923c' },
  { label: 'TypeScript', color: '#22d3ee' },
  { label: 'Next.js', color: '#e4e4e7' },
  { label: 'React Native', color: '#c084fc' },
  { label: 'Kotlin', color: '#f87171' },
  { label: 'Go', color: '#60a5fa' },
  { label: 'MySQL', color: '#2dd4bf' },
  { label: 'Docker', color: '#2496ed' },
  { label: 'Linux / DevOps', color: '#facc15' },
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

function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function tagStyle(label: string): { backgroundColor: string; color: string } {
  const color = PROJECT_TAGS.find((tag) => tag.label === label)?.color ?? '#e5e5e5'
  return { backgroundColor: withAlpha(color, 0.18), color }
}
