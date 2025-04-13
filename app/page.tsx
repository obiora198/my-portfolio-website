import Contact from './components/sections/Contact'
import Hero from './components/sections/Hero'
import Projects from './components/sections/Projects'
import Skills from './components/sections/Skills'
import About from './components/sections/About'
import { Inter } from 'next/font/google'
import Nav from './components/nav/Nav'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  
  return (
    <main className={`${inter.className} bg-gray-100`}>
      <Nav links={links} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  )
}

const links = [
  {
    text: 'Home',
    url: '/',
  },
  {
    text: 'About',
    url: '/#about-section',
  },
  {
    text: 'Skills',
    url: '/#skills-section',
  },
  {
    text: 'Projects',
    url: '/#projects-section',
  },
  {
    text: 'Contact',
    url: '/#contact-section',
  },
]
