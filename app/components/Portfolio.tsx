'use client'

import React, { useState, useEffect } from 'react'
import ProjectCard from './ProjectCard'
import Loading from './Loading'
import { ProjectType } from '../configs/tsTypes'


export default function Portfolio({projects}:{projects:ProjectType[]}) {
  // const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(false)

  // const fetchProjects = async () => {
  //   setLoading(true)
  //   const data = await getProjects()
  //   setProjects(data)
  //   setLoading(false)
  // }

  useEffect(() => {
    // fetchProjects()
  }, [])

  return (
    <div
      id="portfolio-section"
      className="min-h-screen w-full bg-gray-800 text-amber-50 flex flex-col items-center gap-8 px-4 sm:px-16 md:px-24 lg:px-32 pt-16 pb-8"
    >
      <h1 className="font-bold text-5xl text-center">My Portfolio</h1>

      <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 place-items-center rounded-lg relative">
        {loading && (
          <div className="w-full h-[calc(100vh-200px)] absolute top-0 left-0">
            <Loading dark={null} />
          </div>
        )}

        { projects.map((item: ProjectType) => (
          <ProjectCard
            image={item.images[0]}
            title={item.title}
            url={`./projects/${item._id}`}
            key={projects.indexOf(item)}
          />
        ))}
      </div>
    </div>
  )
}
