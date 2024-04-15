'use client'

import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import NavBar from "./components/nav/NavBar";
import ProjectForm from "./components/ProjectForm";
import { useEffect } from "react";
import { useUser } from "./userContext";

const links = [
  {
    text: "Home",
    url: "#hero-section",
  },
  {
    text: "Portfolio",
    url: "#portfolio-section",
  },
  {
    text: "contact",
    url: "#contact-section",
  },
];

export default function Home() {
  
  const {user} = useUser()
  
  return (
    <>
      <NavBar links={links} />
      <Hero />
      {user.name === 'emmanuel' && <ProjectForm />}
      <Portfolio />
      <ContactForm />
      <Footer />
    </>
  );
}
