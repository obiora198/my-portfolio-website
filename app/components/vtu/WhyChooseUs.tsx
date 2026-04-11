'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Shield, TrendingUp, Clock, Headphones } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'

export function WhyChooseUs() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-level security for all your transactions',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive rates on all our services',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Instant Delivery',
      description: 'Get your services delivered in seconds',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance',
      gradient: `bg-gradient-to-br ${currentTheme.iconBg}`,
    },
  ]

  return (
    <section
      className={`py-20 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Why Choose{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Us?
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            We provide the best VTU services with unmatched reliability
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className={`relative p-6 sm:p-8 rounded-2xl transition-all duration-300 overflow-hidden ${
                  isDarkMode
                    ? 'bg-[#1C1E2E] border border-gray-800'
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center ${feature.gradient.startsWith('bg-') ? feature.gradient : `bg-gradient-to-br ${feature.gradient}`}`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div>
                  <h3
                    className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
