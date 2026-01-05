'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BsCheckCircleFill } from 'react-icons/bs'
import toast from 'react-hot-toast'

interface Comment {
  _id: string
  author: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  postSlug: string
  initialComments: Comment[]
}

export const CommentSection = ({
  postSlug,
  initialComments,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [author, setAuthor] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/blog/${postSlug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, email, content }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        setAuthor('')
        setEmail('')
        setContent('')
        toast.success('Comment submitted! It will appear after moderation.')
      } else {
        toast.error(data.error || 'Failed to submit comment')
      }
    } catch (error) {
      toast.error('Failed to submit comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 space-y-8">
      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {comment.author}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Leave a Comment
        </h3>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              <BsCheckCircleFill className="text-6xl text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Thank you!
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Your comment has been submitted and is awaiting moderation.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Submit another comment
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Comment *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={5}
                  maxLength={1000}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  placeholder="Share your thoughts..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  {content.length}/1000 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Comment'}
              </button>

              <p className="text-xs text-slate-500 mt-2">
                Your email will not be published. All comments are moderated.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
