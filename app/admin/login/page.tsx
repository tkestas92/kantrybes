'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Neteisingas slaptažodis')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <Lock size={18} className="text-[#4afa8a]" />
          <span className="text-white font-medium">Admin — kantrybes.lt/dev</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Slaptažodis"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-[#161616] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors"
            autoFocus
          />
          {error && <p className="text-red-400 text-[13px]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4afa8a] text-black font-medium py-3 rounded-lg text-[14px] hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Jungiamasi...' : 'Prisijungti'}
          </button>
        </form>
      </div>
    </main>
  )
}
