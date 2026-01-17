'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Headphones, CreditCard } from 'lucide-react'

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Bank-level security and encryption',
    },
    {
      icon: Zap,
      title: 'Instant Delivery',
      description: 'Transactions completed in seconds',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to support you',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payments',
      description: 'Card, transfer, or digital wallets',
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
            Why Choose Us
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-[#252836] rounded-2xl p-6 border border-gray-700 hover:border-[#FF6B35] transition-all duration-300 group text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
