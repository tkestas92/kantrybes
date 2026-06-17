'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, LogOut, ExternalLink } from 'lucide-react'
import type { Project } from '@/lib/db'
import ProjectForm from '@/components/ProjectForm'

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const authRes = await fetch('/api/auth')
    if (!authRes.ok) {
      router.push('/admin/login')
      return
    }
    loadProjects()
  }

  async function loadProjects() {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  async function handleCreate(data: Partial<Project>) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, sort_order: projects.length + 1 }),
    })
    if (res.ok) { setCreating(false); loadProjects() }
  }

  async function handleUpdate(data: Partial<Project>) {
    if (!editing) return
    const res = await fetch(`/api/projects/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) { setEditing(null); loadProjects() }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tikrai ištrinti?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    loadProjects()
  }

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium text-white">Admin panel</h1>
          <p className="text-[13px] text-gray-600 mt-0.5">kantrybes.lt/dev projektai</p>
        </div>
        <div className="flex gap-2">
          <a href="/dev" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-3 py-2 hover:text-white hover:border-[#444] transition-all">
            <ExternalLink size={13} /> Peržiūrėti
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-[13px] text-gray-500 border border-[#2a2a2a] rounded-lg px-3 py-2 hover:text-red-400 hover:border-red-900 transition-all">
            <LogOut size={13} /> Atsijungti
          </button>
        </div>
      </div>

      {creating ? (
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5 mb-4">
          <p className="text-[13px] font-medium text-white mb-4">Naujas projektas</p>
          <ProjectForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      ) : (
        <button onClick={() => setCreating(true)}
          className="w-full flex items-center justify-center gap-2 text-[13px] text-gray-500 border border-dashed border-[#2a2a2a] rounded-xl py-4 mb-4 hover:border-[#4afa8a] hover:text-[#4afa8a] transition-all">
          <Plus size={15} /> Pridėti projektą
        </button>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[#161616] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map(p => (
            <div key={p.id}>
              {editing?.id === p.id ? (
                <div className="bg-[#161616] border border-[#4afa8a]/30 rounded-xl p-5">
                  <p className="text-[13px] font-medium text-white mb-4">Redaguoti</p>
                  <ProjectForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
                </div>
              ) : (
                <div className="bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 flex items-center gap-3 hover:border-[#333] transition-all">
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-white font-medium truncate">{p.title}</p>
                    <p className="text-[12px] text-gray-600 truncate">{p.description}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    p.status === 'in_progress' ? 'bg-amber-950 text-amber-400' : 'bg-green-950 text-green-400'
                  }`}>
                    {p.status === 'in_progress' ? 'WIP' : 'Done'}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(p)}
                      className="p-1.5 text-gray-600 hover:text-white rounded transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-gray-600 hover:text-red-400 rounded transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
