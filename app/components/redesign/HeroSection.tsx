'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '../ThemeContext'

export function HeroSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <section
      id="home"
      className={`relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-20 overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
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

      <div className="relative max-w-7xl mx-auto">
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
                className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${currentTheme.badgeBg} text-${currentTheme.badgeText} font-medium text-sm border border-${currentTheme.badgeBorder}`}
              >
                👋 Welcome to my portfolio
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                className={`text-5xl sm:text-6xl lg:text-7xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hi, I'm{' '}
                <span
                  className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                >
                  Emmanuel Obiora
                </span>
              </motion.h1>

              <motion.p
                className={`text-2xl sm:text-3xl font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
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
              className={`text-lg leading-relaxed max-w-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
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
                href="#projects"
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
                    ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
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
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
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
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:emmanuelobiora11@gmail.com"
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
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
            <div className="relative max-w-md mx-auto">
              {/* Decorative Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.iconBg} rounded-3xl transform rotate-6`}
              />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero-photo.jpg"
                  alt="Emmanuel Obiora - Full-Stack Developer"
                  width={500}
                  height={650}
                  className="w-full h-auto max-h-[500px] md:max-h-[600px] lg:max-h-[650px] object-cover object-center"
                  priority
                />
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                className={`absolute -bottom-6 -left-6 rounded-2xl shadow-xl p-4 border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700'
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
                      className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Experience
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className={`absolute -top-6 -right-6 rounded-2xl shadow-xl p-4 border ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700'
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
                      className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
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
