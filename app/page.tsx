import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Portfolio from './components/Projects-ui'
import NewProjectForm from './components/newProjectForm'
import { getUserSession } from './lib/userSession'
import getProjects from './lib/fetchProjects'
import { ProjectType } from './configs/tsTypes'

export default async function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <ContactForm />
    </>
  )
}
