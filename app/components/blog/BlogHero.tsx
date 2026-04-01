'use client'

import { motion } from 'framer-motion'
import { Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '../ThemeContext'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const filters = ['All', 'React', 'TypeScript', 'CSS', 'Node.js']

export function BlogHero() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  )
  const selectedFilter = searchParams.get('tag') || 'All'

  // Debounce search updates to the URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchValue) {
        params.set('search', searchValue)
      } else {
        params.delete('search')
      }
      params.set('page', '1') // Reset page on search
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue, pathname, router, searchParams])

  const handleFilterClick = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (filter === 'All') {
      params.delete('tag')
    } else {
      params.set('tag', filter)
    }
    params.set('page', '1') // Reset page on filter change
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <section
      className={`py-20 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className={`inline-flex items-center gap-2 transition-colors duration-200 mb-12 ${isDarkMode ? 'text-[#FF4E50] hover:text-[#F9D423]' : currentTheme.primary + ' hover:opacity-80'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
          >
            Blog & Insights
          </h1>
          <p
            className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Thoughts on web development, tech trends, and my learning journey
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search articles..."
              className={`w-full pl-12 pr-4 py-4 border rounded-full focus:outline-none focus:ring-2 transition-colors duration-200 ${isDarkMode ? 'bg-[#252836] border-gray-700 text-white placeholder-gray-500 focus:ring-indigo-500/50' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'}`}
            />
          </div>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedFilter === filter
                  ? `bg-gradient-to-r ${currentTheme.buttonGradient} text-white shadow-lg`
                  : isDarkMode
                    ? 'bg-[#252836] text-gray-300 hover:bg-[#2f3241] border border-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
