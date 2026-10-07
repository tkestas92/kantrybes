'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export default function SortableRow({ id, disabled, children }: { id: number; disabled?: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1, position: 'relative', zIndex: isDragging ? 10 : undefined }}
    >
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label="Perkelti"
          className="touch-none cursor-grab active:cursor-grabbing text-gray-500 hover:text-white px-1 disabled:opacity-30 disabled:cursor-default"
        >
          <GripVertical size={16} />
        </button>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
