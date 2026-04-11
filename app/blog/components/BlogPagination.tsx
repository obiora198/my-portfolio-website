'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from '../../components/ThemeContext'

interface BlogPaginationProps {
  page: number
  totalPages: number
  searchParams: any
}

export function BlogPagination({
  page,
  totalPages,
  searchParams,
}: BlogPaginationProps) {
  const { currentTheme, theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Dynamic hover border based on theme primary color
  // currentTheme.primary is something like 'dark:text-orange-400' or 'text-orange-600'
  const hoverBorderClass = currentTheme.primary
    .split(' ')
    .map((cls) => cls.replace('text-', 'hover:border-'))
    .join(' ')

  // Extract relevant search params to persist them during pagination
  const { page: _, ...restParams } = searchParams

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams()
    Object.entries(restParams).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })
    params.set('page', String(pageNumber))
    return `/blog?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-16">
      {page > 1 && (
        <Link
          href={getPageUrl(page - 1)}
          className={`px-6 py-3 border rounded-xl font-medium transition-all duration-200 ${
            isDarkMode
              ? `bg-[#252836] border-gray-700 text-white ${hoverBorderClass}`
              : `bg-white border-gray-300 text-gray-900 ${hoverBorderClass}`
          }`}
        >
          Previous
        </Link>
      )}

      <span
        className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${currentTheme.buttonGradient}`}
      >
        {page} / {totalPages}
      </span>

      {page < totalPages && (
        <Link
          href={getPageUrl(page + 1)}
          className={`px-6 py-3 border rounded-xl font-medium transition-all duration-200 ${
            isDarkMode
              ? `bg-[#252836] border-gray-700 text-white ${hoverBorderClass}`
              : `bg-white border-gray-300 text-gray-900 ${hoverBorderClass}`
          }`}
        >
          Next
        </Link>
      )}
    </div>
  )
}
