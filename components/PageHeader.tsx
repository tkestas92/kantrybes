'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LangSwitcher from '@/components/LangSwitcher'
import { useLang } from '@/components/LangProvider'

type Props = {
  backLabel: string
  extra?: React.ReactNode
}

export default function PageHeader({ backLabel, extra }: Props) {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-gray-400 transition-colors shrink-0"
      >
        <ArrowLeft size={13} /> {backLabel}
      </Link>
      {extra}
      <LangSwitcher lang={lang} onChange={setLang} />
    </div>
  )
}
