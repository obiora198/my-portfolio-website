import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <>
      <div
        id="hero-section"
        className="h-screen text-amber-100 grid md:grid-cols-2 p-4 sm:px-16 md:px-32 lg:px-64 relative"
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="w-40 h-40 bg-gradient-to-r from-amber-200 via-gray-900 to-amber-50  rounded-full p-1 md:hidden">
            <div className="h-full w-full bg-[url(/hero-img-thumbnail.png)] bg-cover bg-center rounded-full"></div>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-200 sm:text-6xl">
            hello and welcome to my portfolio website
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-100">
            My name is Obiora Sopuluchukwu, I build awsome websites and web apps
            like this one you are on right now, feel free to take a look around
            and see how awsome I am &#128521;.
          </p>
        </div>
        <div className="w-full h-full absolute flex items-center justify-center md:static -z-10">
          <div className="md:hidden h-full w-full bg-[rgba(0,0,0,0.7)] absolute"></div>
          <div className="hidden md:block h-4/5 w-4/5 py-1 pr-1 bg-gradient-to-r from-amber-200 via-gray-600 to-amber-400 rounded-r-full relative">
            <div className="h-full w-full bg-[url(/hero-img2.png)] bg-cover bg-center rounded-r-full">
              <div className="h-full w-full bg-gradient-to-r from-gray-950 to-50% to-transparent absolute top-0"></div>
            </div>
          </div>
          <Image
            src="/hero-img2.png"
            className=" h-full w-full md:hidden"
            alt=""
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </>
  )
}
