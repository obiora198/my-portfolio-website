import { Navigation } from '@/app/components/redesign/Navigation'
import { AboutSection } from '@/app/components/redesign/AboutSection'
import { FooterSection } from '@/app/components/redesign/FooterSection'
import { ThemeSwitcher } from '@/app/components/redesign/ThemeSwitcher'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Me | Emmanuel Obiora | Web Developer',
  description:
    'Learn more about Emmanuel Obiora, a full-stack developer and UI/UX enthusiast based in Abuja. Read about my journey, skills, and expertise.',
  openGraph: {
    title: 'About Me | Emmanuel Obiora | Web Developer',
    description:
      'Learn more about Emmanuel Obiora, a full-stack developer and UI/UX enthusiast based in Abuja. Read about my journey, skills, and expertise.',
    url: 'https://emmanuel-obiora.vercel.app/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navigation />
      <ThemeSwitcher />
      <main className="pt-20">
        <AboutSection />
      </main>
      <FooterSection />
    </div>
  )
}
