'use client'

import { motion } from 'framer-motion'
import { Mail, User, MessageSquare, Send } from 'lucide-react'
import { useTheme } from '../ThemeContext'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'

export function ContactSection() {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      if (result.text === 'OK') {
        toast.success('Message sent successfully! I will get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      }
    } catch (error) {
      console.error('EmailJS error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section
      id="contact"
      className={`py-20 px-6 sm:px-8 lg:px-12 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}
    >
      <div className="max-w-5xl mx-auto">
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
            Get In Touch
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Have a project in mind? Let's work together to create something
            amazing
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <h3
                className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Let's create something amazing together
              </h3>
              <p
                className={`leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                I'm always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say
                hi, feel free to drop me a message!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <motion.div
                className={`flex items-start gap-4 p-5 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700'
                    : `bg-gradient-to-br ${currentTheme.badgeBg} border-${currentTheme.badgeBorder}`
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${currentTheme.iconBg} text-white flex-shrink-0`}
                >
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4
                    className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Email
                  </h4>
                  <a
                    href="mailto:emmanuelobiora196@gmail.com"
                    className={`text-${currentTheme.primary} hover:underline`}
                  >
                    emmanuelobiora196@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                className={`flex items-start gap-4 p-5 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-700'
                    : `bg-gradient-to-br ${currentTheme.badgeBg} border-${currentTheme.badgeBorder}`
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${currentTheme.iconBg} text-white flex-shrink-0`}
                >
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4
                    className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Response Time
                  </h4>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Usually within 24 hours
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={`rounded-3xl shadow-xl border p-8 space-y-6 ${
                isDarkMode
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-100'
              }`}
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-600 focus:ring-orange-600/20'
                      : 'border-gray-200 focus:border-orange-600 focus:ring-orange-600/20'
                  }`}
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-600 focus:ring-orange-600/20'
                      : 'border-gray-200 focus:border-orange-600 focus:ring-orange-600/20'
                  }`}
                  placeholder="john@example.com"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-600 focus:ring-orange-600/20'
                      : 'border-gray-200 focus:border-orange-600 focus:ring-orange-600/20'
                  }`}
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium hover:${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
