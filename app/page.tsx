import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";

export default function Home() {
  return (
    <main>
      <Hero />
      <Portfolio />
      <ContactForm />
      <Footer />
    </main>
  );
}
