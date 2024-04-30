'use client'

import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import ProjectForm from "./components/ProjectForm";
import { UserContext } from "./userContext";
import { useContext } from "react";

export default function Home() {
  
  const {user} = useContext(UserContext)
  
  return (
    <>
      <Hero />
      {user.name === 'emmanuel' && <ProjectForm />}
      <Portfolio />
      <ContactForm />
    </>
  );
}
