'use client'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import ContactModal from './ContactModal'

export default function EmailButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-4 py-2 hover:text-[#4afa8a] hover:border-[#4afa8a] hover:bg-[#0e2a1a] transition-all"
      >
        <Mail size={15} /> Email
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
