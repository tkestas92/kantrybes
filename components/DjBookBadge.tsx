import { Smartphone } from 'lucide-react'
import { t } from '@/lib/translations'

type Props = {
  labels: (typeof t)['lt']['dj']
}

export default function DjBookBadge({ labels }: Props) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[12px] text-white/60"
      title={labels.djbookTitle}
    >
      <Smartphone size={12} className="shrink-0 text-white/50" aria-hidden />
      <span>
        <span className="text-white/70">{labels.djbookName}</span>
        <span className="text-white/45">{labels.djbookProgress}</span>
      </span>
    </span>
  )
}
