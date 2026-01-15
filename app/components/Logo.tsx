'use client'

import { useTheme } from './ThemeContext'

export function Logo() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              className={currentTheme.primary}
              stopColor="currentColor"
            />
            <stop
              offset="50%"
              className={currentTheme.secondary}
              stopColor="currentColor"
            />
            <stop
              offset="100%"
              className={currentTheme.accent}
              stopColor="currentColor"
            />
          </linearGradient>
        </defs>
        {/* Outer Circle */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
        />
        {/* E Letter */}
        <path
          d="M13 12 H23 M13 12 V20 M13 20 H21 M13 20 V28 M13 28 H23"
          stroke="url(#logoGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* O Letter - small circle on top right */}
        <circle
          cx="27"
          cy="13"
          r="4"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span
          className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Emmanuel
        </span>
        <span
          className={`text-xs tracking-wider ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          OBIORA
        </span>
      </div>
    </div>
  )
}
