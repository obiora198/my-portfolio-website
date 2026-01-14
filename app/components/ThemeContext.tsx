'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

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
    badgeBg: 'dark:from-slate-800 dark:to-slate-900',
    badgeBorder: 'dark:border-slate-700',
    badgeText: 'dark:text-orange-400',
    accentLight: 'dark:bg-slate-800/50',
  },
  sky: {
    ...themes.sky,
    primary: 'dark:text-sky-400',
    secondary: 'dark:text-blue-400',
    accent: 'dark:text-cyan-400',
    badgeBg: 'dark:from-slate-800 dark:to-slate-900',
    badgeBorder: 'dark:border-slate-700',
    badgeText: 'dark:text-sky-400',
    accentLight: 'dark:bg-slate-800/50',
  },
  emerald: {
    ...themes.emerald,
    primary: 'dark:text-emerald-400',
    secondary: 'dark:text-teal-400',
    accent: 'dark:text-green-400',
    badgeBg: 'dark:from-slate-800 dark:to-slate-900',
    badgeBorder: 'dark:border-slate-700',
    badgeText: 'dark:text-emerald-400',
    accentLight: 'dark:bg-slate-800/50',
  },
  minimal: {
    ...themes.minimal,
    primary: 'dark:text-gray-300',
    secondary: 'dark:text-slate-300',
    accent: 'dark:text-zinc-300',
    badgeBg: 'dark:from-slate-800 dark:to-slate-900',
    badgeBorder: 'dark:border-slate-700',
    badgeText: 'dark:text-gray-300',
    accentLight: 'dark:bg-slate-800/50',
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
  // Use a different name for the mode state setter to avoid conflict with palette function 'setTheme'
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const [themeName, setThemeName] = useState<string>('sunset')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as ThemeMode
    const savedPalette = localStorage.getItem('palette')
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    if (savedTheme) {
      setThemeMode(savedTheme)
    } else if (systemPrefersDark) {
      setThemeMode('dark')
    }

    if (savedPalette && themes[savedPalette]) {
      setThemeName(savedPalette)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(themeMode)
    root.setAttribute('data-palette', themeName)
    localStorage.setItem('theme', themeMode)
    localStorage.setItem('palette', themeName)
  }, [themeMode, themeName, mounted])

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // This is the function to set the palette/color theme
  const setTheme = (name: string) => {
    if (themes[name]) {
      setThemeName(name)
    }
  }

  const value = {
    theme: themeMode,
    themeName,
    currentTheme: mounted
      ? themeMode === 'light'
        ? themes[themeName]
        : darkThemes[themeName]
      : themes.sunset, // Default fallback for hydration
    setTheme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Fallback for SSR
    return {
      theme: 'light' as ThemeMode,
      themeName: 'sunset',
      currentTheme: themes.sunset,
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }
  return context
}
