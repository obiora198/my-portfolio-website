'use client'

import { ProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'
import React from 'react'

export default function Projects() {
  const [projects, setProjects] = React.useState<ProjectType[]>([])

  const start = async () => {
    let res = await fetchProjects()
    console.log(res)

    setProjects(res.data)
  }

  React.useEffect(() => {
    start()
  }, [])

  return (
    <section id="projects-section">
      <div className="min-h-screen w-full flex flex-col items-center gap-8 px-40 pt-16 pb-4">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 my-4">
          Projects
        </h1>
        <div className="w-full grid grid-cols-2 gap-8 items-center justify-items-center">
          {projects.map((project) => (
            <div
              key={project.id}
              className="w-full bg-white flex flex-col gap-3 items-center justify-center p-8 border-2 rounded-[32px]"
            >
              
                <img
                  width={300}
                  height={350}
                  alt="title"
                  src={project.data.image}
                  className="w-full rounded-[32px] h-auto object-cover"
                />
                <div className="w-full flex flex-col items-center gap-2">
                  <h2 className="mt-2 text-2xl font-bold">
                    {project.data.title}
                  </h2>
                  <div className='w-full flex items-center justify-center gap-4'>
                    <a className='text-l px-8 py-2 rounded-full border-2 font-bold hover:bg-indigo-500 hover:text-white transition-all duration-500' href={project.data.link}>Live Demo</a>
                    <a className='text-l px-8 py-2 rounded-full border-2 font-bold hover:bg-indigo-500 hover:text-white transition-all duration-500' href={project.data.link}>Code</a>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
