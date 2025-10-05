'use client'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600/90 text-white relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-lg"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-10 p-8 sm:p-16">
        {/* Social Links with enhanced styling */}
        <div className="flex gap-8">
          <a
            href="https://github.com/obiora198"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-110 hover:bg-white/20 hover:shadow-2xl hover:shadow-indigo-500/30"
            aria-label="GitHub"
          >
            <i
              className="fab fa-github text-2xl sm:text-3xl"
              aria-hidden="true"
            ></i>
            {/* Enhanced hover glow effect */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-0"></span>
          </a>

          <a
            href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 hover:border-white/50 transition-all duration-500 hover:scale-110 hover:bg-white/20 hover:shadow-2xl hover:shadow-purple-500/30"
            aria-label="LinkedIn"
          >
            <i
              className="fab fa-linkedin text-2xl sm:text-3xl"
              aria-hidden="true"
            ></i>
            {/* Enhanced hover glow effect */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-0"></span>
          </a>
        </div>

        {/* Enhanced copyright with better gradient */}
        <div className="text-center space-y-3">
          <small className="text-lg font-medium bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            © {new Date().getFullYear()} - Created by Obiora Sopuluchukwu
            Emmanuel
          </small>

          {/* Additional tagline */}
          <p className="text-sm text-white/70 font-light italic">
            Crafting digital experiences with modern technology
          </p>
        </div>

        {/* Enhanced decorative elements */}
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Quick navigation links */}
        <nav className="flex gap-6 mt-4">
          <a
            href="#hero-section"
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium hover:scale-105"
          >
            Home
          </a>
          <a
            href="#contact-section"
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium hover:scale-105"
          >
            Contact
          </a>
          <a
            href="/auth/admin"
            className="text-white/70 hover:text-white transition-colors duration-300 text-sm font-medium hover:scale-105"
          >
            Admin
          </a>
        </nav>
      </div>
    </footer>
  )
}
