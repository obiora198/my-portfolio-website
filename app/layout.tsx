import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Footer from './components/sections/Footer'
import Script from 'next/script'
import { AuthProvider } from './context/authContext'
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Emmanuel Obiora',
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Script src="https://kit.fontawesome.com/1b7d41b7e1.js" crossOrigin="anonymous"></Script>
      </head>
      <body
        className={`${poppins.className}`}
      >
        <AuthProvider>
          {/* <Nav links={links} /> */}
          
          {children}
          <Toaster position="top-right" reverseOrder={false} />

          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

// const links = [
//   {
//     text: 'Home',
//     url: '/',
//   },
//   {
//     text: 'About',
//     url: '/#about-section',
//   },
//   {
//     text: 'Skills',
//     url: '/#skills-section',
//   },
//   {
//     text: 'Projects',
//     url: '/#projects-section',
//   },
//   {
//     text: 'Contact',
//     url: '/#contact-section',
//   },
// ]
