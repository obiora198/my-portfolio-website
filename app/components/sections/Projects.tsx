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
    // setLoading(true)
    let projectsArray = await fetchProjects()
    setProjects(projectsArray)
    setLoading(false)
  }

  React.useEffect(() => {
    start()
  }, [])

  return (
    <>
      {(loading || (projects.length == 0)) ? (
        <ProjectsSkeleton />
      ) : (
        <section id="projects-section" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-indigo-600 text-center mb-12">
              Projects
            </h1>

            <div className="grid gap-8 sm:grid-cols-2">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
                >
                  <Image
                    src={project.data.image as string}
                    alt={project.data.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold mb-2">
                      {project.data.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">
                      {project.data.stack}
                    </p>
                    <p className="text-gray-700 text-sm flex-grow mb-4">
                      {project.data.description}
                    </p>
                    <div className="flex gap-4 mt-auto">
                      <a
                        href={project.data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 text-center py-2 rounded-full border-2 border-indigo-500 text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white transition-all duration-300"
                      >
                        Live Demo
                      </a>
                      <a
                        href={project.data.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 text-center py-2 rounded-full border-2 border-gray-800 text-gray-800 font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300"
                      >
                        Code
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

function ProjectsSkeleton() {
  return (
    <section
      id="projects-section"
      className="min-h-screen w-full flex flex-col items-center gap-8 sm:px-40 pt-16 p-4"
    >
      <h1 className="text-4xl font-bold text-indigo-500 text-center border-b-2 my-4">
        Projects
      </h1>

      {/* Skeleton Project Grid */}
      <div className="w-full grid gap-8 sm:grid-cols-2">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="w-full h-48 bg-gray-200" />

          <div className="p-6 flex flex-col flex-grow">
            {/* Title */}
            <div className="h-6 bg-gray-300 rounded w-2/3 mb-2" />
            {/* Stack */}
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            {/* Description */}
            <div className="space-y-2 flex-grow mb-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            {/* Buttons */}
            <div className="flex gap-4 mt-auto">
              <div className="w-1/2 h-10 bg-gray-300 rounded-full" />
              <div className="w-1/2 h-10 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
    </section>
  )
}
