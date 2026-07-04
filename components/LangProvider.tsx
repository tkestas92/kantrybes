'use client'

import { createContext, useContext, useState } from 'react'
import { Lang } from '@/lib/translations'

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'lt',
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('lt')
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export function useLang() {
  return useContext(LangCtx)
}
