import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaLinkedin, FaGithubSquare } from 'react-icons/fa'
import { GradientGridHero } from './gradient-grid-hero'

export default function Hero() {
  return (
    <>
      <section
        id="hero-section"
        className="relative w-full h-screen sm:h-[calc(100vh-100px)] flex flex-col-reverse items-center justify-center gap-4 sm:grid sm:grid-cols-2 sm:px-32 px-4 bg-white dark:bg-slate-900 transition-colors duration-300"
      >
        {/* Text content with blur background */}
        <div className="relative z-10 w-full max-w-lg sm:h-3/5 flex flex-col items-center text-2xl sm:text-5xl px-4 gap-4">
          {/* Blur backdrop for text readability */}
          <div className="absolute inset-0 sm:bg-white/80 dark:sm:bg-slate-800/80 backdrop-blur-md rounded-3xl -my-10"></div>

          <div className="relative z-10">
            <p className="text-gray-500 dark:text-white text-center font-bold transition-colors duration-300">
              Hello, I&apos;am{' '}
              <span className="text-indigo-500 dark:text-indigo-400 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                Emmanuel,
              </span>{' '}
              fullstack web developer.
            </p>

            <div className="flex flex-col items-center gap-2 sm:gap-4 mt-4">
              <Link
                href={'/#contact-section'}
                className="relative overflow-hidden group sm:px-8 px-4 sm:py-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white text-lg rounded-md font-bold transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500"
              >
                <span className="relative z-10">Contact me</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>

              <div className="w-full sm:w-[200px] text-indigo-500 dark:text-indigo-400 flex items-center justify-center gap-4">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
                  className="rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="h-10 w-10 sm:h-16 sm:w-16 text-indigo-500 dark:text-indigo-400" />
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/obiora198"
                  className="rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithubSquare className="h-10 w-10 sm:h-16 sm:w-16 text-indigo-500 dark:text-indigo-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full w-full relative flex justify-center items-center overflow-hidden">
          {/* Gradient Grid Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <GradientGridHero />
          </div>
          <div className="relative z-10">
            <Image
              src="/hero-img.png"
              className="h-auto mt-8 sm:mt-0 sm:justify-self-end"
              alt="Emmanuel - Fullstack Developer"
              width={400}
              height={400}
              priority
            />
          </div>
        </div>
      </section>
    </>
  )
}
