'use client'

import { motion } from 'framer-motion'
import { Smartphone, Wifi, Zap, Tv, GraduationCap, Globe } from 'lucide-react'
import { ServiceCard } from './ServiceCard'

interface ServicesGridProps {
  onServiceClick?: (service: string) => void
}

export function ServicesGrid({ onServiceClick }: ServicesGridProps) {
  const services = [
    {
      icon: Smartphone,
      title: 'Airtime Top-Up',
      description: 'Instant airtime for all networks',
      buttonText: 'Buy Now',
      buttonColor: 'blue' as const,
      serviceId: 'airtime',
    },
    {
      icon: Wifi,
      title: 'Data Bundles',
      description: 'Affordable data for all networks',
      buttonText: 'Buy Now',
      buttonColor: 'magenta' as const,
      serviceId: 'data',
    },
    {
      icon: Zap,
      title: 'Electricity Bills',
      description: 'Pay your electricity bills instantly',
      buttonText: 'Pay Now',
      buttonColor: 'orange' as const,
      serviceId: 'electricity',
    },
    {
      icon: Tv,
      title: 'Cable TV',
      description: 'Subscribe to DSTV, GOTV, Startimes',
      buttonText: 'Buy Now',
      buttonColor: 'green' as const,
      serviceId: 'cabletv',
    },
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'WAEC, JAMB, NECO exam pins',
      buttonText: 'Buy Now',
      buttonColor: 'purple' as const,
      serviceId: 'education',
    },
    {
      icon: Globe,
      title: 'International',
      description: 'International airtime',
      buttonText: 'Buy Now',
      buttonColor: 'red' as const,
      serviceId: 'international',
    },
  ]

  const handleServiceClick = (serviceId: string) => {
    if (onServiceClick) {
      onServiceClick(serviceId)
    }
    // Scroll to services form
    const element = document.getElementById('services-form')
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
            Our Services
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              index={index}
              onClick={() => handleServiceClick(service.serviceId)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
