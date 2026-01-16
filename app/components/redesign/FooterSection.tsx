'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { useTheme } from '../ThemeContext'

export function FooterSection() {
  const currentYear = new Date().getFullYear()
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className={`text-2xl font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}
            >
              Emmanuel Obiora
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Building exceptional digital experiences with passion and
              precision. Let&apos;s build something amazing together.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About Me
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#vtu"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  VTU Services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg">Get In Touch</h4>
            <p className="text-gray-400">
              <a
                href="mailto:emmanuelobiora196@gmail.com"
                className="hover:text-white transition-colors duration-200"
              >
                emmanuelobiora196@gmail.com
              </a>
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://github.com/obiora198"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:${currentTheme.buttonGradient} transition-all duration-200`}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-obiora-9b8495192/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:${currentTheme.buttonGradient} transition-all duration-200`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:emmanuelobiora196@gmail.com"
                className={`p-3 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:${currentTheme.buttonGradient} transition-all duration-200`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-gray-700 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-gray-400 flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} Emmanuel Obiora. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
              and coffee
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
