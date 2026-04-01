'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { useTheme } from '@/app/components/ThemeContext'
import 'highlight.js/styles/atom-one-dark.css'

interface MarkdownRendererProps {
  content: string
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-8 mt-12 text-gray-900 dark:text-white leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold mb-6 mt-16 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold mb-4 mt-12 text-gray-900 dark:text-white leading-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700 dark:text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-lg leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-white">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 dark:border-[#FF4E50] pl-6 py-4 my-8 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            return isInline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-[#FF4E50] font-mono text-sm whitespace-nowrap">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
