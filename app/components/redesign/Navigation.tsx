'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '../ThemeContext'
import { Logo } from '../Logo'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'VTU Services', href: '#vtu' },
  { name: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg'
            : 'bg-white/95 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            className="relative z-50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {link.name}
              </motion.a>
            ))}

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className={`fixed top-20 left-0 right-0 lg:hidden ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-2xl`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-6 py-8 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
