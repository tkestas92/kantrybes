import { getAllProjects } from '@/lib/db'
import DevPageClient from '@/components/DevPageClient'

export const dynamic = 'force-dynamic'

export default async function DevPage() {
  const projects = await getAllProjects()
  return <DevPageClient projects={projects} />
}
