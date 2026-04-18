'use client'

import { motion } from 'framer-motion'
import { Shield, TrendingUp, Clock, Headphones } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'

export function WhyChooseUs() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-level encryption protects every transaction you make',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive rates that save you money on every purchase',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Instant Delivery',
      description: 'Services delivered in seconds, not minutes',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock assistance whenever you need help',
      gradient: currentTheme.buttonGradient,
    },
  ]

  return (
    <section
      className={`py-24 px-6 sm:px-8 lg:px-12 transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
    >
      {/* Background accent */}
      <div
        className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl bg-gradient-to-br ${currentTheme.buttonGradient}`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className={`inline-block text-sm font-semibold tracking-widest uppercase mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            Our Advantages
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Why Choose{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Us?
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            We provide the best VTU services with unmatched reliability
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className={`group relative p-7 rounded-2xl transition-all duration-300 overflow-hidden ${
                  isDarkMode
                    ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]'
                    : 'bg-white border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-lg'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
              >
                {/* Hover gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`relative w-12 h-12 rounded-xl mb-5 flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3
                    className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
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
