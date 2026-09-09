'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTheme } from '@/app/components/ThemeContext'
import { ArrowRight, Shield, Zap, CheckCircle2, Wifi } from 'lucide-react'

const heroThemeImages = [
  { key: 'sunset', src: '/vtu-hero-sunset.png' },
  { key: 'sky', src: '/vtu-hero-sky.png' },
  { key: 'emerald', src: '/vtu-hero-emerald.png' },
  { key: 'minimal', src: '/vtu-hero-minimal.png' },
] as const

interface VTUHeroProps {
  onGetStarted: () => void
}

export function VTUHero({ onGetStarted }: VTUHeroProps) {
  const { theme, currentTheme, themeName } = useTheme()
  const isDarkMode = theme === 'dark'

  const activeKey = ['sunset', 'sky', 'emerald', 'minimal'].includes(themeName)
    ? themeName
    : 'sunset'

  const stats = [
    { value: '500+', label: 'Daily Transactions' },
    { value: '99.9%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <section
      className={`relative pt-32 pb-24 px-6 sm:px-8 lg:px-12 overflow-hidden transition-colors duration-300 bg-white dark:bg-[#000000] ${isDarkMode ? 'bg-[#000000]' : 'bg-white'}`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a]' : `bg-gradient-to-br ${currentTheme.accentLight} via-white to-white`}`}
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
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm ${isDarkMode ? `bg-[#121212] ${currentTheme.badgeText} border-neutral-800` : `bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeText} ${currentTheme.badgeBorder}`}`}
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

          {/* Right Content - Hero Image with Provider Bubbles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Ambient Radial Glow behind image matching dynamic theme */}
            <div
              className={`absolute w-[460px] h-[460px] rounded-full opacity-35 blur-3xl transition-all duration-700 bg-gradient-to-br ${currentTheme.buttonGradient}`}
            />
            <motion.div
              className={`absolute w-[360px] h-[360px] rounded-full opacity-25 blur-2xl transition-all duration-700 bg-gradient-to-tr ${currentTheme.buttonGradient}`}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Transparent PNG Hero Images - All mounted and stacked for instant, zero-reload theme switching */}
            <div className="relative w-full max-w-[480px] h-[580px] flex items-center justify-center">
              {heroThemeImages.map((item) => {
                const isActive = activeKey === item.key
                return (
                  <div
                    key={item.key}
                    className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                      isActive
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={item.src}
                      alt={`VTU Services - ${item.key}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-bottom drop-shadow-2xl"
                      priority
                    />
                  </div>
                )
              })}
            </div>

            {/* Floating Graphic 1: Real-time Transaction Success Card */}
            <motion.div
              className={`absolute top-10 -right-2 sm:-right-4 p-3.5 rounded-2xl backdrop-blur-xl shadow-2xl z-20 transition-all ${
                isDarkMode
                  ? 'bg-[#0c0c0e]/85 border border-white/10 shadow-black/70'
                  : 'bg-white/95 border border-gray-200/80 shadow-gray-300/40'
              }`}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-3">
                {/* Animated Status Icon Orb */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black" />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Airtime Top-Up
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                      Success
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs font-black bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                    >
                      +₦2,500
                    </span>
                    <span
                      className={`text-[10px] ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`}
                    >
                      • 0.4s ago
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Graphic 2: 5G Connectivity Chip */}
            <motion.div
              className={`absolute top-1/2 -right-4 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg z-20 flex items-center gap-1.5 ${
                isDarkMode
                  ? 'bg-black/70 border border-white/10 text-neutral-200'
                  : 'bg-white/90 border border-gray-200 text-gray-700'
              }`}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-wide">5G Fast</span>
            </motion.div>

            {/* Floating Graphic 3: High-Speed Automated Dispatch Metric */}
            <motion.div
              className={`absolute bottom-8 -left-2 sm:-left-4 p-3.5 rounded-2xl backdrop-blur-xl shadow-2xl z-20 transition-all ${
                isDarkMode
                  ? 'bg-[#0c0c0e]/85 border border-white/10 shadow-black/70'
                  : 'bg-white/95 border border-gray-200/80 shadow-gray-300/40'
              }`}
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Glowing Theme Icon */}
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTheme.buttonGradient} flex items-center justify-center shadow-lg shadow-orange-500/20`}
                >
                  <Zap className="w-5 h-5 text-white animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Automated Dispatch
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      99.9%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Animated mini signal / speed meter bars */}
                    <div className="flex items-end gap-1 h-3">
                      <span
                        className={`w-1 h-2 rounded-full bg-gradient-to-t ${currentTheme.buttonGradient} animate-pulse`}
                      />
                      <span
                        className={`w-1 h-3 rounded-full bg-gradient-to-t ${currentTheme.buttonGradient} animate-pulse`}
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className={`w-1 h-2.5 rounded-full bg-gradient-to-t ${currentTheme.buttonGradient} animate-pulse`}
                        style={{ animationDelay: '300ms' }}
                      />
                      <span
                        className={`w-1 h-3 rounded-full bg-gradient-to-t ${currentTheme.buttonGradient} animate-pulse`}
                        style={{ animationDelay: '450ms' }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-gray-600'}`}
                    >
                      Avg. Speed:{' '}
                      <strong
                        className={isDarkMode ? 'text-white' : 'text-gray-900'}
                      >
                        0.8s
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
