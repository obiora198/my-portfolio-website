'use client'

import { motion } from 'framer-motion'
import { Code2, Palette, Rocket, Users, Award, Cpu } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from '../ThemeContext'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import fetchProjects from '../../lib/fetchProjects'

const skills = [
  {
    category: 'Frontend Development',
    icon: Code2,
    items: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Framer Motion'],
  },
  {
    category: 'Backend & Database',
    icon: Rocket,
    items: ['Node.js', 'MongoDB', 'Firebase', 'GraphQL', 'REST APIs'],
  },
  {
    category: 'Design & UX',
    icon: Palette,
    items: ['Figma', 'UI/UX Design', 'Responsive Design', 'Prototyping'],
  },
]

export function AboutSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Calculate experience dynamically from Sept 2023 without hydration mismatch
  const [experience, setExperience] = useState('2+')
  useEffect(() => {
    const start = new Date('2023-09-01')
    const diff = new Date().getTime() - start.getTime()
    const years = diff / (1000 * 60 * 60 * 24 * 365.25)
    setExperience(`${years.toFixed(1)}+`)
  }, [])

  // Fetch actual projects count
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  })
  const projectCount = projects.length > 0 ? `${projects.length}+` : '20+'

  // Calculate dynamic technologies count
  const techCount = skills.reduce((acc, skill) => acc + skill.items.length, 0)

  const achievements = [
    {
      icon: Users,
      value: projectCount,
      label: 'Projects',
      description: 'Successfully delivered',
    },
    {
      icon: Award,
      value: experience,
      label: 'Years',
      description: 'Professional Experience',
    },
    {
      icon: Cpu,
      value: `${techCount}+`,
      label: 'Technologies',
      description: 'Tools & frameworks mastered',
    },
  ]

  return (
    <section
      id="about"
      className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
          >
            About Me
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Passionate about creating exceptional digital experiences
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Left - Story */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/about-new.jpg"
                alt="Emmanuel Obiora - Developer at work"
                width={600}
                height={400}
                className="w-full h-64 object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="space-y-4">
              <h3
                className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Building digital products, brands, and experiences
              </h3>
              <p
                className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                With over 3 years of experience in web development, I&apos;ve
                had the privilege of working with startups and businesses to
                bring their digital visions to life. My journey began with a
                curiosity about how things work on the web, and it has evolved
                into a passion for creating seamless, user-centric applications.
              </p>
              <p
                className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                I believe in the power of clean code, intuitive design, and
                continuous learning. Whether it&apos;s building a complex
                dashboard, designing a landing page, or architecting a scalable
                backend, I approach each project with dedication and attention
                to detail.
              </p>
            </div>
          </motion.div>

          {/* Right - Skills */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className={`text-2xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Skills & Expertise
            </h3>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                className={`rounded-2xl p-6 border hover:shadow-lg transition-shadow duration-300 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700'
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${currentTheme.iconBg} text-white`}
                  >
                    <skill.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {skill.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item) => (
                        <span
                          key={item}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700 text-gray-300'
                              : 'bg-white border-gray-200 text-gray-700'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`h-full rounded-2xl p-8 border hover:shadow-xl transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700'
                    : `bg-gradient-to-br ${currentTheme.badgeBg} border-${currentTheme.badgeBorder}`
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-4 rounded-full bg-gradient-to-br ${currentTheme.iconBg} text-white`}
                  >
                    <achievement.icon className="w-8 h-8" />
                  </div>
                  <div
                    className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                  >
                    {achievement.value}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {achievement.label}
                    </p>
                    <p
                      className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
