'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../ThemeContext'

const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable React Applications',
    excerpt:
      'Learn best practices for architecting large-scale React applications with maintainable code structure and optimal performance.',
    date: 'Jan 10, 2026',
    readTime: '5 min read',
    category: 'React',
    slug: 'building-scalable-react-applications',
  },
  {
    id: 2,
    title: 'TypeScript Tips for Better Code',
    excerpt:
      'Discover advanced TypeScript patterns that will help you write more type-safe and maintainable code in your projects.',
    date: 'Jan 8, 2026',
    readTime: '7 min read',
    category: 'TypeScript',
    slug: 'typescript-tips-for-better-code',
  },
  {
    id: 3,
    title: 'Modern CSS Techniques in 2026',
    excerpt:
      'Explore the latest CSS features and techniques that are revolutionizing web design and development workflows.',
    date: 'Jan 5, 2026',
    readTime: '6 min read',
    category: 'CSS',
    slug: 'modern-css-techniques-2026',
  },
]

export function BlogSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <section
      id="blog"
      className={`py-20 px-6 sm:px-8 lg:px-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
          >
            Latest Blog Posts
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Thoughts, tutorials, and insights on web development
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:shadow-xl border border-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Image Placeholder - replace with actual blog images */}
              <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-orange-600 via-rose-600 to-pink-600">
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentTheme.badgeBg} text-${currentTheme.badgeText} border border-${currentTheme.badgeBorder}`}
                >
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Meta */}
                <div
                  className={`flex items-center gap-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className={`inline-flex items-center gap-2 text-sm font-medium text-${currentTheme.primary} hover:gap-3 transition-all duration-200`}
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/blog"
            className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium hover:${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
