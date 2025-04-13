import Image from 'next/image'
import React from 'react'

export default function Hero() {
  return (
    <>
      <section
        id="hero-section"
        className="h-[500px] grid md:grid-cols-2 items-center px-32"
      >
        <div className="w-full flex flex-col items-center px-4 gap-4">
          <p className="text-5xl text-black text-center font-bold">
            Hello, I&aposam{' '}
            <span className="text-indigo-500 text-5xl">Emmanuel,</span>{' '}
            fullstack web developer.
          </p>

          <div className="flex flex-col items-center gap-4">
            <button className="px-8 py-4 bg-indigo-500 text-white rounded-md font-bold">
              Contact me
            </button>

            <div className="w-[200px] text-indigo-500 text-5xl flex items-center justify-center gap-4">
              <a href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://github.com/obiora198">
                <i className="fa-brands fa-square-github"></i>
              </a>
            </div>
          </div>
        </div>
        <Image
          src="/hero-img2.png"
          className="h-auto justify-self-end"
          alt=""
          width={400}
          height={400}
        />
      </section>
    </>
  )
}
