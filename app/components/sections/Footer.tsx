'use client'

import { useTheme } from '../../components/ThemeContext'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import { BsLightning } from 'react-icons/bs'
import Link from 'next/link'

export default function Footer() {
  const { theme, toggleTheme } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-indigo-600 dark:bg-indigo-900 text-white border-t border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-16 md:px-24 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BsLightning className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Emmanuel Obiora
                </h3>
                <p className="text-xs text-indigo-100">Web Developer</p>
              </div>
            </div>
            <p className="text-sm text-indigo-50 leading-relaxed">
              Crafting modern web experiences with cutting-edge technologies.
              Passionate about clean code and exceptional user experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-indigo-100 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#about-section"
                className="text-sm text-indigo-100 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/#projects-section"
                className="text-sm text-indigo-100 hover:text-white transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="text-sm text-indigo-100 hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/vtu"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                VTU Services
              </Link>
            </nav>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Connect
            </h4>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://github.com/obiora198"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="text-lg" />
              </a>
            </div>

            {/* Theme Toggle */}
            <div className="pt-4">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all group"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <>
                    <HiOutlineMoon className="text-lg text-white group-hover:text-indigo-100 transition-colors" />
                    <span className="text-sm font-medium text-white group-hover:text-indigo-100 transition-colors">
                      Dark Mode
                    </span>
                  </>
                ) : (
                  <>
                    <HiOutlineSun className="text-lg text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Light Mode
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-indigo-100 text-center sm:text-left">
              © {currentYear} Emmanuel Obiora. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/auth/admin"
                className="text-sm text-indigo-100 hover:text-white transition-colors"
              >
                Admin
              </Link>
              <a
                href="/#contact-section"
                className="text-sm text-indigo-100 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
