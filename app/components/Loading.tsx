import * as React from 'react'
import Image from 'next/image'


export default function Loading() {
  return (
    <div className="w-full h-screen opacity-75 flex items-center justify-center animate-pulse rounded-lg z-50">
      <div className="relative">
        <div className="w-28 h-28 border-4 border-white rounded-full animate-spin border-t-indigo-600 inline-block"></div>
        <Image src="/hero-img.png" alt="Loading" className="absolute top-0" width={200} height={200} />
      </div>
    </div>
  )
}
