'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CldImage } from 'next-cloudinary'

interface Project {
  images: string[]
  title: string
  link: string
  description: string
}

const Page: React.FC = () => {
  const searchParam = useParams()['projectId'][1]
  
  const [project, setProject] = useState<Project|null>(null)

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await fetch(`https://my-portfolio-api-1v51.onrender.com/api/v1/projects/${searchParam}`)
        const data = await res.json()
        setProject(data.project)
      } catch (error) {
        console.error(error)
      }
    }
    getProject()
    console.log(project)
  }, [])

  return (
    <div className='w-full min-h-[calc(100vh-150px)] py-8 px-4 sm:py-16 sm:px-16 md:px-32 lg:px-64 flex flex-col items-center gap-8'>
      {project && (
        <>
        <h1 className='text-4xl sm:text-5xl text-center'>{project.title}</h1>
          <div className='w-full py-4 bg-amber-50 grid place-content-center'>
            {project.images[0] && (
              <CldImage
                src={project.images[0]}
                width={300}
                height={300}
                alt={project.title}
                className='rounded-lg'
              />
            )}
          </div>

          <div className='w-full bg-gray-800 text-xl text-center rounded-lg p-4'>

            <p className=''>{project.description}</p>
            <p>click <a href={project.link} className='text-gray-950 hover:text-gray-900'>here</a> to view the live project</p>
          </div>


        </>
      )}
    </div>
  )
}

export default Page
