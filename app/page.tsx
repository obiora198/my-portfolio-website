import dynamic from 'next/dynamic'
import { Navigation } from './components/redesign/Navigation'
import { HeroSection } from './components/redesign/HeroSection'
import { AboutSection } from './components/redesign/AboutSection'

// Keep heavy/below-the-fold sections dynamic for performance
const ProjectsSection = dynamic(
  () =>
    import('./components/redesign/ProjectsSection').then((mod) => ({
      default: mod.ProjectsSection,
    })),
  {
    loading: () => (
      <div className="py-20 animate-pulse bg-gray-50/50 dark:bg-gray-900/50 min-h-[800px]" />
    ),
  }
)

const BlogSection = dynamic(
  () =>
    import('./components/redesign/BlogSection').then((mod) => ({
      default: mod.BlogSection,
    })),
  {
    loading: () => (
      <div className="py-20 animate-pulse bg-gray-50/50 dark:bg-gray-900/50 min-h-[600px]" />
    ),
  }
)

const VTUSection = dynamic(
  () =>
    import('./components/redesign/VTUSection').then((mod) => ({
      default: mod.VTUSection,
    })),
  {
    loading: () => <div className="py-20 min-h-[400px]" />,
  }
)

const ContactSection = dynamic(
  () =>
    import('./components/redesign/ContactSection').then((mod) => ({
      default: mod.ContactSection,
    })),
  {
    loading: () => <div className="py-20 min-h-[600px]" />,
  }
)

const FooterSection = dynamic(
  () =>
    import('./components/redesign/FooterSection').then((mod) => ({
      default: mod.FooterSection,
    })),
  {
    loading: () => <footer className="h-64 bg-gray-900" />,
  }
)

const ThemeSwitcher = dynamic(
  () =>
    import('./components/redesign/ThemeSwitcher').then((mod) => ({
      default: mod.ThemeSwitcher,
    })),
  {
    ssr: false,
  }
)

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <VTUSection />
      <ContactSection />
      <FooterSection />
      <ThemeSwitcher />
    </main>
  )
}
