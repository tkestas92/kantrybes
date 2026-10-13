import { tagStyle } from '@/lib/tags'

export const TAG_CHIP_CLASS = 'inline-flex items-center rounded-md px-3 py-1 text-xs font-medium'

type Props = {
  label: string
  active?: boolean
  selected?: boolean
  onClick?: () => void
}

export default function TagChip({ label, active, selected, onClick }: Props) {
  const className = `${TAG_CHIP_CLASS} ${active ? 'bg-[#4afa8a] text-black' : ''} ${selected ? 'ring-1 ring-current' : ''}`
  const style = active ? undefined : tagStyle(label)

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} style={style}>
        {label}
      </button>
    )
  }

  return (
    <span className={className} style={style}>
      {label}
    </span>
  )
}
