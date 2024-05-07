'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CldImage } from 'next-cloudinary'
import Loading from '@/app/components/Loading'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import CustomDialog from '@/app/components/Dialog'
import getProject from '@/app/lib/getProject'
import { ProjectType } from '@/app/configs/tsTypes'
import Link from 'next/link'

const Page: React.FC = () => {
  const searchParam = useParams()['projectId'][1]

  const [project, setProject] = useState<ProjectType | null>(null)
  const [loading, setLoading] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [stamp, setStamp] = React.useState<number>(0)

  useEffect(() => {
    const getProjectData = async () => {
      setLoading(true)
      const data = await getProject({ id: searchParam })
      setProject(data)
      setLoading(false)
    }
    getProjectData()
  }, [stamp])

  const handlePencilClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement)
  }
  return (
    <div className="w-full min-h-[calc(100vh-150px)] py-8 px-4 sm:py-16 sm:px-16 md:px-32 lg:px-64 flex flex-col items-center justify-center gap-8 relative">
      {loading && (
        <div className="w-4/5 h-4/5 absolute">
          <Loading dark={null} />
        </div>
      )}
      {project ? (
        <>
          <div className="w-full flex lg:relative justify-between lg:justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              {project.title}
            </h1>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={handlePencilClick}
              className="block lg:absolute right-0 "
            >
              <EditIcon />
            </Button>
          </div>
          <div className="w-full py-2 bg-gray-400 grid place-content-center">
            {project.images[0] && (
              <CldImage
                src={project.images[0]}
                width={300}
                height={300}
                alt={project.title}
                className="rounded-lg"
              />
            )}
          </div>

          <div className="w-full bg-gray-800 text-xl text-center rounded-lg p-4">
            <p className="">{project.description}</p>
            <p>
              click{' '}
              <a
                href={project.link}
                className="text-gray-950 hover:text-gray-900"
              >
                here
              </a>{' '}
              to view the live project
            </p>
          </div>
        </>
      ) : (
        <p>
          project not found! return to{' '}
          <Link
            href={'/projects'}
            className="text-amber-200 hover:text-amber-50"
          >
            projects page
          </Link>{' '}
          or{' '}
          <Link href={'/'} className="text-amber-200 hover:text-amber-50">
            homepage
          </Link>{' '}
        </p>
      )}

      <CustomDialog
        anchorEl={anchorEl}
        setAnchor={setAnchorEl}
        id={searchParam}
        setStamp={setStamp}
      />
    </div>
  )
}

export default Page
