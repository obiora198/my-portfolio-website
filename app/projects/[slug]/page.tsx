import Project
import fetchProject from '@/app/lib/fetchProject'
import fetchProjects from '@/app/lib/fetchProjects'
import { ProjectType } from '@/app/configs/tsTypes'
import { getUserSession } from '@/app/lib/userSession'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params

  // const [route,id] = projectId

  const project: ProjectType = await getProject({ id: slug })
  const user = await getUserSession()

  return (
    <>
      <Project project={project} user={user} />
    </>
  )
}

export async function generateStaticParams() {
  const projects: ProjectType[] = await fetchProjects()
  return projects.map((project) => ({
    slug: project.id,
  }))
}
