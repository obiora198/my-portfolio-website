import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Footer from './components/sections/Footer'
import Nav from './components/nav/Nav'
import { AuthContextProvider } from './context/authContext'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Obiora Sopuluchukwu',
  description: 'A portfolio website created to showcase my work',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="shortcut icon" href="/my-logo.png" type="image/x-icon" />
        <script src="https://kit.fontawesome.com/1b7d41b7e1.js" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`${poppins.className}`}
      >
        <AuthContextProvider>
          <Nav links={links} />

          {children}

          <Footer />
        </AuthContextProvider>
      </body>
    </html>
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
