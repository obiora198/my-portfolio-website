'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Code } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '../ThemeContext'

interface ProjectCardProps {
  title: string
  description: string
  techStack: string
  imageUrl: string
  liveUrl: string
  codeUrl: string
}

export function ProjectCard({
  title,
  description,
  techStack,
  imageUrl,
  liveUrl,
  codeUrl,
}: ProjectCardProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <motion.div
      className={`group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-video bg-gray-100">
        <Image
          src={imageUrl}
          alt={title}
          width={600}
          height={400}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3
          className={`text-xl font-semibold transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h3>

        {/* Tech Stack Badge */}
        <div className="inline-block">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentTheme.badgeBg} text-${currentTheme.badgeText} border border-${currentTheme.badgeBorder}`}
          >
            {techStack}
          </span>
        </div>

        {/* Description */}
        <p
          className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium text-sm hover:${currentTheme.buttonHover} transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
          <a
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </a>
        </div>
      </div>
    </motion.div>
  )
}
