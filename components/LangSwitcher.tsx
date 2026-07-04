'use client'

import { Lang } from '@/lib/translations'

type Props = { lang: Lang; onChange: (l: Lang) => void }

export default function LangSwitcher({ lang, onChange }: Props) {
  return (
    <div className="flex items-center gap-1">
      {(['lt', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`text-[11px] uppercase tracking-widest px-2 py-1 rounded transition-all ${
            lang === l
              ? 'text-[#4afa8a] border border-[#4afa8a]/40'
              : 'text-gray-600 hover:text-gray-400'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
