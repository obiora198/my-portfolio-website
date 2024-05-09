import Project from '@/app/components/Project'
import getProject from '@/app/lib/getProject';
import getProjects from '@/app/lib/getProjects';
import { ProjectType } from '@/app/configs/tsTypes';
import { getUserSession } from '@/app/lib/userSession';

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params
  
  // const [route,id] = projectId

  const project: ProjectType = await getProject({id:slug})
  const user = await getUserSession()
  
  return (
    <>
      <Project project={project} user={user}  />
    </>
  )
}

export async function generateStaticParams() {
  const projects: ProjectType[] = await getProjects()
  return projects.map((project) => ({
    slug: project._id,
  }))
}

