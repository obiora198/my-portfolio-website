import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import ProjectForm from "./components/ProjectForm";
import { getUserSession } from "./lib/userSession";


export default async function Home() {
  
  const user = await getUserSession()
  
  return (
    <>
      <Hero />
      {user?.name === 'emmanuel' && <ProjectForm />}
      <Portfolio />
      <ContactForm />
    </>
  );
}
