'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'
import { generateFavicon, updateFavicon } from '../utils/favicon'

export type ThemeMode = 'light' | 'dark'

export interface ThemeColors {
  name: string
  description: string
  primary: string
  secondary: string
  accent: string
  gradient: string
  gradientText: string
  buttonGradient: string
  buttonHover: string
  badgeBg: string
  badgeBorder: string
  badgeText: string
  iconBg: string
  accentLight: string
  preview: string
}

export const themes: Record<string, ThemeColors> = {
  sunset: {
    name: 'Sunset Glow',
    description: 'Warm and creative',
    primary: 'text-orange-600',
    secondary: 'text-rose-600',
    accent: 'text-pink-600',
    gradient: 'from-orange-600 via-rose-600 to-pink-600',
    gradientText: 'from-orange-600 via-rose-600 to-pink-600',
    buttonGradient: 'from-orange-600 to-rose-600',
    buttonHover: 'hover:from-orange-700 hover:to-rose-700',
    badgeBg: 'from-orange-50 to-rose-50',
    badgeBorder: 'border-orange-100',
    badgeText: 'text-orange-700',
    iconBg: 'from-orange-600 to-rose-600',
    accentLight: 'bg-orange-50/30',
    preview: 'bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600',
  },
  sky: {
    name: 'Sky Blue',
    description: 'Calm and professional',
    primary: 'text-sky-600',
    secondary: 'text-blue-600',
    accent: 'text-cyan-600',
    gradient: 'from-sky-500 via-blue-600 to-cyan-600',
    gradientText: 'from-sky-500 via-blue-600 to-cyan-600',
    buttonGradient: 'from-sky-500 to-blue-600',
    buttonHover: 'hover:from-sky-600 hover:to-blue-700',
    badgeBg: 'from-sky-50 to-blue-50',
    badgeBorder: 'border-sky-100',
    badgeText: 'text-sky-700',
    iconBg: 'from-sky-500 to-blue-600',
    accentLight: 'bg-sky-50/30',
    preview: 'bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600',
  },
  emerald: {
    name: 'Emerald Fresh',
    description: 'Fresh and vibrant',
    primary: 'text-emerald-600',
    secondary: 'text-teal-600',
    accent: 'text-green-600',
    gradient: 'from-emerald-600 via-teal-600 to-green-600',
    gradientText: 'from-emerald-600 via-teal-600 to-green-600',
    buttonGradient: 'from-emerald-600 to-teal-600',
    buttonHover: 'hover:from-emerald-700 hover:to-teal-700',
    badgeBg: 'from-emerald-50 to-teal-50',
    badgeBorder: 'border-emerald-100',
    badgeText: 'text-emerald-700',
    iconBg: 'from-emerald-600 to-teal-600',
    accentLight: 'bg-emerald-50/30',
    preview: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600',
  },
  minimal: {
    name: 'Minimalist',
    description: 'Clean and modern',
    primary: 'text-gray-800',
    secondary: 'text-slate-700',
    accent: 'text-zinc-700',
    gradient: 'from-gray-700 via-slate-700 to-zinc-700',
    gradientText: 'from-gray-800 via-slate-800 to-zinc-800',
    buttonGradient: 'from-gray-700 to-slate-700',
    buttonHover: 'hover:from-gray-800 hover:to-slate-800',
    badgeBg: 'from-gray-50 to-slate-50',
    badgeBorder: 'border-gray-200',
    badgeText: 'text-gray-800',
    iconBg: 'from-gray-700 to-slate-700',
    accentLight: 'bg-gray-50/30',
    preview: 'bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700',
  },
}

