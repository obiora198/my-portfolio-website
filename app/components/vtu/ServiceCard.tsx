'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  buttonText: string
  buttonColor: 'blue' | 'magenta' | 'orange' | 'green' | 'purple' | 'red'
  index: number
  onClick?: () => void
}

const colorVariants = {
  blue: {
    iconBg: 'from-blue-500 to-blue-600',
    button: 'from-blue-500 to-blue-600 hover:shadow-blue-500/50',
  },
  magenta: {
    iconBg: 'from-pink-500 to-purple-600',
    button: 'from-pink-500 to-purple-600 hover:shadow-pink-500/50',
  },
  orange: {
    iconBg: 'from-orange-500 to-orange-600',
    button: 'from-orange-500 to-orange-600 hover:shadow-orange-500/50',
  },
  green: {
    iconBg: 'from-green-500 to-green-600',
    button: 'from-green-500 to-green-600 hover:shadow-green-500/50',
  },
  purple: {
    iconBg: 'from-purple-500 to-purple-600',
    button: 'from-purple-500 to-purple-600 hover:shadow-purple-500/50',
  },
  red: {
    iconBg: 'from-red-500 to-red-600',
    button: 'from-red-500 to-red-600 hover:shadow-red-500/50',
  },
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonColor,
  index,
  onClick,
}: ServiceCardProps) {
  const colors = colorVariants[buttonColor]

  return (
    <motion.div
      className="bg-[#252836] rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="mb-6">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>

        {/* CTA Button */}
        <button
          className={`w-full px-6 py-3 bg-gradient-to-r ${colors.button} text-white rounded-xl font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  )
}
