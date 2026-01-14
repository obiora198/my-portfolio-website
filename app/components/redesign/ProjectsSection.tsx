'use client'

import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { useTheme } from '../ThemeContext'
import { useEffect, useState } from 'react'
import { MongoProjectType } from '../../configs/tsTypes'

export function ProjectsSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [projects, setProjects] = useState<MongoProjectType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false)
      }
    }, 8000)

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        if (isMounted) {
          setProjects(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        if (isMounted) {
          setProjects([])
          setLoading(false)
        }
      }
    }

    fetchProjects()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
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
          <div className="text-center py-20">
            <div
              className={`inline-block w-16 h-16 border-4 border-${currentTheme.primary} border-t-transparent rounded-full animate-spin`}
            />
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
