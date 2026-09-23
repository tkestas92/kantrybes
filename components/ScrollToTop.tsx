'use client'
import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 bg-[#161616] border border-[#2a2a2a] text-gray-400 hover:text-[#4afa8a] hover:border-[#4afa8a]/40 rounded-full p-3 transition-all shadow-lg z-50"
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} />
    </button>
  )
}
