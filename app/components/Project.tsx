'use client'

import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import EditButton from './EditButton'
import { ProjectType, UserType } from '../configs/tsTypes'

export default function Project({
  project,
  user,
}: {
  project: ProjectType
  user: UserType
}) {
  return (
    <div className="w-full min-h-[calc(100vh-150px)] py-8 px-4 sm:py-16 sm:px-16 md:px-32 lg:px-64 flex flex-col items-center justify-center gap-8 relative">
      {project ? (
        <>
          <div className="w-full flex lg:relative justify-between lg:justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center">
              {project.title}
            </h1>
            {user && <EditButton id={project._id} />}
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

          <div className="w-full bg-gray-800 text-xl rounded-lg p-4">
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
    </div>
  )
}
