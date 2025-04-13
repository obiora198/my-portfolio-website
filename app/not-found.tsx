import Link from 'next/link'
import React from 'react'
 
export default function NotFound() {
  return (
    <div className="w-full h-screen opacity-75 flex flex-col gap-4 items-center justify-center rounded-lg z-50">
      <h1 className="text-4xl font-bold">404</h1>
      <h2>Page does not exist</h2>
      <Link href="/" className='text-indigo-400'>Return Home</Link>
    </div>
  )
}