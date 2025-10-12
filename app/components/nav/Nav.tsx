'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '../ThemeContext' // Adjust path as needed

interface Links {
  text: string
  url: string
}

export default function Nav({ links }: { links: Links[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme } = useTheme()

  // Handle scroll effect with more granular control
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleAdminMenu = () => setAdminMenuOpen((prev) => !prev)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  // Dynamic classes based on theme and scroll state
  const headerBg = scrolled 
    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-indigo-200/30 dark:border-slate-700 shadow-lg shadow-indigo-500/10 dark:shadow-slate-900/20' 
    : 'bg-transparent dark:bg-transparent backdrop-blur-sm'

  const textColor = scrolled 
    ? 'text-gray-700 dark:text-slate-300' 
    : 'text-white dark:text-white'

  const brandGradient = scrolled 
    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400' 
    : 'hover:text-indigo-600 dark:hover:text-indigo-400 drop-shadow-lg'

  return (
    <>
      <header className={`w-full fixed top-0 z-50 transition-all duration-700 ease-out ${headerBg}`}>
        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center justify-between px-8 sm:px-32 py-6">
          <Link href="/" className="text-4xl font-bold hover:scale-105 transition-all duration-300">
            <span className="text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl px-3 py-1 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
              E
            </span>
            <span className={`ml-1 transition-all duration-500 ${brandGradient}`}>
              mmanuel
            </span>
          </Link>

          <nav>
            <ul className="flex items-center gap-2 text-lg font-medium">
              {links?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className={`relative px-6 py-3 rounded-full transition-all duration-300 group backdrop-blur-sm hover:text-indigo-600 dark:hover:text-indigo-400 drop-shadow-lg ${textColor}`}
                  >
                    <span className="relative z-10">{link.text}</span>
                    <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-indigo-200/50 dark:border-indigo-500/30'}`}></span>
                    {/* Animated underline */}
                    <span className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-3/4 transition-all duration-300 ${'bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400'}`}></span>
                  </Link>
                </li>
              ))}
              
              <li className="relative ml-4">
                <button
                  onClick={toggleAdminMenu}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full drop-shadow-lg transition-all duration-300 group backdrop-blur-sm border hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 ${
                    scrolled 
                      ? 'text-gray-600 dark:text-slate-400 border-indigo-200/50 dark:border-slate-600' 
                      : 'text-purple-600 dark:text-purple-400 border-white/30 dark:border-slate-500 shadow-lg'
                  }`}
                >
                  <i className="fas fa-user-shield text-sm"></i>
                  <span className='drop-shadow-lg'>Admin</span>
                  <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${adminMenuOpen ? 'rotate-180' : ''}`}></i>
                  {/* Glow effect */}
                  <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    scrolled 
                      ? 'shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10' 
                      : 'shadow-lg shadow-white/20 dark:shadow-slate-400/20'
                  }`}></span>
                </button>

                {adminMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setAdminMenuOpen(false)}
                    ></div>
                    
                    <ul className="absolute top-full right-0 mt-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-indigo-100/50 dark:border-slate-600 rounded-2xl shadow-2xl shadow-indigo-500/10 dark:shadow-slate-900/20 z-20 min-w-[180px] overflow-hidden">
                      <li>
                        <Link
                          href="/auth/admin"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center px-6 py-4 text-sm text-gray-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-indigo-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group"
                        >
                          <i className="fas fa-dashboard mr-3 group-hover:text-indigo-500 transition-colors"></i>
                          Dashboard
                          <i className="fas fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"></i>
                        </Link>
                      </li>
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-3xl font-bold hover:scale-105 transition-all duration-300">
            <span className="text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl px-2.5 py-1 shadow-lg shadow-indigo-500/30">
              E
            </span>
            <span className={`ml-1 transition-all duration-500 ${
              scrolled 
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent' 
                : 'text-white dark:text-white drop-shadow-lg'
            }`}>
              mmanuel
            </span>
          </Link>

          <button
            onClick={handleClick}
            aria-label="Toggle Navigation"
            className={`relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group ${
              scrolled 
                ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-slate-600 shadow-lg shadow-indigo-500/10 dark:shadow-slate-900/20' 
                : 'bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm border border-white/30 dark:border-slate-500 shadow-lg'
            }`}
          >
            <div className="flex flex-col justify-between w-5 h-4">
              <span
                className={`block h-0.5 w-full rounded transition-all duration-300 ease-out ${
                  isOpen 
                    ? 'rotate-45 translate-y-1.5 bg-indigo-500 dark:bg-indigo-400' 
                    : (scrolled ? 'bg-indigo-500 dark:bg-slate-400' : 'bg-white dark:bg-slate-300')
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full rounded transition-all duration-300 ease-out ${
                  isOpen 
                    ? 'opacity-0 scale-0' 
                    : (scrolled ? 'bg-indigo-500 dark:bg-slate-400' : 'bg-white dark:bg-slate-300')
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full rounded transition-all duration-300 ease-out ${
                  isOpen 
                    ? '-rotate-45 -translate-y-1.5 bg-indigo-500 dark:bg-indigo-400' 
                    : (scrolled ? 'bg-indigo-500 dark:bg-slate-400' : 'bg-white dark:bg-slate-300')
                }`}
              ></span>
            </div>
            {/* Button glow effect */}
            <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              scrolled 
                ? 'shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10' 
                : 'shadow-lg shadow-white/20 dark:shadow-slate-400/20'
            }`}></span>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 sm:hidden" 
              onClick={closeMobileMenu}
            ></div>
            
            <nav className="absolute top-full left-0 right-0 sm:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-indigo-100/50 dark:border-slate-600 shadow-2xl shadow-indigo-500/10 dark:shadow-slate-900/20 z-50">
              <ul className="flex flex-col py-4 text-lg font-medium">
                {links?.map((link, index) => (
                  <li key={index} className="transform transition-all duration-300 hover:scale-105 origin-left">
                    <Link
                      href={link.url}
                      onClick={closeMobileMenu}
                      className="flex items-center px-8 py-4 text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-indigo-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 border-l-4 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 group"
                    >
                      <span>{link.text}</span>
                      <i className="fas fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-sm"></i>
                    </Link>
                  </li>
                ))}
                <li className="border-t border-indigo-100/50 dark:border-slate-600 mt-2 pt-2 transform transition-all duration-300 hover:scale-105 origin-left">
                  <Link 
                    href="/auth/admin" 
                    onClick={closeMobileMenu}
                    className="flex items-center px-8 py-4 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-indigo-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 border-l-4 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 group"
                  >
                    <i className="fas fa-dashboard mr-3 group-hover:text-indigo-500 transition-colors"></i>
                    <span>Admin Dashboard</span>
                    <i className="fas fa-arrow-right ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-sm"></i>
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </header>

      {/* Add some breathing room for content */}
      <div className="h-20 sm:h-24"></div>
    </>
  )
}