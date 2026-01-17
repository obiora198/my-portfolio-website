'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Check, Headphones, Shield } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface VTUHeroProps {
  onGetStarted?: () => void
}

export function VTUHero({ onGetStarted }: VTUHeroProps) {
  const trustBadges = [
    { icon: Check, text: 'Instant Delivery' },
    { icon: Headphones, text: '24/7 Support' },
    { icon: Shield, text: 'Secure Payments' },
  ]

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted()
    } else {
      // Scroll to services form
      const element = document.getElementById('services-form')
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#1a1d29]">
      <div className="max-w-7xl mx-auto">
        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#FF6B35] hover:text-[#F7931E] transition-colors duration-200 mb-12"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                  Fast & Reliable
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                  VTU Services
                </span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed">
                Buy airtime, data, pay bills instantly with our secure and
                reliable platform.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] flex items-center justify-center flex-shrink-0">
                    <badge.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-300 font-medium">
                    {badge.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative max-w-md mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/20 to-[#F7931E]/20 rounded-3xl blur-3xl" />

              {/* Phone Mockup Image */}
              <div className="relative rounded-3xl overflow-hidden">
                <Image
                  src="/vtu-phone-mockup.png"
                  alt="VTU Services Mobile App"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
