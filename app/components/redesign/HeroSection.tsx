'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '../ThemeContext'

const heroThemeImages = [
  { key: 'sunset', src: '/hero-img-red.png', alt: 'Emmanuel Obiora - Sunset Theme' },
  { key: 'sky', src: '/hero-img-blue.png', alt: 'Emmanuel Obiora - Sky Theme' },
  { key: 'emerald', src: '/hero-img-green.png', alt: 'Emmanuel Obiora - Emerald Theme' },
  { key: 'minimal', src: '/hero-img-minimalist.png', alt: 'Emmanuel Obiora - Minimal Theme' },
] as const

export function HeroSection() {
  const { theme, currentTheme, themeName } = useTheme()
  const isDarkMode = theme === 'dark'
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const activeKey = ['sunset', 'sky', 'emerald', 'minimal'].includes(themeName)
    ? themeName
    : 'sunset'

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-white dark:bg-[#000000] ${
        isDarkMode ? 'bg-[#000000]' : 'bg-white'
      }`}
    >
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br ${currentTheme.gradient} opacity-30 rounded-full blur-3xl`}
        />
        <div
          className={`absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br ${currentTheme.gradient} opacity-30 rounded-full blur-3xl`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeText} font-medium text-sm border ${currentTheme.badgeBorder}`}
              >
                👋 Welcome to my portfolio
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hi, I&apos;m <br className="hidden sm:block" />
                <span
                  className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  Emmanuel Obiora
                </span>
              </motion.h1>

              <motion.p
                className={`text-2xl sm:text-3xl font-semibold ${
                  isDarkMode ? 'text-neutral-300' : 'text-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Full-Stack Developer & UI/UX Enthusiast
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              className={`text-lg leading-relaxed max-w-xl ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              I craft beautiful, functional web experiences that solve real
              problems. Specializing in React, TypeScript, and modern web
              technologies to build scalable applications that users love.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a
                href={isHomePage ? '#projects' : '/#projects'}
                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium hover:${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                View My Work
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/Emmanuel-Obiora-Resume.pdf"
                download="Emmanuel-Obiora-Resume.pdf"
                className={`inline-flex items-center gap-2 px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#121212] border-neutral-800 text-white hover:border-neutral-700 hover:bg-[#1a1a1a]'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Download className="w-5 h-5" />
                Download CV
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a
                href="https://github.com/obiora198"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#121212] text-neutral-300 hover:bg-[#1a1a1a] hover:text-white border border-neutral-800/80'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#121212] text-neutral-300 hover:bg-[#1a1a1a] hover:text-white border border-neutral-800/80'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:emmanuelobiora11@gmail.com"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#121212] text-neutral-300 hover:bg-[#1a1a1a] hover:text-white border border-neutral-800/80'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Image/Visual */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative max-w-md lg:max-w-xl mx-auto w-full flex items-center justify-center">
              {/* Primary Animated Glowing Morphing Blob (GPU-Accelerated, Silky-Smooth) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Layer 1: Outer Ambient Glow Aura - Gentle continuous rotation */}
                <motion.div
                  className={`absolute w-[340px] sm:w-[420px] lg:w-[470px] h-[340px] sm:h-[420px] lg:h-[470px] rounded-full bg-gradient-to-tr ${currentTheme.gradient} opacity-50 dark:opacity-40 blur-3xl transition-colors duration-700`}
                  style={{ willChange: 'transform' }}
                  animate={{
                    scale: [1, 1.12, 0.96, 1.08, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    scale: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
                  }}
                />

                {/* Layer 2: Main Clockwise Organic Morphing Blob */}
                <motion.div
                  className={`w-[290px] sm:w-[360px] lg:w-[400px] h-[310px] sm:h-[380px] lg:h-[430px] bg-gradient-to-br ${currentTheme.buttonGradient} opacity-75 dark:opacity-65 blur-xl shadow-2xl transition-colors duration-700`}
                  style={{
                    borderRadius: '62% 38% 70% 30% / 45% 65% 35% 55%',
                    willChange: 'transform',
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.06, 0.95, 1.04, 1],
                  }}
                  transition={{
                    rotate: { duration: 16, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                  }}
                />

                {/* Layer 3: Counter-Rotating Organic Blob for dynamic liquid morphing effect */}
                <motion.div
                  className={`absolute w-[270px] sm:w-[340px] lg:w-[380px] h-[290px] sm:h-[360px] lg:h-[410px] bg-gradient-to-tr ${currentTheme.gradient} opacity-65 dark:opacity-55 blur-xl transition-colors duration-700`}
                  style={{
                    borderRadius: '35% 65% 42% 58% / 58% 38% 62% 42%',
                    willChange: 'transform',
                  }}
                  animate={{
                    rotate: [360, 0],
                    scale: [0.96, 1.05, 1, 0.94, 0.96],
                  }}
                  transition={{
                    rotate: { duration: 22, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
                  }}
                />

                {/* Layer 4: Inner High-Intensity Core Glow - Gentle breathing pulse */}
                <motion.div
                  className={`absolute w-[180px] sm:w-[240px] h-[180px] sm:h-[240px] rounded-full bg-gradient-to-r ${currentTheme.gradient} opacity-65 dark:opacity-55 blur-2xl transition-colors duration-700`}
                  style={{ willChange: 'transform' }}
                  animate={{
                    scale: [0.9, 1.12, 0.9],
                    opacity: [0.55, 0.75, 0.55],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {/* Transparent Hero Image Container - Rounded bottom matching the radius of the primary glowing circle */}
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[440px] aspect-[842/1264] mx-auto z-10 flex items-end justify-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
                <div className="relative w-full h-full rounded-b-full overflow-hidden">
                  {heroThemeImages.map((item) => {
                    const isActive = activeKey === item.key
                    return (
                      <div
                        key={item.key}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          isActive
                            ? 'opacity-100 z-10'
                            : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 440px"
                          className="object-contain object-bottom"
                          priority
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                className={`absolute -bottom-6 -left-6 rounded-2xl shadow-2xl p-4 border backdrop-blur-md z-20 ${
                  isDarkMode
                    ? 'bg-[#0c0c0e]/95 border-neutral-800/80 shadow-black/50'
                    : 'bg-white border-gray-100'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentTheme.iconBg} flex items-center justify-center text-white font-bold text-lg`}
                  >
                    2+
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Years
                    </p>
                    <p
                      className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}
                    >
                      Experience
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={`absolute -top-6 -right-6 rounded-2xl shadow-2xl p-4 border backdrop-blur-md z-20 ${
                  isDarkMode
                    ? 'bg-[#0c0c0e]/95 border-neutral-800/80 shadow-black/50'
                    : 'bg-white border-gray-100'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center text-white font-bold text-lg`}
                  >
                    20+
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      Projects
                    </p>
                    <p
                      className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}
                    >
                      Completed
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
