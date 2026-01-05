'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BsClock, BsEye, BsTag } from 'react-icons/bs'

interface BlogCardProps {
  post: {
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
  index?: number
}

export const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 overflow-hidden">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BsTag className="text-6xl text-indigo-300 dark:text-indigo-700" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BsClock size={12} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <BsEye size={12} />
                <span>{post.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
