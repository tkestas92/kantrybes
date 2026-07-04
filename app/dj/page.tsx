import DjPageClient from '@/components/DjPageClient'
import { getPublicDjProfile } from '@/lib/djbook'

export const revalidate = 300

export default async function DjPage() {
  const profile = await getPublicDjProfile('kantrybes')
  return <DjPageClient profile={profile} />
}
