import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import NewProjectForm from './components/newProjectForm'
import { getUserSession } from './lib/userSession'

export default async function Home() {
  const user = await getUserSession()

  return (
    <>
      <Hero />
      {user?.name === 'emmanuel' && <NewProjectForm />}
      <Portfolio />
      <ContactForm />
    </>
  )
}
