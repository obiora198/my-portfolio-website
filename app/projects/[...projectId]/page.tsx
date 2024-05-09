import Project from '@/app/components/Project'
import getProject from '@/app/lib/getProject';
import { ProjectType } from '@/app/configs/tsTypes';

export default async function Page({params}: {params: {projectId : [route: string,id: string]}}) {
  const {projectId} = params
  const [route,id] = projectId

  const project: ProjectType = await getProject({id:id})
  
  return (
    <>
      <Project project={project}  />
    </>
  )
}

