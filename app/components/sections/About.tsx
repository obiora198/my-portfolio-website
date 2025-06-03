import React from 'react'
import Image from 'next/image'

export default function About() {
  return (
    <section id="about-section">
      <div className="w-full sm:h-screen flex flex-col gap-8 items-center sm:px-40 p-4 pt-16">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 sm:mt-8">
          About me
        </h1>

        <div className="w-full h-full flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-24 px-4">
          <Image
            src="/profile-img.png"
            className="h-auto w-full rounded-2xl shadow-lg"
            alt="Profile image"
            width={300}
            height={300}
          />
          <p className="text-lg text-justify max-w-xl">
            I&apos;m a <strong>Full Stack Web Developer</strong> with a passion for building clean, responsive, and user-focused web applications. I specialize in <strong>front-end development</strong> using <strong>React</strong>, <strong>Next.js</strong>, and <strong>Tailwind CSS</strong>, and backend development using <strong>Node.js, express | graphql | Firebase</strong>, and <strong>MongoDB</strong>.
            <br /><br />
            Over the past two years, I’ve worked remotely with teams across time zones, building and shipping real-world solutions using modern tools and agile workflows.
            <br /><br />
            I’m currently <strong>available for freelance projects</strong> or <strong>remote development roles</strong>. If you&apos;re looking for someone who can work independently, communicate clearly, and deliver solid results — let’s connect.
          </p>
        </div>
      </div>
    </section>
  )
}
