import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Footer from './components/sections/Footer'
import Script from 'next/script'
import { AuthProvider } from './context/authContext'
import { Toaster } from 'react-hot-toast'
import { SpeedInsights } from '@vercel/speed-insights/next'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Emmanuel Obiora | Web Developer in Abuja',
  description:
    'Portfolio website of Emmanuel Obiora, a passionate and results-driven web developer based in Abuja. Explore projects built with React, Next.js, Tailwind CSS, and more.',
  keywords: [
    'web developer in Abuja',
    'frontend developer Abuja',
    'React developer Abuja',
    'Next.js developer Abuja',
    'freelance web developer Abuja',
    'Emmanuel Obiora developer',
    'Abuja portfolio website',
  ],
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Emmanuel Obiora | Web Developer in Abuja',
    description:
      'Visit the portfolio of Emmanuel Obiora, a frontend web developer based in Abuja, Nigeria. View recent projects and get in touch for collaborations.',
    url: 'https://emmanuel-obiora.vercel.app/',
    siteName: 'Emmanuel Obiora Portfolio',
    images: [
      {
        url: '/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Emmanuel Obiora Web Developer Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="canonical"
          href="https://emmanuel-obiora.vercel.app/"
        />

        <Script
          src="https://kit.fontawesome.com/1b7d41b7e1.js"
          crossOrigin="anonymous"
        ></Script>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Emmanuel Obiora',
            url: 'https://emmanuel-obiora.vercel.app/',
            image: 'https://emmanuel-obiora.vercel.app/profile.jpg', // replace with your real profile image
            sameAs: [
              'https://www.linkedin.com/in/emmanuel-obiora-9b8495192/',
              'https://github.com/obiora198',
            ],
            jobTitle: 'Frontend Web Developer',
            worksFor: {
              '@type': 'Organization',
              name: 'Freelance',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Abuja',
              addressRegion: 'FCT',
              addressCountry: 'NG',
            },
            description:
              'Emmanuel Obiora is a frontend web developer based in Abuja, Nigeria, specializing in building modern websites with React, Next.js, Tailwind CSS, and TypeScript.',
          })}
        </Script>
      </head>
      <body className={`${poppins.className}`}>
        <AuthProvider>
          {/* <Nav links={links} /> */}

          {children}
          <Toaster position="top-right" reverseOrder={false} />
          <SpeedInsights />

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
