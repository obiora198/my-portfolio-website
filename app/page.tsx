import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import NewProjectForm from './components/newProjectForm'
import { getUserSession } from './lib/userSession'
import getProjects from './lib/getProjects'
import { ProjectType } from './configs/tsTypes'

export default async function Home() {
  const user = await getUserSession()
  const projects: ProjectType[] = await getProjects()
  return (
    <>
      <Hero />
      {user?.name === 'emmanuel' && <NewProjectForm />}
      <Portfolio projects={projects}  />
      <ContactForm />
    </>
  )
}
