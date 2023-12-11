import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import RootLayout from "./layout";

export default function Home() {
  return (
    <RootLayout >
      <div id="hero-section">
        <Hero />
      </div>
      <div id="portfolio-section">
        <Portfolio />
      </div>
      <div id="contact-section">
        <ContactForm />
      </div>
      <Footer />
    </RootLayout>
  );
}