// Dark mode variants
export const darkThemes: Record<string, ThemeColors> = {
  sunset: {
    ...themes.sunset,
    primary: 'dark:text-orange-400',
    secondary: 'dark:text-rose-400',
    accent: 'dark:text-pink-400',
    badgeBg: 'dark:from-black dark:to-neutral-900',
    badgeBorder: 'dark:border-neutral-800',
    badgeText: 'dark:text-orange-400',
    accentLight: 'dark:bg-neutral-900/60',
  },
  sky: {
    ...themes.sky,
    primary: 'dark:text-sky-400',
    secondary: 'dark:text-blue-400',
    accent: 'dark:text-cyan-400',
    badgeBg: 'dark:from-black dark:to-neutral-900',
    badgeBorder: 'dark:border-neutral-800',
    badgeText: 'dark:text-sky-400',
    accentLight: 'dark:bg-neutral-900/60',
  },
  emerald: {
    ...themes.emerald,
    primary: 'dark:text-emerald-400',
    secondary: 'dark:text-teal-400',
    accent: 'dark:text-green-400',
    badgeBg: 'dark:from-black dark:to-neutral-900',
    badgeBorder: 'dark:border-neutral-800',
    badgeText: 'dark:text-emerald-400',
    accentLight: 'dark:bg-neutral-900/60',
  },
  minimal: {
    ...themes.minimal,
    primary: 'dark:text-gray-300',
    secondary: 'dark:text-slate-300',
    accent: 'dark:text-zinc-300',
    badgeBg: 'dark:from-black dark:to-neutral-900',
    badgeBorder: 'dark:border-neutral-800',
    badgeText: 'dark:text-gray-300',
    accentLight: 'dark:bg-neutral-900/60',
  },
}

interface ThemeContextType {
  theme: ThemeMode
  themeName: string
  currentTheme: ThemeColors
  setTheme: (name: string) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Helper to read cookies
  const getCookieValue = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  // Initialize state synchronously from DOM/localStorage/cookie if on client
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = (localStorage.getItem('theme') || getCookieValue('theme')) as ThemeMode
      if (saved === 'light') return 'light'
      return 'dark'
    }
    return 'dark'
  })

  const [themeName, setThemeName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const dataPalette = document.documentElement.getAttribute('data-palette')
      if (dataPalette && themes[dataPalette]) return dataPalette
      const saved = localStorage.getItem('palette') || getCookieValue('palette')
      if (saved && themes[saved]) return saved
    }
    return 'sunset'
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const dataPalette = document.documentElement.getAttribute('data-palette')
      const savedPalette = localStorage.getItem('palette') || getCookieValue('palette')
      const effectivePalette = (dataPalette && themes[dataPalette])
        ? dataPalette
        : (savedPalette && themes[savedPalette])
          ? savedPalette
          : null

      if (effectivePalette) {
        setThemeName(effectivePalette)
      }

      const savedTheme = (localStorage.getItem('theme') || getCookieValue('theme')) as ThemeMode
      const effectiveTheme: ThemeMode = savedTheme === 'light' ? 'light' : 'dark'

      setThemeMode(effectiveTheme)
    } catch (e) {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(themeMode)
      root.setAttribute('data-palette', themeName)
      localStorage.setItem('theme', themeMode)
      localStorage.setItem('palette', themeName)
      document.cookie = `theme=${themeMode}; path=/; max-age=31536000; SameSite=Lax`
      document.cookie = `palette=${themeName}; path=/; max-age=31536000; SameSite=Lax`

      // Update favicon with current theme colors
      const currentColors =
        themeMode === 'light' ? themes[themeName] : darkThemes[themeName]
      const faviconHref = generateFavicon(
        currentColors.primary,
        currentColors.secondary,
        currentColors.accent
      )
      updateFavicon(faviconHref)
    } catch (e) {}
  }, [themeMode, themeName, mounted])

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('theme', next)
        document.cookie = `theme=${next}; path=/; max-age=31536000; SameSite=Lax`
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(next)
      } catch (e) {}
      return next
    })
  }, [])

  // This is the function to set the palette/color theme
  const setTheme = useCallback((name: string) => {
    if (themes[name]) {
      setThemeName(name)
      try {
        localStorage.setItem('palette', name)
        document.cookie = `palette=${name}; path=/; max-age=31536000; SameSite=Lax`
        document.documentElement.setAttribute('data-palette', name)
      } catch (e) {}
    }
  }, [])

  const value = useMemo(() => ({
    theme: themeMode,
    themeName,
    currentTheme:
      themeMode === 'light' ? themes[themeName] : darkThemes[themeName],
    setTheme,
    toggleTheme,
  }), [themeMode, themeName, setTheme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Fallback for SSR
    return {
      theme: 'dark' as ThemeMode,
      themeName: 'sunset',
      currentTheme: darkThemes.sunset,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return context
}
