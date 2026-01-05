import { notFound } from 'next/navigation'
import Nav from '@/app/components/nav/Nav'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { CommentSection } from '../components/CommentSection'
import Image from 'next/image'
import Link from 'next/link'
import { BsClock, BsEye, BsArrowLeft, BsTag } from 'react-icons/bs'
import { Metadata } from 'next'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  views: number
  createdAt: string
  updatedAt: string
}

interface Comment {
  _id: string
  author: string
  content: string
  createdAt: string
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/blog/${slug}`,
      { cache: 'no-store' }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getComments(slug: string): Promise<Comment[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/blog/${slug}/comments`,
      { cache: 'no-store' }
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.comments
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Emmanuel Obiora`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const [post, comments] = await Promise.all([
    getPost(params.slug),
    getComments(params.slug),
  ])

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-300">
      <Nav />

      <article className="pt-24 pb-16">
        {/* Back Button */}
        <div className="px-6 sm:px-16 md:px-24 max-w-4xl mx-auto mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
          >
            <BsArrowLeft />
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="px-6 sm:px-16 md:px-24 max-w-4xl mx-auto mb-12">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold inline-flex items-center gap-1"
                >
                  <BsTag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <BsClock />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <BsEye />
              <span>{post.views} views</span>
            </div>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="px-6 sm:px-16 md:px-24 max-w-5xl mx-auto mb-12">
            <div className="relative h-64 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 sm:px-16 md:px-24 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Comments */}
          <CommentSection postSlug={post.slug} initialComments={comments} />
        </div>
      </article>
    </div>
  )
}
