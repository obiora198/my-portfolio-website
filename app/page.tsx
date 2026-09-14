import dynamic from 'next/dynamic'
import { Navigation } from './components/redesign/Navigation'
import { HeroSection } from './components/redesign/HeroSection'

// Keep heavy/below-the-fold sections dynamic for performance
const ProjectsSection = dynamic(
  () =>
    import('./components/redesign/ProjectsSection').then((mod) => ({
      default: mod.ProjectsSection,
    })),
  {
    loading: () => (
      <div className="py-20 animate-pulse bg-gray-50/50 dark:bg-[#0a0a0a]/50 min-h-[800px]" />
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
      <div className="py-20 animate-pulse bg-gray-50/50 dark:bg-[#000000]/50 min-h-[600px]" />
    ),
  }
)

const VTUSection = dynamic(
  () =>
    import('./components/redesign/VTUSection').then((mod) => ({
      default: mod.VTUSection,
    })),
  {
    loading: () => <div className="py-20 min-h-[400px] dark:bg-[#0a0a0a]" />,
  }
)

const ContactSection = dynamic(
  () =>
    import('./components/redesign/ContactSection').then((mod) => ({
      default: mod.ContactSection,
    })),
  {
    loading: () => <div className="py-20 min-h-[600px] dark:bg-[#000000]" />,
  }
)

const FooterSection = dynamic(
  () =>
    import('./components/redesign/FooterSection').then((mod) => ({
      default: mod.FooterSection,
    })),
  {
    loading: () => <footer className="h-64 bg-white dark:bg-[#000000]" />,
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

const WelcomeModal = dynamic(
  () =>
    import('./components/redesign/WelcomeModal').then((mod) => ({
      default: mod.WelcomeModal,
    })),
  {
    ssr: false,
  }
)

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-[#000000]">
      <Navigation />
      <HeroSection />
      <ProjectsSection />
      <BlogSection />
      <VTUSection />
      <ContactSection />
      <FooterSection />
      <ThemeSwitcher />
      <WelcomeModal />
    </main>
  )
}
