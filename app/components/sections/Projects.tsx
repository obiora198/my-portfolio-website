'use client'

import { ProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Projects() {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [projects, setProjects] = React.useState<ProjectType[]>([])

  const start = async () => {
    let projectsArray = await fetchProjects()
    setProjects(projectsArray)
    setLoading(false)
  }

  React.useEffect(() => {
    start()
  }, [])

  return (
    <>
      {loading || projects.length === 0 ? (
        <ProjectsSkeleton />
      ) : (
        <section
          id="projects-section"
          className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300"
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-16 md:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Explore some of my recent work and side projects
              </p>
            </motion.div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 dark:border-slate-800"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.data.image as string}
                      alt={project.data.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      {project.data.title}
                    </h3>
                    {project.data.stack && (
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                        {project.data.stack}
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow mb-4">
                      {project.data.description}
                    </p>
                    <div className="flex gap-3 mt-auto">
                      {project.data.link && (
                        <a
                          href={project.data.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.data.githubLink && (
                        <a
                          href={project.data.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-2.5 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          Code
                        </a>
                      )}
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

function ProjectsSkeleton() {
  return (
    <section
      id="projects-section"
      className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-16 md:px-24">
        <div className="text-center mb-16">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-96 mx-auto animate-pulse" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse"
            >
              <div className="h-48 bg-slate-200 dark:bg-slate-800" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="flex-1 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
