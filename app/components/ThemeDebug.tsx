'use client'

import { useTheme } from './ThemeContext'

export default function ThemeDebug() {
  const { theme, themeName, currentTheme, setTheme, toggleTheme } = useTheme()

  const handleTest = () => {
    console.log('Current theme:', theme)
    console.log('Current themeName:', themeName)
    console.log('Current theme object:', currentTheme)
    console.log('Trying to set theme to coral...')
    setTheme('coral')
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'white',
        padding: '20px',
        zIndex: 9999,
        border: '2px solid black',
      }}
    >
      <h3>Theme Debug</h3>
      <p>Mode: {theme}</p>
      <p>Theme Name: {themeName}</p>
      <button
        onClick={handleTest}
        style={{ padding: '10px', background: 'blue', color: 'white' }}
      >
        Test Set Theme
      </button>
      <button
        onClick={toggleTheme}
        style={{
          padding: '10px',
          background: 'green',
          color: 'white',
          marginLeft: '10px',
        }}
      >
        Toggle Dark/Light
      </button>
    </div>
  )
}
