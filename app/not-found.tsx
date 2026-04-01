'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Ghost, Sun, Moon } from 'lucide-react'
import { useTheme } from './components/ThemeContext'
import { ThemeSwitcher } from './components/redesign/ThemeSwitcher'

export default function NotFound() {
  const { theme, toggleTheme, currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#030303] transition-colors duration-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme Switcher Floating Component */}
      <ThemeSwitcher />

      {/* Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-xl bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-lg z-50 hover:scale-110 transition-all duration-300 group"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform duration-500" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 group-hover:-rotate-12 transition-transform duration-500" />
        )}
      </button>

      {/* Background Orbs */}
      <div className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] animate-pulse opacity-20 dark:opacity-30 bg-gradient-to-br ${currentTheme.gradient}`} />
      <div className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-[120px] animate-pulse delay-700 opacity-20 dark:opacity-30 bg-gradient-to-br ${currentTheme.gradient}`} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl shadow-2xl"
          >
            <Ghost className={`w-12 h-12 ${currentTheme.primary}`} />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b ${currentTheme.gradientText} mb-4`}
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900 mb-6"
        >
          Lost in the digital void
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto"
        >
          The page you're looking for has vanished or never existed. Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className={`group px-8 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/40 hover:scale-105 active:scale-95`}
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
          <Link
            href="/blog"
            className="group px-8 py-4 bg-white/10 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10 dark:opacity-20" />
    </div>
  )
}