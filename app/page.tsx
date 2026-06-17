import Link from 'next/link'
import NameAnimation from '@/components/NameAnimation'

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6">
      <div className="mb-12">
        <NameAnimation />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <Link
          href="/dj"
          className="group bg-[#161616] border border-[#252525] rounded-xl p-8 flex flex-col items-center gap-3 hover:border-[#333] hover:bg-[#1e1e1e] transition-all"
        >
          <span className="text-3xl">🎧</span>
          <span className="text-white font-medium text-[15px]">DJ</span>
          <span className="text-gray-500 text-[12px] text-center">Renginiai, booking, muzika</span>
        </Link>

        <Link
          href="/dev"
          className="group bg-[#161616] border border-[#252525] rounded-xl p-8 flex flex-col items-center gap-3 hover:border-[#4afa8a]/30 hover:bg-[#1e1e1e] transition-all"
        >
          <span className="text-3xl">💻</span>
          <span className="text-white font-medium text-[15px]">Dev</span>
          <span className="text-gray-500 text-[12px] text-center">Projektai, kodas, portfolio</span>
        </Link>
      </div>
    </main>
  )
}
