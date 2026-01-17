'use client'

import { useEffect, useState } from 'react'
import { BlogHero } from '../components/blog/BlogHero'
import { BlogCard, BlogCardSkeleton } from '../components/blog/BlogCard'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Navigation } from '../components/redesign/Navigation'
import { ThemeSwitcher } from '../components/redesign/ThemeSwitcher'
import { useTheme } from '../components/ThemeContext'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  views: number
  createdAt: string
  readTime?: string
  category?: string
}

export default function BlogPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedFilter])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6',
      })

      if (searchQuery) params.append('search', searchQuery)
      if (selectedFilter !== 'All') params.append('tag', selectedFilter)

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        toast.error('Failed to load posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  // Filter posts based on search query (client-side)
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Calculate read time if not provided (rough estimate: 200 words per minute)
  const getReadTime = (post: Post) => {
    if (post.readTime) return post.readTime
    const words = post.excerpt.split(' ').length
    const minutes = Math.ceil(words / 50) // Rough estimate from excerpt
    return `${minutes} min`
  }

  // Get category from tags if not provided
  const getCategory = (post: Post) => {
    if (post.category) return post.category
    return post.tags[0] || 'Article'
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1d29]' : 'bg-gray-50'}`}
    >
      {/* Navigation and Theme Switcher - Always visible */}
      <Navigation />
      <ThemeSwitcher />

      {/* Hero Section with Search and Filters - Always visible */}
      <BlogHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Blog Posts Grid */}
      <section
        className={`py-16 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p
                className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                No posts found. Try adjusting your search or filters.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    description={post.excerpt}
                    image={post.coverImage || '/blog-placeholder.jpg'}
                    category={getCategory(post)}
                    date={formatDate(post.createdAt)}
                    readTime={getReadTime(post)}
                    tags={post.tags.slice(0, 3)}
                    slug={post.slug}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-3 mt-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-6 py-3 border rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isDarkMode ? 'bg-[#252836] border-gray-700 text-white hover:border-[#FF4E50]' : 'bg-white border-gray-300 text-gray-900 hover:border-indigo-500'}`}
                  >
                    Previous
                  </button>
                  <span
                    className={`px-6 py-3 rounded-xl font-bold bg-gradient-to-r ${currentTheme.buttonGradient} text-white`}
                  >
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-6 py-3 border rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${isDarkMode ? 'bg-[#252836] border-gray-700 text-white hover:border-[#FF4E50]' : 'bg-white border-gray-300 text-gray-900 hover:border-indigo-500'}`}
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
