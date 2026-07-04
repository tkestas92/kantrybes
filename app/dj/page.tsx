import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NameAnimation from '@/components/NameAnimation'
import DjProfileSection from '@/components/DjProfileSection'
import { getPublicDjProfile } from '@/lib/djbook'

export const revalidate = 300

export default async function DjPage() {
  const profile = await getPublicDjProfile('kantrybes')

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-gray-400 transition-colors">
          <ArrowLeft size={13} /> kantrybes.lt
        </Link>
        <span className="text-[13px] text-gray-600 border border-[#2a2a2a] rounded-full px-3 py-1.5 ml-2">
          DJBook app · name in progress
        </span>
      </div>

      {!profile && (
        <section className="mb-10">
          <div className="mb-4">
            <NameAnimation />
          </div>
          <p className="text-[15px] text-gray-500 leading-relaxed mb-2 max-w-lg">
            DJ ir event organizatorius iš Vilniaus. 100+ renginių, sunset boat party,
            charity events ir bendradarbiavimas su žinomais brandais.
          </p>
        </section>
      )}

      {profile ? (
        <DjProfileSection profile={profile} />
      ) : (
        <div className="bg-[#161616] border border-[#252525] rounded-xl px-5 py-4">
          <p className="text-[14px] text-gray-400">
            Nepavyko užkrauti DJ profilio. Bandykite vėliau arba susisiekite tiesiogiai dėl booking.
          </p>
          <a
            href="mailto:kestas@kantrybes.lt"
            className="inline-block mt-4 text-[13px] font-medium bg-[#4afa8a] text-black px-4 py-2 rounded-lg hover:opacity-85 transition-opacity"
          >
            Parašyti
          </a>
        </div>
      )}
    </main>
  )
}
