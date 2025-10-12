'use client'

import { useTheme } from '../ThemeContext' 
import { ProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Projects() {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [projects, setProjects] = React.useState<ProjectType[]>([])
  const { theme } = useTheme()

  const start = async () => {
    const projectsArray = await fetchProjects()
    setProjects(projectsArray)
    setLoading(false)
  }

  useEffect(() => {
    start()
  }, [])


 return (
    <>
      {loading || projects.length === 0 ? (
        <ProjectsSkeleton />
      ) : (
        <section
          id="projects-section"
          className="py-16 relative overflow-hidden min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300"
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1
              className="text-5xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Projects
              </span>
            </motion.h1>

            <div className="grid gap-8 sm:grid-cols-2">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="relative border border-indigo-300 dark:border-slate-600 overflow-hidden rounded-2xl flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 flex justify-center relative">
                    <div className="w-full h-48 rounded-xl border border-indigo-200 dark:border-slate-500 overflow-hidden relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600">
                      <Image
                        src={project.data.image as string}
                        alt={project.data.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 opacity-20">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage:
                              'linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
                            backgroundSize: '15px 15px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-slate-500 to-transparent" />
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full text-xs font-medium mb-3 border border-indigo-200 dark:border-slate-600">
                      {project.data.stack}
                    </span>
                    <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                      {project.data.title}
                    </h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-4 leading-relaxed text-sm flex-grow">
                      {project.data.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <a
                        href={project.data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center text-xs font-medium bg-indigo-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-slate-600 hover:bg-indigo-200 dark:hover:bg-slate-600"
                      >
                        Live Demo
                        <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                      <a
                        href={project.data.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition flex items-center text-xs font-medium bg-indigo-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-slate-600 hover:bg-indigo-200 dark:hover:bg-slate-600"
                      >
                        Code
                        <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// Also update the ProjectsSkeleton component with dark mode classes
function ProjectsSkeleton() {
  return (
    <section
      id="projects-section"
      className="min-h-screen w-full flex flex-col items-center gap-8 sm:px-40 py-16 p-4 relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      {/* Skeleton Wave Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gradient-to-b from-indigo-50/80 to-gray-50/80 dark:from-slate-800/80 dark:to-slate-900/80 z-0" />
      
      {/* Updated skeleton title style */}
      <motion.h1 
        className="text-5xl font-bold text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Projects
        </span>
      </motion.h1>

      {/* Skeleton Project Grid */}
      <div className="w-full grid gap-8 sm:grid-cols-2 relative z-10">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="relative border border-indigo-300 dark:border-slate-600 overflow-hidden rounded-2xl flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg animate-pulse"
          >
            <div className="p-4 flex justify-center relative">
              <div className="w-full h-48 rounded-xl border border-indigo-200 dark:border-slate-500 overflow-hidden relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 bg-gray-300 dark:bg-slate-600" />
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-slate-500 to-transparent" />
            <div className="p-4 flex flex-col flex-grow">
              <div className="h-6 bg-indigo-100/50 dark:bg-slate-600/50 rounded-full w-1/3 mb-3" />
              <div className="h-5 bg-indigo-100/50 dark:bg-slate-600/50 rounded w-2/3 mb-2" />
              <div className="space-y-2 flex-grow mb-4">
                <div className="h-3 bg-indigo-100/50 dark:bg-slate-600/50 rounded w-full" />
                <div className="h-3 bg-indigo-100/50 dark:bg-slate-600/50 rounded w-5/6" />
                <div className="h-3 bg-indigo-100/50 dark:bg-slate-600/50 rounded w-2/3" />
              </div>
              <div className="flex justify-between items-center mt-auto">
                <div className="h-8 bg-indigo-100/50 dark:bg-slate-600/50 rounded-lg w-2/5" />
                <div className="h-8 bg-indigo-100/50 dark:bg-slate-600/50 rounded-lg w-2/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}