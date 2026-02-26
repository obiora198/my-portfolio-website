import { getBlogBySlug } from '@/lib/blog'
import { Navigation } from '@/app/components/redesign/Navigation'
import { ThemeSwitcher } from '@/app/components/redesign/ThemeSwitcher'
import { Calendar, Clock, Share2, Bookmark, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { notFound } from 'next/navigation'

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogBySlug(params.slug)

  if (!post) {
    notFound()
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D17] transition-colors duration-300">
      <Navigation />
      <ThemeSwitcher />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <Link
            href="/blog"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Blog
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          <span className="text-gray-900 dark:text-white">{post.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex items-end justify-center px-6 pb-16">
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-700 dark:bg-[#1C1E2E] dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Back to Blog */}
            <div className="mt-12 flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 dark:bg-[#FF4E50] text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                ← Back to all articles
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 p-6 rounded-2xl bg-white border border-gray-200 dark:bg-[#1C1E2E] dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <div className="text-indigo-600 dark:text-gray-400 font-bold">
                    {post.author?.[0] || 'A'}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {post.author}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {calculateReadTime(post.content)} min
                </span>
                <span className="flex items-center gap-1">
                  {post.views || 0} views
                </span>
              </div>

              <div className="h-px mb-6 bg-gray-200 dark:bg-gray-700" />

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 dark:bg-[#252836] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2f3241] transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 dark:bg-[#252836] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#2f3241] transition-all">
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
