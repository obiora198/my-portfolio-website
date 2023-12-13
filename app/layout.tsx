import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['200','400','700','800'] 
})

export const metadata: Metadata = {
  title: 'Obiora Sopuluchukwu',
  description: 'A portfolio website created to showcase my work',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='scroll-smooth'>
      <head>
        <link rel="shortcut icon" href="/my-logo.png" type="image/x-icon" />
      </head>
      <body className={`${poppins.className} bg-gray-950 text-amber-50`}  >
        {children}
      </body>
    </html>
  )
}
