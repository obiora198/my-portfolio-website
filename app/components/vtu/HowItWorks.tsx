'use client'

import { motion } from 'framer-motion'
import { Smartphone, FileText, CreditCard, Check } from 'lucide-react'

export function HowItWorks() {
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
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#1a1d29]">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            How It Works
          </h2>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] -translate-y-1/2" />

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
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-500/50">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-[#252836] border-2 border-gray-700 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
