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
      description: 'Choose from airtime, data, TV, bills, and more',
    },
    {
      number: 2,
      icon: FileText,
      title: 'Fill in Details',
      description: 'Enter your phone number or account details',
    },
    {
      number: 3,
      icon: CreditCard,
      title: 'Make Payment',
      description: 'Pay securely with your preferred method',
    },
    {
      number: 4,
      icon: Check,
      title: 'Instant Delivery',
      description: 'Receive your purchase in seconds',
    },
  ]

  return (
    <section
      id="how-it-works"
      className={`py-24 px-6 sm:px-8 lg:px-12 transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#0f1120]' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span
            className={`inline-block text-sm font-semibold tracking-widest uppercase mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          >
            Simple Process
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            How It{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Works
            </span>
          </h2>
          <p
            className={`text-lg max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Get started in just 4 simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop Only */}
          <div
            className={`hidden lg:block absolute top-16 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-[2px] ${isDarkMode ? 'bg-white/[0.06]' : 'bg-gray-200'}`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${currentTheme.buttonGradient} opacity-40`}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                >
                  {/* Number + Icon combined */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentTheme.buttonGradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-9 h-9 text-white" />
                    </motion.div>
                    {/* Step number badge */}
                    <div
                      className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-[#0f1120] text-white border-2 border-white/20' : 'bg-white text-gray-900 border-2 border-gray-200 shadow-sm'}`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3
                      className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {step.title}
                    </h3>
                    <p className={`text-sm leading-relaxed max-w-[200px] mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
