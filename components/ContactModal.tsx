'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type Props = { open: boolean; onClose: () => void }

export default function ContactModal({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#161616] border border-[#2a2a2a] rounded-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-[15px] font-medium text-white">Pasikalbėkim</p>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {status === 'sent' ? (
          <p className="text-[14px] text-[#4afa8a] py-8 text-center">Ačiū! Žinutė išsiųsta, atsakysiu greitai.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              required
              placeholder="Vardas"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors"
            />
            <textarea
              required
              placeholder="Žinutė"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors resize-none"
            />
            {status === 'error' && (
              <p className="text-[12px] text-red-400">Nepavyko išsiųsti. Pabandyk dar kartą arba rašyk tiesiai kestas@kantrybes.lt</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-[#4afa8a] text-black font-medium py-2.5 rounded-lg text-[14px] hover:opacity-85 transition-opacity disabled:opacity-50 mt-1"
            >
              {status === 'sending' ? 'Siunčiama...' : 'Siųsti'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
