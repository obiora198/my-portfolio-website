'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaUserShield,
  FaChevronDown,
  FaThLarge,
  FaArrowRight,
  FaChevronRight,
} from 'react-icons/fa'
import { useTheme } from '../ThemeContext'

interface Links {
  text: string
  url?: string
  subLinks?: Links[]
}

const links = [
  {
    text: 'Home',
    url: '/',
  },
  {
    text: 'Apps',
    subLinks: [
      { text: 'Buy Data', url: '/vtu' },
      { text: 'Blog', url: '/blog' },
    ],
  },
  {
    text: 'Quick Navigation',
    subLinks: [
      { text: 'About', url: '/#about-section' },
      { text: 'Skills', url: '/#skills-section' },
      { text: 'Projects', url: '/#projects-section' },
    ],
  },
  {
    text: 'Contact',
    url: '/#contact-section',
  },
]

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null)
  const [mobileDropdownOpenIndex, setMobileDropdownOpenIndex] = useState<number | null>(null)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleAdminMenu = () => setAdminMenuOpen((prev) => !prev)
  const toggleMobileMenu = () => setIsOpen((prev) => !prev)
  const closeMobileMenu = () => {
    setIsOpen(false)
    setMobileDropdownOpenIndex(null)
  }

  const toggleMobileDropdown = (index: number) => {
    setMobileDropdownOpenIndex(mobileDropdownOpenIndex === index ? null : index)
  }

  const headerBg = scrolled
    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-indigo-200/30 dark:border-slate-700 shadow-lg shadow-indigo-500/10 dark:shadow-slate-900/20'
    : 'bg-white dark:bg-transparent'

  const textColor = scrolled
    ? 'text-gray-700 dark:text-slate-300'
    : 'text-gray-500 dark:text-white'

  const brandGradient = scrolled
    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400'
    : 'hover:text-indigo-600 dark:hover:text-indigo-400 drop-shadow-lg'

  return (
    <>
      <header
        className={`w-full fixed top-0 z-50 transition-all duration-700 ease-out ${headerBg}`}
      >
        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center justify-between px-8 sm:px-32 py-6">
          {/* Brand */}
          <Link
            href="/"
            className="text-4xl font-bold hover:scale-105 transition-all duration-300"
          >
            <span className="text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl px-3 py-1 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300">
              E
            </span>
            <span
              className={`ml-1 transition-all duration-500 ${brandGradient}`}
            >
              mmanuel
            </span>
          </Link>

          {/* Links */}
          <nav>
            <ul className="flex items-center gap-2 text-lg font-medium">
              {links?.map((link, index) => (
                <li key={index} className="relative">
                  {!link.url ? (
                    <div
                      className={`relative px-6 py-3 rounded-full transition-all duration-300 group backdrop-blur-sm hover:text-indigo-600 dark:hover:text-indigo-400 drop-shadow-lg ${textColor}`}
                      onMouseEnter={() => setDropdownOpenIndex(index)}
                      onMouseLeave={() => setDropdownOpenIndex(null)}
                    >
                      <span className="relative z-10">{link.text}</span>

                      {/* Dropdown menu */}
                      {link.subLinks && (
                        <ul
                          className={`absolute left-0 top-full min-w-full rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-indigo-200/30 dark:border-slate-600 transition-all duration-300 ease-out origin-top transform ${
                            dropdownOpenIndex === index
                              ? 'opacity-100 translate-y-0 pointer-events-auto'
                              : 'opacity-0 -translate-y-3 pointer-events-none'
                          }`}
                        >
                          {link.subLinks.map((sublink, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                href={sublink.url || '#'}
                                className="block px-5 py-2.5 text-gray-700 dark:text-slate-300 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors duration-200"
                              >
                                {sublink.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.url}
                      className={`relative px-6 py-3 rounded-full transition-all duration-300 group backdrop-blur-sm hover:text-indigo-600 dark:hover:text-indigo-400 drop-shadow-lg ${textColor}`}
                    >
                      <span className="relative z-10">{link.text}</span>
                      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-indigo-200/50 dark:border-indigo-500/30"></span>
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-3/4 transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400"></span>
                    </Link>
                  )}
                </li>
              ))}

              {/* Admin Menu */}
              <li className="relative ml-4">
                <button
                  onClick={toggleAdminMenu}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full drop-shadow-lg transition-all duration-300 group backdrop-blur-sm border hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 ${
                    scrolled
                      ? 'text-gray-600 dark:text-slate-400 border-indigo-200/50 dark:border-slate-600'
                      : 'text-purple-600 dark:text-purple-400 border-white/30 dark:border-slate-500 shadow-lg'
                  }`}
                >
                  <FaUserShield className="text-sm" />
                  <span className="drop-shadow-lg">Admin</span>
                  <FaChevronDown
                    className={`text-xs transition-transform duration-300 ${adminMenuOpen ? 'rotate-180' : ''}`}
                  />
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
                          <FaThLarge className="mr-3 group-hover:text-indigo-500 transition-colors" />
                          Dashboard
                          <FaArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
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
          <Link
            href="/"
            className="text-3xl font-bold hover:scale-105 transition-all duration-300"
          >
            <span className="text-white bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl px-2.5 py-1 shadow-lg shadow-indigo-500/30">
              E
            </span>
            <span
              className={`ml-1 transition-all duration-500 ${scrolled ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent' : 'text-white dark:text-white drop-shadow-lg'}`}
            >
              mmanuel
            </span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation"
            className={`relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group ${
              scrolled
                ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200/50 dark:border-slate-600 shadow-lg shadow-indigo-500/10 dark:shadow-slate-900/20'
                : 'bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm border border-white/30 dark:border-slate-500 shadow-lg'
            }`}
          >
            <div className="flex flex-col justify-between w-5 h-4">
              <span
                className={`block h-0.5 w-full rounded transition-all duration-300 ease-out ${isOpen ? 'rotate-45 translate-y-1.5 bg-indigo-500 dark:bg-indigo-400' : scrolled ? 'bg-indigo-500 dark:bg-slate-400' : 'bg-white dark:bg-slate-300'}`}
              ></span>
              <span
                className={`block h-0.5 w-full rounded transition-all duration-300 ease-out ${isOpen ? 'opacity-0 scale-0' : scrolled ? 'bg-indigo-500 dark:bg-slate-400' : 'bg-white dark:bg-slate-300'}`}
              ></span>
              <span
                className={`block h-0.5 w-full rounded transition-all duration-300 ease-out ${isOpen ? '-rotate-45 -translate-y-1.5 bg-indigo-500 dark:bg-indigo-400' : scrolled ? 'bg-indigo-500 dark:bg-slate-400' : 'bg-white dark:bg-slate-300'}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40 sm:hidden"
              onClick={closeMobileMenu}
            ></div>
            <nav className="absolute top-full left-0 right-0 sm:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-indigo-100/50 dark:border-slate-600 shadow-2xl shadow-indigo-500/10 dark:shadow-slate-900/20 z-50">
              <ul className="flex flex-col py-4 text-lg font-medium">
                {links?.map((link, index) => (
                  <li key={index} className="border-b border-indigo-100/30 dark:border-slate-600/50 last:border-b-0">
                    {link.url ? (
                      <Link
                        href={link.url}
                        onClick={closeMobileMenu}
                        className="flex items-center px-8 py-4 text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-indigo-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 border-l-4 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 group"
                      >
                        <span>{link.text}</span>
                        <FaArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-sm" />
                      </Link>
                    ) : (
                      <div className="border-l-4 border-transparent">
                        <button
                          onClick={() => toggleMobileDropdown(index)}
                          className="flex items-center justify-between w-full px-8 py-4 text-gray-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-indigo-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 group"
                        >
                          <span>{link.text}</span>
                          <FaChevronDown
                            className={`text-xs transition-transform duration-300 ${
                              mobileDropdownOpenIndex === index ? 'rotate-180 text-indigo-500' : ''
                            }`}
                          />
                        </button>
                        
                        {/* Mobile Dropdown Menu */}
                        {link.subLinks && (
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-out ${
                              mobileDropdownOpenIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <ul className="bg-indigo-50/30 dark:bg-slate-700/30 ml-8 mr-4 mb-2 rounded-lg border border-indigo-100/50 dark:border-slate-600/50">
                              {link.subLinks.map((sublink, subIndex) => (
                                <li key={subIndex} className="border-b border-indigo-100/30 dark:border-slate-600/30 last:border-b-0">
                                  <Link
                                    href={sublink.url || '#'}
                                    onClick={closeMobileMenu}
                                    className="flex items-center px-6 py-3 text-sm text-gray-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-all duration-200 group"
                                  >
                                    <FaChevronRight className="mr-3 text-xs opacity-60 group-hover:opacity-100 group-hover:text-indigo-500 transition-all duration-200" />
                                    <span>{sublink.text}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
                <li className="border-t border-indigo-100/50 dark:border-slate-600 mt-2 pt-2">
                  <Link
                    href="/auth/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center px-8 py-4 text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:via-purple-50 hover:to-pink-50 dark:hover:from-indigo-900/50 dark:hover:via-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-300 border-l-4 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 group"
                  >
                    <FaThLarge className="mr-3 group-hover:text-indigo-500 transition-colors" />
                    <span>Admin Dashboard</span>
                    <FaArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-sm" />
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
      </header>

      {/* Spacer to prevent content jump */}
      <div className="h-20 sm:h-24"></div>
    </>
  )
}