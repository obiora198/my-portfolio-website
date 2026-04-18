'use client'

import { motion } from 'framer-motion'
import { Timer, Bell, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/app/components/ThemeContext'

export default function VTUComingSoon() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}>
      {/* Background elements */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-[#1a1d29] via-[#0B0D17] to-[#0B0D17]' : `bg-gradient-to-br ${currentTheme.accentLight} via-white to-white`}`} />

      {/* Animated grid pattern */}
      <div
        className={`absolute inset-0 opacity-[0.03] ${isDarkMode ? 'opacity-[0.05]' : ''}`}
        style={{
          backgroundImage: `linear-gradient(rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(${isDarkMode ? '255,255,255' : '0,0,0'}, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br ${currentTheme.buttonGradient} opacity-[0.1] blur-3xl`}
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br ${currentTheme.buttonGradient} opacity-[0.08] blur-3xl`}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon/Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm mb-8 ${isDarkMode ? 'bg-[#1C1E2E]/80 text-orange-400 border-orange-400/20' : `bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeText} ${currentTheme.badgeBorder}`}`}>
            <Timer className="w-4 h-4" />
            Under Development
          </div>

          <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            VTU Services are{' '}
            <span className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
              Coming Soon
            </span>
          </h1>

          <p className={`text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We&apos;re building a premium experience for airtime, data, and bill payments.
            Stay tuned for a faster, more secure way to stay connected.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border backdrop-blur-sm ${isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 shadow-sm'}`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>

            <button className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg bg-gradient-to-r ${currentTheme.buttonGradient} text-white hover:scale-105 active:scale-95`}>
              <Bell className="w-5 h-5" />
              Notify Me
            </button>
          </div>
        </motion.div>

        {/* Progress illustration */}
        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`w-full max-w-md h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
            <motion.div
              className={`h-full bg-gradient-to-r ${currentTheme.buttonGradient}`}
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, delay: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
        <p className={`mt-4 text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Development Progress: 75%
        </p>
      </div>
    </div>
  )
}
