import ProjectCard from './ProjectCard'
import { ProjectType } from '../configs/tsTypes'
import getProjects from '../lib/getProjects'

export default async function Portfolio() {
  const projects: ProjectType[] = await getProjects()

  return (
    <div
      id="portfolio-section"
      className="min-h-screen w-full bg-gray-800 text-amber-50 flex flex-col items-center gap-8 px-4 sm:px-16 md:px-24 lg:px-32 pt-16 pb-8"
    >
      <h1 className="font-bold text-5xl text-center">My Portfolio</h1>

      <div className="h-full w-full max-w-[1000px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 place-items-center rounded-lg relative">
        {projects.map((item: ProjectType) => (
          <ProjectCard
            image={item.images[0]}
            title={item.title}
            url={item._id}
            key={projects.indexOf(item)}
          />
        ))}
      </div>
    </div>
  )
}
