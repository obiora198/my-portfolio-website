'use client'

import { motion } from 'framer-motion'
import { Smartphone, FileText, CreditCard, Check } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'

export function HowItWorks() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const steps = [
    {
      number: 1,
      icon: Smartphone,
      title: 'Select Service',
      description: 'Choose the service you want',
    },
    {
      number: 2,
      icon: FileText,
      title: 'Fill in Details',
      description: 'Enter required information',
    },
    {
      number: 3,
      icon: CreditCard,
      title: 'Make Payment',
      description: 'Complete your order securely',
    },
    {
      number: 4,
      icon: Check,
      title: 'Instant Delivery',
      description: 'Receive your purchase instantly',
    },
  ]

  return (
    <section
      id="how-it-works"
      className={`py-20 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1E2E]' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            How It{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Works
            </span>
          </h2>
          <p
            className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Simple and secure process in just 4 easy steps
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line - Desktop Only */}
          <div
            className={`hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r ${currentTheme.gradientText} -translate-y-1/2 opacity-30`}
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex flex-col items-center text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Number Circle */}
                <div className="relative">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${currentTheme.buttonGradient} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#252836] border-2 border-gray-700' : 'bg-gray-100 border-2 border-gray-200'}`}
                >
                  <step.icon
                    className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3
                    className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {step.title}
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
