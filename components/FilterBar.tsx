'use client'

const FILTERS = [
  { key: 'all', label: 'Visi' },
  { key: 'go', label: 'Go' },
  { key: 'rn', label: 'React Native' },
  { key: 'py', label: 'Python' },
  { key: 'kt', label: 'Kotlin' },
  { key: 'ml', label: 'ML / AI' },
]

type Props = {
  active: string
  onChange: (key: string) => void
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
            active === f.key
              ? 'bg-[#4afa8a] text-black border-[#4afa8a] font-medium'
              : 'border-[#333] text-gray-500 hover:text-white hover:bg-[#1e1e1e]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
