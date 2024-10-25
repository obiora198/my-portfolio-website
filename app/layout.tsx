import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Footer from './components/Footer'
import Nav from './components/nav/Nav'
import { getUserSession } from './lib/userSession'
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
  const user = await getUserSession()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="shortcut icon" href="/my-logo.png" type="image/x-icon" />
      </head>
      <body
        className={`${poppins.className} bg-white text-amber-600 min-h-screen`}
      >
        {/* <NavBar links={links} loggedIn={user.token === null ? false : true} />
        {children}
        <Footer /> */}
        {/* <Nav /> */}
        <AuthContextProvider>
          <Nav links={links}  />
          <div className="relative isolate px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              />
            </div>
            {children}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[calc(100%-23rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-45rem)]"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              />
            </div>
          </div>
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
    text: 'Projects',
    url: '/projects',
  },
  {
    text: 'Lets connect',
    url: '/#contact-section',
  },
]
