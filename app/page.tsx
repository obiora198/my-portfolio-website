import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import NavBar from "./components/nav/NavBar";

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
  return (
    <>
      <NavBar  links={links}/>
      <Hero />
      <Portfolio />
      <ContactForm />
      <Footer />
    </>
  );
}
