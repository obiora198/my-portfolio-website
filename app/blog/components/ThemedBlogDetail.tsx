'use client'

import { useTheme } from '@/app/components/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Share2, Bookmark, ChevronRight, User } from 'lucide-react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { BlogGallery } from './BlogGallery'
import { motion } from 'framer-motion'

interface ThemedBlogDetailProps {
  post: {
    title: string
    content: string
    coverImage?: string
    author: string
    tags: string[]
    images?: string[]
    liveUrl?: string
    createdAt: string
  }
}

export function ThemedBlogDetail({ post }: ThemedBlogDetailProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Hero Section - Focused & Premium */}
      <header className="relative pt-32 pb-16 px-6 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Category/Tags */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {post.tags?.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className={`text-xs font-bold uppercase tracking-wider ${currentTheme.primary}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 leading-[1.1] text-center tracking-tight">
            {post.title}
          </h1>

          {/* Author & Meta - Centered */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 dark:text-gray-400 border-y border-gray-100 dark:border-gray-800/50 py-8">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
              >
                <User
                  className={`w-6 h-6 ${currentTheme.primary.replace('text-', 'stroke-').includes('stroke-') ? currentTheme.primary : 'text-indigo-500'}`}
                />
              </div>
              <div className="text-left">
                <span className="block font-bold text-gray-900 dark:text-white">
                  {post.author}
                </span>
                <span className="text-sm">
                  Published on {formatDate(post.createdAt)}
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-800" />

            <div className="flex items-center gap-6 text-sm font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {calculateReadTime(post.content)} min read
              </span>
              <div className="flex items-center gap-6">
                <Share2
                  className={`w-4 h-4 cursor-pointer transition-colors hover:opacity-70 ${currentTheme.primary}`}
                />
                <Bookmark
                  className={`w-4 h-4 cursor-pointer transition-colors hover:opacity-70 ${currentTheme.primary}`}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image - Wide but constrained */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        {post.coverImage && (
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        )}
      </section>

      {/* Main Content - Centered Reading Experience */}
      <main className="max-w-3xl mx-auto px-6 pb-32">
        <div className="w-full mb-20">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Gallery Section */}
        {post.images && post.images.length > 0 && (
          <div className="pt-8 mb-16">
            <BlogGallery images={post.images} />
          </div>
        )}

        {/* Visit Website Button - New Section */}
        {post.liveUrl && (
          <div className="flex justify-center mt-12 mb-16">
            <motion.a
              href={post.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-bold text-lg hover:${currentTheme.buttonHover} transition-all duration-300 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105`}
              whileTap={{ scale: 0.95 }}
            >
              Visit Live Website
              <ChevronRight className="w-5 h-5" />
            </motion.a>
          </div>
        )}

        <div className="mt-32 pt-16 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-10 text-center">
          <p className="text-gray-500 dark:text-gray-400 italic max-w-xl text-lg leading-relaxed">
            &quot;Thanks for reading! If you enjoyed this journey into{' '}
            {post.title.split('—')[0].trim()}, feel free to explore more of my
            technical case studies.&quot;
          </p>
          <Link
            href="/blog"
            className={`group flex items-center gap-3 px-10 py-5 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]`}
          >
            <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
        </div>
      </main>
    </div>
  )
}
