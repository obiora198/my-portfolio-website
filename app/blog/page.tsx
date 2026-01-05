'use client'

import { useEffect, useState } from 'react'
import Nav from '../components/nav/Nav'
import { BlogCard } from './components/BlogCard'
import { motion } from 'framer-motion'
import { BsSearch } from 'react-icons/bs'
import toast from 'react-hot-toast'

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
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedTag])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      })

      if (search) params.append('search', search)
      if (selectedTag) params.append('tag', selectedTag)

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
        setTotalPages(data.pagination.pages)

        // Extract unique tags
        const tags = new Set<string>()
        data.posts.forEach((post: Post) => {
          post.tags.forEach((tag) => tags.add(tag))
        })
        setAllTags(Array.from(tags))
      } else {
        toast.error('Failed to load posts')
      }
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
      <Nav />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 sm:px-16 md:px-24 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Blog &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development, design, and
            technology.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </form>
        </motion.div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="px-6 sm:px-16 md:px-24 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setSelectedTag('')
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedTag === ''
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                All Posts
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag)
                    setPage(1)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="px-6 sm:px-16 md:px-24 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse"
                >
                  <div className="h-48 bg-slate-200 dark:bg-slate-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-slate-500 dark:text-slate-400">
                No posts found. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <BlogCard key={post._id} post={post} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold disabled:opacity-50 hover:border-indigo-300 transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold disabled:opacity-50 hover:border-indigo-300 transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
