'use client'

import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { useTheme } from '../ThemeContext'
import { useEffect, useState } from 'react'
import { MongoProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'

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
  const [projects, setProjects] = useState<MongoProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadProjects() {
      try {
        console.log('🚀 Loading projects...')
        setLoading(true)
        setError(null)

        const data = await fetchProjects()
        console.log('✅ Fetched projects:', data?.length || 0, 'projects')

        if (isMounted) {
          setProjects(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('❌ Failed to load projects:', err)
        if (isMounted) {
          setError('Failed to load projects')
          setProjects([])
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section
      id="projects"
      className={`py-20 px-6 sm:px-8 lg:px-12 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                title={project.title}
                description={project.description}
                techStack={
                  project.technologies?.join(' | ') || 'Web Development'
                }
                imageUrl={project.image}
                liveUrl={project.liveUrl || '#'}
                codeUrl={project.githubUrl || '#'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
