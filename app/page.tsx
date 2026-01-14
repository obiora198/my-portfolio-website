import dynamic from 'next/dynamic'

// Import the redesign components with proper loading states
const Navigation = dynamic(
  () =>
    import('./components/redesign/Navigation').then((mod) => ({
      default: mod.Navigation,
    })),
  {
    loading: () => <nav className="h-20" />,
  }
)

const HeroSection = dynamic(
  () =>
    import('./components/redesign/HeroSection').then((mod) => ({
      default: mod.HeroSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
  }
)

const AboutSection = dynamic(
  () =>
    import('./components/redesign/AboutSection').then((mod) => ({
      default: mod.AboutSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
  }
)

const ProjectsSection = dynamic(
  () =>
    import('./components/redesign/ProjectsSection').then((mod) => ({
      default: mod.ProjectsSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
  }
)

const BlogSection = dynamic(
  () =>
    import('./components/redesign/BlogSection').then((mod) => ({
      default: mod.BlogSection,
    })),
  {
    loading: () => <div className="min-h-[60vh]" />,
  }
)

const VTUSection = dynamic(
  () =>
    import('./components/redesign/VTUSection').then((mod) => ({
      default: mod.VTUSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
  }
)

const ContactSection = dynamic(
  () =>
    import('./components/redesign/ContactSection').then((mod) => ({
      default: mod.ContactSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
  }
)

const FooterSection = dynamic(
  () =>
    import('./components/redesign/FooterSection').then((mod) => ({
      default: mod.FooterSection,
    })),
  {
    loading: () => <footer className="h-64" />,
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
