import { getBlogs } from '@/lib/blog'
import { BlogHero } from '../components/blog/BlogHero'
import { BlogCard } from '../components/blog/BlogCard'
import { Navigation } from '../components/redesign/Navigation'
import { ThemeSwitcher } from '../components/redesign/ThemeSwitcher'
import Link from 'next/link'
import { Suspense } from 'react'

interface BlogPageProps {
  searchParams: {
    page?: string
    tag?: string
    search?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1')
  const tag = searchParams.tag || 'All'
  const search = searchParams.search || ''

  const { posts, pagination } = await getBlogs({
    page,
    limit: 6,
    tag,
    search,
  })

  const { totalPages = 1 } = pagination

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Get read time estimate
  const getReadTime = (excerpt: string) => {
    const words = excerpt.split(' ').length
    const minutes = Math.ceil(words / 50)
    return `${minutes} min`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d29] transition-colors duration-300">
      <Navigation />
      <ThemeSwitcher />

      <Suspense
        fallback={
          <div className="h-[400px] animate-pulse bg-gray-200 dark:bg-gray-800" />
        }
      >
        <BlogHero />
      </Suspense>

      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No posts found. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post: any) => (
                  <BlogCard
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    description={post.excerpt}
                    image={post.coverImage || '/blog-placeholder.jpg'}
                    category={post.tags?.[0] || 'Article'}
                    date={formatDate(post.createdAt)}
                    readTime={getReadTime(post.excerpt)}
                    tags={post.tags?.slice(0, 3) || []}
                    slug={post.slug}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-16">
                  {page > 1 && (
                    <Link
                      href={{
                        pathname: '/blog',
                        query: { ...searchParams, page: page - 1 },
                      }}
                      className="px-6 py-3 border rounded-xl font-medium bg-white dark:bg-[#252836] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-indigo-500 dark:hover:border-[#FF4E50] transition-all"
                    >
                      Previous
                    </Link>
                  )}

                  <span className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-[#FF4E50] dark:to-[#F9D423] text-white">
                    {page} / {totalPages}
                  </span>

                  {page < totalPages && (
                    <Link
                      href={{
                        pathname: '/blog',
                        query: { ...searchParams, page: page + 1 },
                      }}
                      className="px-6 py-3 border rounded-xl font-medium bg-white dark:bg-[#252836] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-indigo-500 dark:hover:border-[#FF4E50] transition-all"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
