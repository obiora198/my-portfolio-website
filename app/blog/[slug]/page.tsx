'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navigation } from '@/app/components/redesign/Navigation'
import { ThemeSwitcher } from '@/app/components/redesign/ThemeSwitcher'
import { useTheme } from '@/app/components/ThemeContext'
import { motion } from 'framer-motion'
import { Calendar, Clock, Share2, Bookmark, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MarkdownRenderer } from '../components/MarkdownRenderer'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  tags: string[]
  views: number
  createdAt: string
  updatedAt: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      } else {
        console.error('Failed to fetch post')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
      >
        <Navigation />
        <ThemeSwitcher />

        {/* Breadcrumb Skeleton */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-4 w-12 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`}
            />
            <div
              className={`h-4 w-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`}
            />
            <div
              className={`h-4 w-16 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`}
            />
          </div>
        </div>

        {/* Hero Skeleton */}
        <div
          className={`h-[50vh] min-h-[350px] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'} animate-pulse`}
        />

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9 space-y-4">
              <div className="flex gap-2 mb-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-7 w-20 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`}
                  />
                ))}
              </div>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`}
                />
              ))}
            </div>
            <div className="lg:col-span-3">
              <div
                className={`p-6 rounded-2xl ${isDarkMode ? 'bg-[#1C1E2E]' : 'bg-white'}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}
                  />
                  <div className="space-y-2">
                    <div
                      className={`h-4 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}
                    />
                    <div
                      className={`h-3 w-16 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
      >
        <Navigation />
        <ThemeSwitcher />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1
              className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Post Not Found
            </h1>
            <Link
              href="/blog"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isDarkMode ? 'bg-[#1C1E2E] text-white hover:bg-[#252836]' : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200'}`}
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
    >
      <Navigation />
      <ThemeSwitcher />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Home
          </Link>
          <ChevronRight
            className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
          />
          <Link
            href="/blog"
            className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Blog
          </Link>
          <ChevronRight
            className={`w-4 h-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
          />
          <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </span>
        </nav>
      </div>

      {/* Hero Section with Cover Image */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0B0D17]" />

        {/* Title Overlay */}
        <div className="absolute inset-0 flex items-end justify-center px-6 pb-16">
          <motion.div
            className="max-w-4xl w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-9 lg:order-1">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${isDarkMode ? 'bg-[#1C1E2E] text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div
              className={`prose prose-lg max-w-none ${
                isDarkMode
                  ? 'prose-invert prose-headings:text-white prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-white prose-code:text-orange-400 prose-code:bg-[#1a1d29] prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1a1d29] prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-blockquote:border-l-orange-500 prose-blockquote:text-gray-400 prose-a:text-orange-400 prose-a:no-underline hover:prose-a:text-orange-300'
                  : 'prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-blockquote:border-l-indigo-500 prose-blockquote:text-gray-600 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-700'
              }`}
            >
              <div id="introduction" className="scroll-mt-24">
                <MarkdownRenderer content={post.content} />
              </div>
            </div>

            {/* Author Bio */}
            <div
              className={`mt-16 p-8 rounded-2xl ${isDarkMode ? 'bg-[#1C1E2E]' : 'bg-white border border-gray-200'}`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                About {post.author}
              </h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/author-avatar.jpg"
                    alt={post.author}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Full-stack developer passionate about creating scalable web
                    applications and sharing knowledge with the community.
                  </p>
                  <div className="flex gap-3">
                    <button
                      className={`px-6 py-2 rounded-lg font-medium transition-all bg-gradient-to-r ${currentTheme.buttonGradient} text-white hover:opacity-90`}
                    >
                      Follow
                    </button>
                    <button
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${isDarkMode ? 'bg-[#252836] text-white hover:bg-[#2f3241]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                    >
                      More Posts
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-16">
              <h3
                className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Related Articles
              </h3>
              <Link
                href="/blog"
                className={`block p-6 rounded-2xl transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-[#1C1E2E] hover:bg-[#252836]' : 'bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-lg'}`}
              >
                <h4
                  className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  State Management in React: A Complete Guide
                </h4>
                <p
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  10 min read
                </p>
              </Link>
            </div>

            {/* Back to Blog */}
            <div className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
              >
                ← Back to all articles
              </Link>
            </div>
          </div>

          {/* Sidebar - Table of Contents (Right Side) */}
          <aside className="lg:col-span-3 lg:order-2">
            <div
              className={`sticky top-24 p-6 rounded-2xl ${isDarkMode ? 'bg-[#1C1E2E]' : 'bg-white border border-gray-200'}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/author-avatar.jpg"
                    alt={post.author}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4
                    className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {post.author}
                  </h4>
                  <p
                    className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6 text-sm">
                <span
                  className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <Clock className="w-4 h-4" />
                  {calculateReadTime(post.content)} min
                </span>
                <span
                  className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {post.views} views
                </span>
              </div>

              <div
                className={`h-px mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />

              <h3
                className={`text-xs font-bold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Table of Contents
              </h3>
              <nav className="space-y-1">
                <button
                  onClick={() => scrollToSection('introduction')}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-[#252836]' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Introduction
                </button>
                <button
                  onClick={() => scrollToSection('component-architecture')}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-[#252836]' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Component Architecture
                </button>
                <button
                  onClick={() => scrollToSection('state-management')}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-[#252836]' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  State Management
                </button>
                <button
                  onClick={() => scrollToSection('performance')}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-[#252836]' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Performance Optimization
                </button>
                <button
                  onClick={() => scrollToSection('testing')}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg font-medium bg-gradient-to-r ${currentTheme.buttonGradient} text-white`}
                >
                  Testing Strategies
                </button>
              </nav>

              <div
                className={`h-px my-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              />

              <div className="flex gap-2">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-[#252836] text-white hover:bg-[#2f3241]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${isDarkMode ? 'bg-[#252836] text-white hover:bg-[#2f3241]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}
