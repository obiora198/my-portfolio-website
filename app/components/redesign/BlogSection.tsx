'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../ThemeContext'
import { useEffect, useState } from 'react'
import fetchBlogs from '../../lib/fetchBlogs'
import { useQuery } from '@tanstack/react-query'

// Blog type based on the API response
interface BlogType {
  _id: string
  title: string
  excerpt: string
  slug: string
  coverImage?: string
  createdAt: string
  tags: string[]
}

// Skeleton component for blog loading state
function BlogCardSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-700">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>
        <div className="h-6 bg-gray-700 rounded w-3/4 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>
          <div className="h-4 bg-gray-700 rounded w-5/6 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlogSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const { data, isLoading: loading } = useQuery({
    queryKey: ['blogs', 3],
    queryFn: () => fetchBlogs(3),
    staleTime: 5 * 60 * 1000,
  })

  const blogs = data?.posts || []

  return (
    <section
      id="blog"
      className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
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
          {loading ? (
            [...Array(3)].map((_, i) => (
              <BlogCardSkeleton key={i} isDarkMode={isDarkMode} />
            ))
          ) : blogs.length > 0 ? (
            blogs.map((post: BlogType, index: number) => (
              <motion.article
                key={post._id}
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
                {/* Image Placeholder or Cover Image */}
                <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-orange-600 via-rose-600 to-pink-600">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentTheme.badgeBg} text-${currentTheme.badgeText} border border-${currentTheme.badgeBorder}`}
                  >
                    {post.tags?.[0] || 'Article'}
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
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.ceil(post.excerpt.length / 200) + 1} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl font-semibold line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p
                    className={`text-sm leading-relaxed line-clamp-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`inline-flex items-center gap-2 text-sm font-medium ${currentTheme.primary} hover:gap-3 transition-all duration-200`}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                No blog posts found.
              </p>
            </div>
          )}
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
