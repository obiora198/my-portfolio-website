'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface Links {
  text: string
  url: string
}

export default function Nav({ links }: { links: Links[] }) {
  const [isOPen, setIsOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const toggleAdminMenu = () => setAdminMenuOpen((prev) => !prev)

  const handleClick = () => {
    setIsOpen(!isOPen)
  }

  return (
    <>
      <header className="w-full sticky top-0 bg-white/90 backdrop-blur-md border-b shadow-sm shadow-indigo-100 z-50">
        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center justify-between px-8 sm:px-32 py-4">
          <Link href="/" className="text-4xl font-bold text-black">
            <span className="text-white bg-indigo-500 rounded-md px-1">E</span>
            mmanuel
          </Link>

          <nav>
            <ul className="flex items-center gap-8 text-lg font-medium">
              {links?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="transition-all duration-300 border-b-2 border-transparent hover:border-indigo-500 hover:text-indigo-500"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
              <li className="relative">
                <button
                  onClick={toggleAdminMenu}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-500 transition-all duration-300"
                >
                  Admin
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>

                {adminMenuOpen && (
                  <ul className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-md z-20 min-w-[160px]">
                    <li>
                      <Link
                        href="/auth/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition"
                      >
                        Dashboard
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="text-4xl font-bold text-black">
            <span className="text-white bg-indigo-500 rounded-md px-1">E</span>
          </Link>

          {/* Mobile Menu Icon */}
          <button
            onClick={handleClick}
            aria-label="Toggle Navigation"
            className="flex flex-col justify-between w-8 h-8 relative z-50"
          >
            <span
              className={`block h-0.5 w-full bg-indigo-500 rounded transition-transform duration-300 ease-in-out ${
                isOPen ? 'rotate-45 translate-y-4' : ''
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-indigo-500 rounded transition-all duration-300 ease-in-out ${
                isOPen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block h-0.5 w-full bg-indigo-500 rounded transition-transform duration-300 ease-in-out ${
                isOPen ? '-rotate-45 -translate-y-4' : ''
              }`}
            ></span>
          </button>

          {/* Mobile Menu */}
          <nav
            className={`absolute top-16 left-0 w-full bg-white shadow-md rounded-b-md transition-all duration-300 ease-in-out ${
              isOPen
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <ul className="flex flex-col items-center gap-6 py-6 text-lg font-medium text-gray-700">
              {links?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    onClick={handleClick}
                    className="px-4 py-2 rounded-full hover:bg-indigo-100 transition"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
              <li className="text-sm text-gray-400 hover:text-indigo-500 transition">
                <Link href="/auth/admin" onClick={handleClick}>
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
