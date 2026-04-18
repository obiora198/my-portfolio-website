'use client'

import { motion } from 'framer-motion'
import { Smartphone, Wifi, Tv, Zap, Globe, CreditCard, ArrowUpRight } from 'lucide-react'
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
      description: 'Recharge any network instantly with the best rates available',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'data',
      icon: Wifi,
      title: 'Data Bundles',
      description: 'Get affordable data plans for all major networks',
      gradient: currentTheme.buttonGradient,
    },
    {
      id: 'cable-tv',
      icon: Tv,
      title: 'Cable TV',
      description: 'Subscribe to DStv, GOtv, Startimes & more',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: 'electricity',
      icon: Zap,
      title: 'Electricity',
      description: 'Pay your electricity bills quickly and securely',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'international',
      icon: Globe,
      title: 'International Airtime',
      description: 'Top up any country worldwide with ease',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      id: 'wallet',
      icon: CreditCard,
      title: 'Fund Wallet',
      description: 'Add money to your wallet for faster transactions',
      gradient: currentTheme.buttonGradient,
    },
  ]

  return (
    <section
      className={`py-24 px-6 sm:px-8 lg:px-12 transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
    >
      {/* Subtle background accent */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] blur-3xl bg-gradient-to-br ${currentTheme.buttonGradient}`}
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
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-block text-sm font-semibold tracking-widest uppercase mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            What We Offer
          </motion.span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Our{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Services
            </span>
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Everything you need for seamless and instant transactions
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.button
                key={service.id}
                onClick={() => onServiceClick(service.id)}
                className={`group relative p-7 rounded-2xl transition-all duration-300 text-left overflow-hidden ${
                  isDarkMode
                    ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12]'
                    : 'bg-white hover:bg-white border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-xl'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300`}
                />

                {/* Top row: Icon + Arrow */}
                <div className="relative flex items-start justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <ArrowUpRight className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3
                    className={`text-lg font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    {service.description}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
