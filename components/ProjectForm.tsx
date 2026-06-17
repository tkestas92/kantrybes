'use client'

import { useState } from 'react'
import type { Project } from '@/lib/db'

const ALL_TAGS = ['go', 'rn', 'py', 'kt', 'ml']
const TAG_LABELS: Record<string, string> = {
  go: 'Go', rn: 'React Native', py: 'Python', kt: 'Kotlin', ml: 'ML / AI'
}

type Props = {
  initial?: Partial<Project>
  onSave: (data: Partial<Project>) => Promise<void>
  onCancel: () => void
}

export default function ProjectForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '🚀')
  const [tags, setTags] = useState<string[]>(initial?.tags || [])
  const [githubUrl, setGithubUrl] = useState(initial?.github_url || '')
  const [liveUrl, setLiveUrl] = useState(initial?.live_url || '')
  const [status, setStatus] = useState<Project['status']>(initial?.status || 'shipped')
  const [loading, setLoading] = useState(false)

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSave({ title, description, emoji, tags, github_url: githubUrl, live_url: liveUrl, status })
    setLoading(false)
  }

  const inputClass = "bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-[14px] placeholder-gray-600 focus:outline-none focus:border-[#4afa8a] transition-colors w-full"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-[60px_1fr] gap-3">
        <input className={inputClass} value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🚀" />
        <input className={inputClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="Projekto pavadinimas" required />
      </div>

      <textarea
        className={`${inputClass} resize-none h-20`}
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Trumpas aprašymas..."
        required
      />

      <div>
        <p className="text-[12px] text-gray-600 mb-2">Technologijos</p>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1 rounded border transition-all ${
                tags.includes(tag)
                  ? 'bg-[#4afa8a] text-black border-[#4afa8a] font-medium'
                  : 'border-[#2a2a2a] text-gray-500 hover:border-[#444]'
              }`}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input className={inputClass} value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="GitHub URL" />
        <input className={inputClass} value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="Live URL (nebūtina)" />
      </div>

      <select
        className={inputClass}
        value={status}
        onChange={e => setStatus(e.target.value as Project['status'])}
      >
        <option value="shipped">Baigtas</option>
        <option value="in_progress">In progress</option>
        <option value="archived">Archyvuotas</option>
      </select>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#4afa8a] text-black font-medium py-2.5 rounded-lg text-[13px] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Saugoma...' : 'Išsaugoti'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg hover:border-[#444] hover:text-white transition-all"
        >
          Atšaukti
        </button>
      </div>
    </form>
  )
}
