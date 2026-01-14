import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from './components/ThemeContext'
import Script from 'next/script'
import { AuthProvider } from './context/authContext'
import { Toaster } from 'react-hot-toast'
import { SpeedInsights } from '@vercel/speed-insights/next'
import QueryProvider from '@/components/providers/QueryProvider'
import ThemeScript from './components/ThemeScript'

// Dynamic import for Footer to reduce initial bundle size
// const Footer = dynamic(() => import('./components/sections/Footer'), {
//   ssr: true,
// })

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '700', '800'],
  display: 'swap', // Optimize font loading
  preload: true,
  fallback: ['system-ui', 'arial'],
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
  metadataBase: new URL('https://emmanuel-obiora.vercel.app'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://emmanuel-obiora.vercel.app/" />
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link
          rel="dns-prefetch"
          href="https://firebasestorage.googleapis.com"
        />
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
            image: 'https://emmanuel-obiora.vercel.app/profile.jpg',
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
        <ThemeScript />
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-right" reverseOrder={false} />
              <SpeedInsights />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
