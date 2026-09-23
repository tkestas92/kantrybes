'use client'
import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 pt-6 border-t border-[#1e1e1e] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-gray-600">
      <p>© {year} Kęstas Trybė</p>
      <div className="flex items-center gap-4">
        <a href="https://github.com/tkestas92" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <Github size={13} /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/kestas-trybe/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <Linkedin size={13} /> LinkedIn
        </a>
        <a href="mailto:kestas@kantrybes.lt" className="hover:text-gray-400 transition-colors flex items-center gap-1.5">
          <Mail size={13} /> Email
        </a>
        <Link href="/dj" className="hover:text-[#4afa8a] transition-colors">
          DJ profilis →
        </Link>
      </div>
    </footer>
  )
}
