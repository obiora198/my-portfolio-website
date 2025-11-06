import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaLinkedin, FaGithubSquare } from 'react-icons/fa'

export default function Hero() {
  return (
    <>
      <section
        id="hero-section"
        className="w-full h-[calc(100vh-56px)] sm:h-[500px] flex flex-col-reverse items-center justify-center gap-4 sm:grid sm:grid-cols-2 sm:px-32"
      >
        <div className="w-full flex flex-col items-center text-2xl  sm:text-5xl px-4 gap-4">
          <p className="text-black text-center font-bold">
            Hello, I&apos;am <span className="text-indigo-500 ">Emmanuel,</span>{' '}
            fullstack web developer.
          </p>

          <div className="flex flex-col items-center gap-2 sm:gap-4">
            <Link
              href={'/#contact-section'}
              className="sm:px-8 px-4 sm:py-4 py-2 bg-indigo-500 text-white text-lg rounded-md sm:font-bold"
            >
              Contact me
            </Link>

            <div className="w-full sm:w-[200px] text-indigo-500 flex items-center justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-3xl sm:text-4xl hover:text-indigo-600 transition-colors duration-300" />
              </a>

              <a
                href="https://github.com/obiora198"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithubSquare className="text-3xl sm:text-4xl hover:text-indigo-600 transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>
        <Image
          src="/hero-img.png"
          className="h-auto mt-8 sm:mt-0 sm:justify-self-end"
          alt=""
          width={400}
          height={400}
        />
      </section>
    </>
  )
}
