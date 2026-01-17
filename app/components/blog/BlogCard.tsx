'use client'

import { motion } from 'framer-motion'
import { Clock, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../ThemeContext'

interface BlogCardProps {
  id: string
  title: string
  description: string
  image: string
  category: string
  date: string
  readTime: string
  tags: string[]
  slug: string
}

export function BlogCard({
  title,
  description,
  image,
  category,
  date,
  readTime,
  tags,
  slug,
}: BlogCardProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/blog/${slug}`} className="block">
        <div
          className={`rounded-2xl overflow-hidden border transition-all duration-300 shadow-lg hover:shadow-2xl ${isDarkMode ? 'bg-[#252836] border-gray-700 hover:border-[#FF4E50]' : 'bg-white border-gray-200 hover:border-' + currentTheme.primary.replace('text-', '')}`}
        >
          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-1.5 bg-white text-gray-900 text-sm font-medium rounded-full">
                {category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Metadata */}
            <div
              className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readTime} read</span>
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-xl font-bold transition-colors duration-200 line-clamp-2 ${isDarkMode ? 'text-white group-hover:text-[#FF4E50]' : 'text-gray-900 group-hover:' + currentTheme.primary}`}
            >
              {title}
            </h3>

            {/* Description */}
            <p
              className={`line-clamp-3 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 border text-xs rounded-full ${isDarkMode ? 'bg-[#1a1d29] border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// Skeleton Loading Component
export function BlogCardSkeleton() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div
      className={`rounded-2xl overflow-hidden border animate-pulse ${isDarkMode ? 'bg-[#252836] border-gray-700' : 'bg-white border-gray-200'}`}
    >
      {/* Image Skeleton */}
      <div
        className={`aspect-video ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
      />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Metadata Skeleton */}
        <div className="flex gap-4">
          <div
            className={`h-4 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          <div
            className={`h-4 w-20 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div
            className={`h-6 rounded w-3/4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          <div
            className={`h-6 rounded w-1/2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div
            className={`h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          <div
            className={`h-4 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          <div
            className={`h-4 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 pt-2">
          <div
            className={`h-6 w-16 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          <div
            className={`h-6 w-20 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          <div
            className={`h-6 w-24 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
        </div>
      </div>
    </div>
  )
}
