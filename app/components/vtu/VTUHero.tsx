'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/app/components/ThemeContext'

interface VTUHeroProps {
  onGetStarted: () => void
}

export function VTUHero({ onGetStarted }: VTUHeroProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <section
      className={`relative pt-32 pb-20 px-6 sm:px-8 lg:px-12 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-white'}`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-[#1a1d29] via-[#0B0D17] to-[#0B0D17]' : 'bg-gradient-to-br from-indigo-50 via-white to-white'}`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${isDarkMode ? 'bg-[#1C1E2E] text-orange-400' : 'bg-indigo-100 text-indigo-700'}`}
              >
                🚀 Fast & Secure Transactions
              </motion.div>

              <h1
                className={`text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Everything You Need to{' '}
                <span
                  className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  Stay Connected
                </span>
              </h1>

              <p
                className={`text-base sm:text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Top up airtime, buy data, pay bills, and more — all in one
                place. Fast, secure, and hassle-free.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r ${currentTheme.buttonGradient} text-white`}
              >
                Get Started Now
              </button>
              <a
                href="#how-it-works"
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${isDarkMode ? 'bg-[#1C1E2E] text-white hover:bg-[#252836]' : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200'}`}
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <h3
                  className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  500+
                </h3>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  Daily Transactions
                </p>
              </div>
              <div>
                <h3
                  className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  99.9%
                </h3>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  Success Rate
                </p>
              </div>
              <div>
                <h3
                  className={`text-3xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  24/7
                </h3>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  Support
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Decorative gradient blur behind image */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentTheme.buttonGradient} opacity-20 blur-3xl rounded-full`}
            />

            {/* Image container with border gradient */}
            <div className="relative w-full h-[600px]">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.buttonGradient} rounded-3xl opacity-75 blur-sm`}
              />
              <div
                className={`relative w-full h-full rounded-3xl p-1 bg-gradient-to-br ${currentTheme.buttonGradient}`}
              >
                <div
                  className={`relative w-full h-full rounded-3xl overflow-hidden ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-white'}`}
                >
                  <Image
                    src="/vtu-phone-mockup.png"
                    alt="VTU Platform"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl p-4"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
