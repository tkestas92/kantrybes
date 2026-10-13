'use client'

import { tagStyle } from '@/lib/tags'

type TagOption = {
  label: string
}

type Props = {
  active: string
  onChange: (key: string) => void
  filterAll: string
  tags: TagOption[]
}

const FILTER_BUTTON =
  'inline-flex h-full min-w-0 shrink-0 snap-start items-center justify-center whitespace-nowrap rounded-md border px-3 py-1.5 text-center text-[13px] font-medium leading-none sm:w-full sm:px-2 sm:py-1 sm:text-[12px]'

export default function FilterBar({ active, onChange, filterAll, tags }: Props) {
  const filters = [{ key: 'all', label: filterAll }, ...tags.map((tag) => ({ key: tag.label, label: tag.label }))]

  return (
    <div className="relative w-full min-w-0 max-w-full">
      <div className="flex w-full min-w-0 max-w-full gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:grid sm:grid-cols-6 sm:overflow-hidden">
        {filters.map((filter) => {
          const isActive = active === filter.key
          const colored = !isActive && filter.key !== 'all'
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => onChange(filter.key)}
              style={colored ? tagStyle(filter.label) : undefined}
              className={`${FILTER_BUTTON} ${
                isActive
                  ? 'border-transparent bg-[#4afa8a] text-black'
                  : filter.key === 'all'
                    ? 'border-[#333] bg-[#0f0f0f] text-white hover:bg-[#1e1e1e]'
                    : 'border-transparent'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0f0f0f] to-transparent sm:hidden" />
    </div>
  )
}
