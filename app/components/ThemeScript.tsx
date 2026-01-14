'use client'

import { useEffect } from 'react'

export default function ThemeScript() {
  useEffect(() => {
    // This runs only on client side, avoiding hydration mismatch
    const savedTheme = localStorage.getItem('theme')
    const savedPalette = localStorage.getItem('palette')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = savedTheme || (systemDark ? 'dark' : 'light')

    document.documentElement.classList.add(theme)
    if (savedPalette) {
      document.documentElement.setAttribute('data-palette', savedPalette)
    }
  }, [])

  return null
}
