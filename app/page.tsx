// import Contact from './components/sections/Contact'
import Contact from './components/nurui/NewContactPage'
// import Hero from './components/sections/Hero'
import Hero from './components/nurui/gradient-hero'
// import Projects from './components/sections/Projects'
import Projects from './components/nurui/Projects'
import Skills from './components/sections/Skills'
import About from './components/sections/About'
import { Inter } from 'next/font/google'
import Nav from './components/nav/Nav'

const inter = Inter({ subsets: ['latin'] })

export default async function Home() {
  
  return (
    <main className={`${inter.className} bg-gray-100 dark:bg-slate-900 transition-colors duration-300`}>
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
    text: 'Apps',
    subLinks: [
      { text: 'Buy Data', url: '/vtu' },
      { text: 'Blog', url: '/blog' },
    ],
  },
  {
    text: 'Quick Navigation',
    subLinks: [
      { text: 'About', url: '/#about-section' },
      { text: 'Skills', url: '/#skills-section' },
      { text: 'Projects', url: '/#projects-section' },
    ],
  },

  // {
  //   text: 'About',
  //   url: '/#about-section',
  // },
  // {
  //   text: 'Skills',
  //   url: '/#skills-section',
  // },
  // {
  //   text: 'Projects',
  //   url: '/#projects-section',
  // },
  {
    text: 'Contact',
    url: '/#contact-section',
  },
]