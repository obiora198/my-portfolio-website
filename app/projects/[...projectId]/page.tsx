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
    <div className='w-full pb-32 pt-16 px-80 flex flex-col items-center gap-16'>
      {project && (
        <>
        <h1 className='text-6xl'>{project.title}</h1>
          {project.images[0] && (
            <CldImage 
              src={project.images[0]}
              width={1000}
              height={1000}
              alt={project.title}
              className='w-full h-[300px]'
            />
          )}

          <div className='w-full text-xl'>

            <p className=''>{project.description}</p>
            <p>click <a href={project.link}>here</a> to view the live project</p>
          </div>


        </>
      )}
    </div>
  )
}

export default Page
