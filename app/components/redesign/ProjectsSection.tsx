'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { useTheme } from '../ThemeContext'
import { useEffect, useState, useRef } from 'react'
import { MongoProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// Skeleton component for loading state
function ProjectCardSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      {/* Image skeleton with shimmer */}
      <div className="relative w-full h-48 overflow-hidden">
        <div
          className={`w-full h-full ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] ${
              isDarkMode
                ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent'
                : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
            }`}
          />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div
          className={`h-6 rounded ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
          } w-3/4 relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] ${
              isDarkMode
                ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent'
                : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
            }`}
          />
        </div>

        {/* Description skeletons */}
        <div className="space-y-2">
          <div
            className={`h-4 rounded ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            } w-full relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] ${
                isDarkMode
                  ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
              }`}
            />
          </div>
          <div
            className={`h-4 rounded ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            } w-5/6 relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] ${
                isDarkMode
                  ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
              }`}
            />
          </div>
        </div>

        {/* Tech stack skeleton */}
        <div
          className={`h-4 rounded ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
          } w-2/3 relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] ${
              isDarkMode
                ? 'bg-gradient-to-r from-transparent via-gray-600 to-transparent'
                : 'bg-gradient-to-r from-transparent via-gray-200 to-transparent'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [visibleCount, setVisibleCount] = useState(6)
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6)
    // Small delay to allow new items to render before scrolling
    setTimeout(() => {
      const projectsGrid = document.getElementById('projects-grid')
      if (projectsGrid) {
        const lastItem = projectsGrid.lastElementChild
        if (lastItem) {
          lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      }
    }, 100)
  }

  const handleGoBackUp = () => {
    setVisibleCount(6)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const {
    data: projects = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  const error = queryError ? 'Failed to load projects' : null

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
          >
            Featured Projects
          </h1>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Explore some of my recent work and side projects
          </p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} isDarkMode={isDarkMode} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p
              className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              {error}
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p
              className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              No projects found.
            </p>
          </div>
        ) : (
          <>
            <div
              id="projects-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {projects.slice(0, visibleCount).map((project: MongoProjectType) => (
                  <ProjectCard
                    key={project._id}
                    title={project.title}
                    description={project.description}
                    techStack={
                      project.technologies?.join(' | ') || 'Web Development'
                    }
                    imageUrl={project.image}
                    liveUrl={project.liveUrl || '#'}
                    codeUrl={project.githubUrl || ''}
                    blogUrl={project.blogUrl}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination / Scroll Buttons */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
              {visibleCount < projects.length && (
                <motion.button
                  onClick={handleViewMore}
                  className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium hover:${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ChevronDown className="w-5 h-5" />
                  View More Projects
                </motion.button>
              )}

              {visibleCount > 6 && (
                <motion.button
                  onClick={handleGoBackUp}
                  className={`inline-flex items-center gap-2 px-8 py-4 border-2 rounded-xl font-medium transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ChevronUp className="w-5 h-5" />
                  Go Back Up
                </motion.button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
