import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { GradientGridHero } from './gradient-grid-hero'

export default function Hero() {
  return (
    <>
      <section
        id="hero-section"
        className="relative w-full h-screen sm:h-[calc(100vh-100px)] flex flex-col-reverse items-center justify-center gap-4 sm:grid sm:grid-cols-2 sm:px-32 px-4" // Added pt-16 sm:pt-20
      >
        {/* Gradient Grid Background */}
        {/* <div className="absolute inset-0 z-0">
          <GradientGridHero />
        </div> */}

        {/* Text content with blur background */}
        <div className="relative z-10 w-full max-w-lg sm:h-3/5 flex flex-col items-center text-2xl sm:text-5xl px-4 gap-4">
          {/* Blur backdrop for text readability */}
          <div className="absolute inset-0 sm:bg-white backdrop-blur-md rounded-3xl -my-10 shadow-lg shadow-black/10"></div>

          <div className="relative z-10">
            <p className="text-black text-center font-bold">
              Hello, I&apos;am{' '}
              <span className="text-indigo-500 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Emmanuel,
              </span>{' '}
              fullstack web developer.
            </p>

            <div className="flex flex-col items-center gap-2 sm:gap-4 mt-4">
              <Link
                href={'/#contact-section'}
                className="relative overflow-hidden group sm:px-8 px-4 sm:py-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg rounded-md font-bold transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
              >
                <span className="relative z-10">Contact me</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>

              <div className="w-full sm:w-[200px] text-indigo-500 flex items-center justify-center gap-4">
                <a
                  href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
                  className="rounded-lg bg-white p-4 hover:bg-indigo-200 transition-colors flex items-center justify-center border border-purple-500"
                  aria-label="LinkedIn"
                >
                  <i className="fa-brands fa-linkedin text-2xl sm:text-5xl"></i>
                </a>
                <a
                  href="https://github.com/obiora198"
                  className="rounded-lg bg-white p-4 hover:bg-indigo-200 transition-colors flex items-center justify-center border border-purple-500"
                  aria-label="GitHub"
                >
                  <i className="fa-brands fa-square-github text-2xl sm:text-5xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full relative z-10 flex justify-center items-center overflow-hidden">
          {/* Gradient Grid Background */}
          <div className="absolute inset-0 z-0">
            <GradientGridHero />
          </div>
          <div className="relative">
            <Image
              src="/hero-img.png"
              className="h-auto mt-8 sm:mt-0 sm:justify-self-end"
              alt="Emmanuel - Fullstack Developer"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>
    </>
  )
}
