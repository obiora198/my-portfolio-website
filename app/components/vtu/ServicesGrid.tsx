'use client'

import { motion } from 'framer-motion'
import { Smartphone, Wifi, Tv, Zap, Globe, CreditCard } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'

interface ServicesGridProps {
  onServiceClick: (service: string) => void
}

export function ServicesGrid({ onServiceClick }: ServicesGridProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const services = [
    {
      id: 'airtime',
      icon: Smartphone,
      title: 'Airtime Top-up',
      description: 'Recharge any network instantly',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'data',
      icon: Wifi,
      title: 'Data Bundles',
      description: 'Get affordable data plans',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'cable-tv',
      icon: Tv,
      title: 'Cable TV',
      description: 'Subscribe to DStv, GOtv & more',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 'electricity',
      icon: Zap,
      title: 'Electricity',
      description: 'Pay your electricity bills',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'international',
      icon: Globe,
      title: 'International Airtime',
      description: 'Top up any country worldwide',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      id: 'wallet',
      icon: CreditCard,
      title: 'Fund Wallet',
      description: 'Add money to your wallet',
      gradient: 'from-indigo-500 to-purple-500',
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
            Our{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Services
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Everything you need for seamless and instant transactions
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.button
                key={service.id}
                onClick={() => onServiceClick(service.id)}
                className={`group relative p-6 sm:p-8 rounded-2xl transition-all duration-300 text-left overflow-hidden ${
                  isDarkMode
                    ? 'bg-[#1C1E2E] hover:bg-[#252836] border border-gray-800 hover:border-gray-700'
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`relative w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${service.gradient} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3
                    className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {service.description}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
