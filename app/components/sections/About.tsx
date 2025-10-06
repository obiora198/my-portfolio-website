import React from 'react'
import Image from 'next/image'

export default function About() {
  return (
    <section id="about-section" className="relative overflow-hidden sm:px-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-5% to-white"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center gap-12 sm:gap-16 px-4 sm:px-8 py-20">
        {/* Enhanced Header */}
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm sm:mt-8">
            About Me
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto shadow-lg shadow-indigo-500/30"></div>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-center  rounded-2xl shadow-2xl shadow-purple-500/20">
          <Image
              src="/profile-img.png"
              className="w-auto h-full rounded-t-lg sm:rounded-l-2xl sm:rounded-none"
              alt="Profile image of Emmanuel - Full Stack Developer"
              width={300}
              height={300}
            />

          {/* Text Content */}
          <div className="group relative p-4 sm:p-8 ">
            {/* Text background with glassmorphism */}
            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              
            <p className="text-gray-700 leading-relaxed font-extralight text-sm text-justify">
              I&apos;m a <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Full Stack Web Developer</span> with a passion for building clean, responsive, and user-focused web applications. I specialize in <span className="font-semibold text-indigo-600">front-end development</span> using React, Next.js, and Tailwind CSS, and backend development using Node.js, Express, GraphQL, Firebase, and MongoDB.
                  
              <br /><br />
                  
              Over the past two years, I&apos;ve worked remotely with teams across time zones, building and shipping real-world solutions using modern tools and agile workflows.
                  
              <br /><br />
                  
              I&apos;m currently <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">available for freelance projects</span> or <span className="font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">remote development roles</span>. If you&apos;re looking for someone who can work independently, communicate clearly, and deliver solid results — let&apos;s connect.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <a 
                href="#contact-section" 
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Get In Touch</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
                  
              <a 
                href="#projects-section" 
                className="group relative px-6 py-3 bg-white text-gray-700 border border-indigo-200 rounded-xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  View Projects
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats or additional info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mt-8">
          <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">2+</div>
            <div className="text-gray-600 text-sm">Years Experience</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">20+</div>
            <div className="text-gray-600 text-sm">Projects Completed</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg">
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">Remote</div>
            <div className="text-gray-600 text-sm">Work Ready</div>
          </div>
        </div>
      </div>
    </section>
  )
}