'use client'

import TagChip from '@/components/TagChip'

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
      {filters.map((f) =>
        f.key === 'all' ? (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              active === f.key
                ? 'bg-[#4afa8a] text-black'
                : 'border border-[#333] bg-[#0f0f0f] text-white hover:bg-[#1e1e1e]'
            }`}
          >
            {f.label}
          </button>
        ) : (
          <TagChip key={f.key} label={f.label} active={active === f.key} onClick={() => onChange(f.key)} />
        )
      )}
    </div>
  )
}
