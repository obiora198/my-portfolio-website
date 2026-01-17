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
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div
      className={`prose prose-lg max-w-none ${
        isDarkMode
          ? 'prose-invert prose-headings:text-white prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-700 prose-h2:pb-3 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-white prose-strong:font-semibold prose-em:text-gray-200 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:text-gray-300 prose-li:mb-2 prose-ol:list-decimal prose-ol:pl-6 prose-code:text-orange-400 prose-code:bg-[#1a1d29] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:!bg-[#1a1d29] prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-6 prose-pre:overflow-x-auto prose-pre:shadow-xl prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-[#1C1E2E] prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-400 prose-a:text-orange-400 prose-a:font-medium prose-a:no-underline hover:prose-a:text-orange-300 hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8 prose-hr:border-gray-700 prose-hr:my-12'
          : 'prose-headings:text-gray-900 prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-600 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:text-gray-700 prose-li:mb-2 prose-ol:list-decimal prose-ol:pl-6 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:!bg-gray-900 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-6 prose-pre:overflow-x-auto prose-pre:shadow-xl prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-a:text-indigo-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-indigo-700 hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8 prose-hr:border-gray-200 prose-hr:my-12'
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code: ({ node, inline, className, children, ...props }) => {
            if (!inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
