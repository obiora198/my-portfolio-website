'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/app/components/ThemeContext'
import { ArrowRight, Shield, Zap } from 'lucide-react'

interface VTUHeroProps {
  onGetStarted: () => void
}

export function VTUHero({ onGetStarted }: VTUHeroProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const stats = [
    { value: '500+', label: 'Daily Transactions' },
    { value: '99.9%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <section
      className={`relative pt-32 pb-24 px-6 sm:px-8 lg:px-12 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-white'}`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-[#1a1d29] via-[#0B0D17] to-[#0B0D17]' : `bg-gradient-to-br ${currentTheme.accentLight} via-white to-white`}`}
      />

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
        className={`absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br ${currentTheme.buttonGradient} opacity-[0.07] blur-3xl`}
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br ${currentTheme.buttonGradient} opacity-[0.05] blur-3xl`}
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${isDarkMode ? 'bg-[#1C1E2E]/80 text-orange-400 border-orange-400/20' : `bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeText} ${currentTheme.badgeBorder}`}`}
              >
                <Zap className="w-4 h-4" />
                Fast & Secure Transactions
              </motion.div>

              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Everything You Need to{' '}
                <span
                  className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  Stay Connected
                </span>
              </h1>

              <p
                className={`text-lg sm:text-xl leading-relaxed max-w-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Top up airtime, buy data, pay bills, and more — all in one
                place. Fast, secure, and hassle-free.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg bg-gradient-to-r ${currentTheme.buttonGradient} text-white overflow-hidden`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              <motion.a
                href="/vtu#how-it-works"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`px-8 py-4 rounded-2xl font-bold text-lg text-center transition-all duration-300 backdrop-blur-sm ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10 border border-white/10' : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}
              >
                Learn More
              </motion.a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 rounded-2xl backdrop-blur-sm ${isDarkMode ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-gray-50/80 border border-gray-100'}`}
                >
                  <h3
                    className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
            >
              <Shield className="w-4 h-4" />
              <span>Bank-level encryption on all transactions</span>
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Radial glow behind image */}
            <div
              className={`absolute w-[500px] h-[500px] rounded-full opacity-30`}
              style={{
                background: `radial-gradient(circle, ${isDarkMode ? 'rgba(249,115,22,0.4)' : 'rgba(249,115,22,0.15)'} 0%, transparent 70%)`,
              }}
            />
            <motion.div
              className={`absolute w-[400px] h-[400px] rounded-full opacity-20`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `radial-gradient(circle, ${isDarkMode ? 'rgba(225,29,72,0.3)' : 'rgba(225,29,72,0.1)'} 0%, transparent 70%)`,
              }}
            />

            {/* Phone mockup with blend mode to remove dark bg */}
            <div className="relative w-full h-[600px]">
              <Image
                src="/vtu-phone-mockup2.png"
                alt="VTU Platform"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Small floating badges */}
            <motion.div
              className={`absolute top-16 right-4 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white border border-gray-200'}`}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span
                  className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Live
                </span>
              </div>
            </motion.div>

            <motion.div
              className={`absolute bottom-24 left-0 px-4 py-3 rounded-xl backdrop-blur-md shadow-lg ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white border border-gray-200'}`}
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${currentTheme.buttonGradient}`}
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Instant Delivery
                  </p>
                  <p
                    className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Under 5 seconds
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
