'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Ghost } from 'lucide-react'
import { useTheme } from './components/ThemeContext'
import { ThemeSwitcher } from './components/redesign/ThemeSwitcher'
import { Navigation } from './components/redesign/Navigation'

export default function NotFound() {
  const { currentTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#1a1d29] transition-colors duration-500">
      <Navigation />
      <ThemeSwitcher />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Orbs */}
        <div
          className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] animate-pulse opacity-10 dark:opacity-20 bg-gradient-to-br ${currentTheme.gradient}`}
        />
        <div
          className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-[120px] animate-pulse delay-700 opacity-10 dark:opacity-20 bg-gradient-to-br ${currentTheme.gradient}`}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl w-full text-center relative z-10"
        >
          <div className="mb-8 flex justify-center">
            <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center justify-center p-4"
          >
            <Ghost className={`w-28 h-28 ${currentTheme.primary} drop-shadow-[0_0_30px_rgba(99,102,241,0.5)] dark:drop-shadow-[0_0_40px_rgba(129,140,248,0.3)] filter brightness-110`} />
          </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b ${currentTheme.gradientText} mb-4 drop-shadow-sm`}
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Lost in the digital void
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-md mx-auto"
          >
            The page you're looking for has vanished or never existed. Let's get
            you back on track.
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
              className="group px-8 py-4 bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-5 dark:opacity-10" />
      </main>
    </div>
  )
}
