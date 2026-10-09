'use client'

const FILTER_KEYS = ['all', 'go', 'rn', 'py', 'kt', 'ml', 'devops', 'linux', 'docker', 'bash', 'iot'] as const

type FilterLabels = {
  filterAll: string
  go: string
  rn: string
  py: string
  kt: string
  ml: string
}

type Props = {
  active: string
  onChange: (key: string) => void
  labels: FilterLabels
}

export default function FilterBar({ active, onChange, labels }: Props) {
  const filters = [
    { key: 'all', label: labels.filterAll },
    { key: 'go', label: labels.go },
    { key: 'rn', label: labels.rn },
    { key: 'py', label: labels.py },
    { key: 'kt', label: labels.kt },
    { key: 'ml', label: labels.ml },
    { key: 'devops', label: 'DevOps' },
    { key: 'linux', label: 'Linux' },
    { key: 'docker', label: 'Docker' },
    { key: 'bash', label: 'Bash' },
    { key: 'iot', label: 'IoT' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
            active === f.key
              ? 'bg-[#4afa8a] text-black border-[#4afa8a] font-medium'
              : 'bg-[#0f0f0f] border-[#333] text-white hover:text-white hover:bg-[#1e1e1e]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export { FILTER_KEYS }
