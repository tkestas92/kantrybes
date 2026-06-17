import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NameAnimation from '@/components/NameAnimation'

export default function DjPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] px-6 py-12 max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-gray-400 transition-colors mb-8">
        <ArrowLeft size={13} /> kantrybes.lt
      </Link>

      <section>
        <div className="mb-4">
          <NameAnimation />
        </div>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-6 max-w-lg">
          DJ ir event organizatorius iš Vilniaus. 100+ renginių, sunset boat party,
          charity events ir bendradarbiavimas su žinomais brandais.
        </p>
        <p className="text-[13px] text-gray-600">🚧 Puslapis kuriamas — daugiau informacijos greitai.</p>
      </section>
    </main>
  )
}
