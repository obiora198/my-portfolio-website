import ContactForm from './components/ContactForm'
import Hero from './components/Hero'
import Portfolio from './components/Projects-ui'
import NewProjectForm from './components/newProjectForm'

export default async function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <ContactForm />
    </>
  )
}
