import React from 'react'
import Image from 'next/image'

export default function About() {
  return (
    <section id="about-section">
      <div className="w-full md:h-screen flex flex-col gap-8 items-center md:px-40 p-4 md:pt-16">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 md:mt-8">
          About me
        </h1>

        <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-24 px-4">
          <Image
            src="/profile-img.jpg"
            className="h-auto w-full rounded-2xl shadow-lg"
            alt=""
            width={300}
            height={300}
          />
          <p className="text-lg text-justify">
            I&apos;m a self-taught web developer with a passion for building fast,
            modern, and user-friendly applications. My journey began with
            Next.js, Tailwind CSS, and Firebase, where I crafted responsive
            frontends with sleek designs. As my curiosity grew, I dove into
            backend development, mastering Express.js, MongoDB, and
            Node.js—building robust APIs and ensuring seamless data flow with
            Postman. <br /> 
            What drives me? Problem-solving, clean code, and continuous
            learning. I thrive on turning ideas into reality, whether it&apos;s a
            dynamic full-stack app or an optimized UI. My goal? To join a team
            where I can contribute my skills, grow as a developer, and create
            impactful digital experiences. Let&apos;s build something amazing
            together!
          </p>
        </div>
      </div>
    </section>
  )
}
