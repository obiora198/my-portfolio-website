'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

export default function Skills() {
  const skills = [
    { name: 'React', icon: '/skills/react.png' },
    { name: 'Next.js', icon: '/skills/nextjs.png' },
    { name: 'Tailwind CSS', icon: '/skills/tailwind.png' },
    { name: 'CSS', icon: '/skills/css.png' },
    { name: 'JavaScript', icon: '/skills/js.png' },
    { name: 'HTML', icon: '/skills/html.png' },
    { name: 'Node.js', icon: '/skills/nodejs.png' },
    { name: 'Express.js', icon: '/skills/expressjs.png' },
    { name: 'MongoDB', icon: '/skills/mongodb.png' },
    { name: 'Firebase', icon: '/skills/firebase.png' },
    { name: 'Git', icon: '/skills/git.png' },
  ]

  // Duplicate once for seamless loop (lighter than tripling)
  const duplicatedSkills = [...skills, ...skills]

  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills-section"
      className="w-full min-h-screen relative py-16 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 dark:from-slate-900 dark:via-indigo-900/20 dark:to-purple-900/10 transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            Technologies I Work With
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            A comprehensive suite of modern tools and technologies to deliver
            exceptional digital solutions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Continuous Scrolling Row */}
        <div ref={containerRef} className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-purple-100 via-indigo-50/30 to-transparent dark:from-slate-900 dark:via-indigo-900/20 dark:to-transparent z-20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-purple-100 via-indigo-50/30 to-transparent dark:from-slate-900 dark:via-indigo-900/20 dark:to-transparent z-20"></div>

          <div className="flex overflow-hidden">
            <div
              className={`flex space-x-6 sm:space-x-8 py-4 will-change-transform ${
                isVisible ? 'animate-scroll' : ''
              }`}
            >
              {duplicatedSkills.map((skill, index) => (
                <div
                  key={`${skill.name}-${index}`}
                  className="group flex-shrink-0 flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-slate-800 dark:to-slate-700/80 border border-gray-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-500 hover:scale-105 hover:border-indigo-200/70 dark:hover:border-indigo-500/30 min-w-[180px]"
                >
                  {/* Skill Icon */}
                  <div className="relative mb-4 p-3 rounded-2xl bg-white dark:bg-slate-700 shadow-md border border-gray-100 dark:border-slate-600 group-hover:shadow-lg group-hover:border-indigo-100 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                      <Image
                        src={skill.icon}
                        alt={`${skill.name} icon`}
                        width={60}
                        height={60}
                        loading="lazy"
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {skill.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16 max-w-3xl mx-auto">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 dark:border-slate-700/50 shadow-lg dark:shadow-slate-900/20">
            <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed font-light">
              Continuously expanding my expertise with the latest technologies
              and best practices to deliver cutting-edge solutions for modern
              web applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
