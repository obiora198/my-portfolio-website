import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import ProjectForm from "./components/ProjectForm";
import { useUser } from "./userContext";

export default function Home() {
  
  const {user} = useUser()
  
  return (
    <>
      <Hero />
      {user.name === 'emmanuel' && <ProjectForm />}
      <Portfolio />
      <ContactForm />
    </>
  );
}
