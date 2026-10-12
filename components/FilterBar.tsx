'use client'

type TagOption = {
  label: string
}

type Props = {
  active: string
  onChange: (key: string) => void
  filterAll: string
  tags: TagOption[]
}

export default function FilterBar({ active, onChange, filterAll, tags }: Props) {
  const filters = [{ key: 'all', label: filterAll }, ...tags.map((tag) => ({ key: tag.label, label: tag.label }))]

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
