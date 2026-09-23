import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[13px] text-gray-600 uppercase tracking-widest mb-4">404</p>
      <h1 className="text-2xl font-medium text-white mb-3">Puslapis nerastas</h1>
      <p className="text-[14px] text-gray-500 mb-8">Šis puslapis neegzistuoja arba buvo perkeltas.</p>
      <Link href="/" className="text-[13px] font-medium bg-[#4afa8a] text-black px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity">
        Grįžti į pradžią
      </Link>
    </main>
  )
}
