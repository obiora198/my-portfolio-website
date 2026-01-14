'use client'

import { motion } from 'framer-motion'
import {
  Smartphone,
  Wifi,
  Zap,
  Shield,
  TrendingUp,
  Headphones,
} from 'lucide-react'
import { useTheme } from '../ThemeContext'

const services = [
  {
    icon: Smartphone,
    title: 'Airtime Top-Up',
    description:
      'Instant airtime recharge for all major networks at competitive rates.',
    features: ['All Networks', 'Instant Delivery', '24/7 Available'],
  },
  {
    icon: Wifi,
    title: 'Data Bundles',
    description:
      'Affordable data plans for MTN, Glo, Airtel, and 9Mobile networks.',
    features: ['Cheap Rates', 'Auto Delivery', 'Multiple Plans'],
  },
  {
    icon: Zap,
    title: 'Electricity Bills',
    description: 'Pay your electricity bills quickly and conveniently online.',
    features: ['All DISCOs', 'Instant Token', 'Secure Payment'],
  },
  {
    icon: TrendingUp,
    title: 'Cable TV Subscription',
    description: 'Subscribe to DSTV, GOTV, and Startimes packages hassle-free.',
    features: ['All Packages', 'Auto Renewal', 'Best Prices'],
  },
]

const features = [
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Your transactions are protected with bank-level security',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Get your services delivered within seconds',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our support team is always ready to help you',
  },
]

export function VTUSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <section
      id="vtu"
      className={`py-20 px-6 sm:px-8 lg:px-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
          >
            VTU Services
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Fast, reliable, and affordable virtual top-up services
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`rounded-2xl p-6 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-900 hover:bg-gray-850 border border-gray-700'
                  : 'bg-white hover:shadow-xl border border-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentTheme.iconBg} text-white flex items-center justify-center mb-4`}
              >
                <service.icon className="w-7 h-7" />
              </div>

              <h3
                className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {service.title}
              </h3>

              <p
                className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {service.description}
              </p>

              <div className="space-y-2">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${currentTheme.gradient}`}
                    />
                    <span
                      className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`flex flex-col items-center text-center p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentTheme.badgeBg} border-2 border-${currentTheme.badgeBorder} flex items-center justify-center mb-4`}
              >
                <feature.icon
                  className={`w-8 h-8 text-${currentTheme.primary}`}
                />
              </div>
              <h4
                className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {feature.title}
              </h4>
              <p
                className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="#contact"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium hover:${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            <Zap className="w-5 h-5" />
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}
