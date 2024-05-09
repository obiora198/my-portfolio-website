import Portfolio from '../components/Portfolio'
import getProjects from '../lib/getProjects'

const Projects = async () => {
  const projects = await getProjects()

  return (
    <div className="w-full h-full pb-2">
      <Portfolio projects={projects} />
    </div>
  )
}

export default Projects
