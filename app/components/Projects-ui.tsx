'use client'

import { ProjectType } from '../configs/tsTypes'
import fetchProjects from '../lib/fetchProjects'
import React from 'react'

export default function Projects() {
  // const projects: ProjectType[] = await fetchProjects()
  const [projects, setProjects] = React.useState<ProjectType[]>([])

  const start = async() => {
    let res = await fetchProjects()
    console.log(res);
    
    setProjects(res.data)
  }

  React.useEffect(()=>{
    start()
  },[])

  return (
    <div
      id="portfolio-section"
      className="min-h-screen w-full bg-gray-800 text-amber-50 flex flex-col items-center gap-8 px-4 sm:px-16 md:px-24 lg:px-32 pt-16 pb-8"
    >
      <div className="py-8 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-bold tracking-tight text-gray-900 sm:text-xl">
              Checkout some of my work, cool right?
            </h3>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 pt-10 sm:mt-8 sm:pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex max-w-xl flex-col items-start justify-between"
              >
                <img
                  width={300}
                  height={350}
                  alt="title"
                  src={project.data.image}
                  className="w-full max-h-80 rounded-xl"
                />
                <div className="flex items-center gap-x-4 text-xs">
                  <time
                    dateTime={project.data.createdAt}
                    className="text-gray-500"
                  >
                    {project.data.createdAt}
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-2 text-lg font-semibold leading-6 text-gray-900">
                    {project.data.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                    {project.data.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
