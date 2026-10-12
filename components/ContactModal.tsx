'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { useLang } from '@/components/LangProvider'
import { t } from '@/lib/translations'

type Props = { open: boolean; onClose: () => void }

export default function ContactModal({ open, onClose }: Props) {
  const { lang } = useLang()
  const copy = t[lang].contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorCode, setErrorCode] = useState<string | null>(null)

  if (!open) return null

  function handleClose() {
    if (status === 'sent') {
      setStatus('idle')
      setName('')
      setEmail('')
      setMessage('')
    }
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorCode(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, lang }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorCode(typeof data.error === 'string' ? data.error : 'send_failed')
        setStatus('error')
        return
      }
      setStatus('sent')
    } catch {
      setErrorCode('send_failed')
      setStatus('error')
    }
  }

  const errorText =
    errorCode === 'missing_fields'
      ? copy.errorMissing
      : errorCode === 'invalid_email'
        ? copy.errorEmail
        : copy.errorSend

  return (
    <div
      className="surface-solid fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className={`pointer-events-auto relative z-10 w-full max-w-md select-text rounded-xl border border-[#2a2a2a] bg-[#161616] ${status === 'sent' ? 'pt-10 pb-8 px-6' : 'p-6'}`}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        {status === 'sent' ? (
          <button
            onClick={handleClose}
            className="absolute top-4 right-5 text-white hover:text-white transition-colors"
            aria-label={copy.close}
          >
            <X size={18} />
          </button>
        ) : (
          <div className="flex items-center justify-between mb-5">
            <p className="text-[15px] font-medium text-white">{copy.title}</p>
            <button onClick={handleClose} className="text-white hover:text-white transition-colors" aria-label={copy.close}>
              <X size={18} />
            </button>
          </div>
        )}

        {status === 'sent' ? (
          <div className="flex flex-col items-center text-center">
            <div className="surface-solid flex h-11 w-11 items-center justify-center rounded-full border border-[#4afa8a] mb-4">
              <Check size={20} className="text-[#4afa8a]" />
            </div>
            <p className="text-[16px] font-medium text-[#f0f0f0] mb-1.5">{copy.successTitle}</p>
            <p className="text-[13px] text-white leading-relaxed">{copy.successText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              required
              placeholder={copy.name}
              aria-label={copy.name}
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors"
            />
            <input
              required
              type="email"
              placeholder={copy.email}
              aria-label={copy.email}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors"
            />
            <textarea
              required
              placeholder={copy.message}
              aria-label={copy.message}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors resize-none"
            />
            {status === 'error' && (
              <p className="text-[12px] text-red-400">{errorText}</p>
            )}
            <p className="text-[11px] leading-snug text-white/55">
              {copy.consent}{' '}
              <Link href="/privatumas" onClick={onClose} className="text-[#4afa8a] hover:opacity-85">{copy.privacy}</Link>.
            </p>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-[#4afa8a] text-black font-medium py-2.5 rounded-lg text-[14px] hover:opacity-85 transition-opacity disabled:opacity-50 mt-1"
            >
              {status === 'sending' ? copy.sending : copy.send}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
