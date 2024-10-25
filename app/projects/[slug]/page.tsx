import fetchProjects from '@/app/lib/fetchProjects'
import { ProjectType } from '@/app/configs/tsTypes'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params


  const project = await fetch(`/api/projects/${slug}`)
  console.log(project);
  

  return (
    <>
      {/* <p>{project.data}</p> */}
      {/* <Project project={project} user={user} /> */}
    </>
  )
}

export async function generateStaticParams() {
  const res = await fetchProjects()
  console.log(res);
  const projects: ProjectType[] = res.data
  
  return projects.map((project) => ({
    slug: project.id,
  }))
}
