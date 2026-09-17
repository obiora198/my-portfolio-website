'use client'

import { motion } from 'framer-motion'
import { Mail, User, MessageSquare, Send } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useTheme } from '../ThemeContext'
import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'

interface ContactSectionProps {
  title?: string
  subtitle?: string
  heading?: string
  description?: string
}

export function ContactSection({
  title = 'Get In Touch',
  subtitle = "Have a project in mind? Let's work together to create something amazing",
  heading = "Let's create something amazing together",
  description = "I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to drop me a message!",
}: ContactSectionProps = {}) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleWhatsAppSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name first.')
      const nameInput = document.getElementById('name')
      if (nameInput) nameInput.focus()
      return
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address.')
      const emailInput = document.getElementById('email')
      if (emailInput) emailInput.focus()
      return
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message.')
      const messageInput = document.getElementById('message')
      if (messageInput) messageInput.focus()
      return
    }

    const isVTU = typeof window !== 'undefined' && window.location.pathname.includes('vtu')
    const sourceLabel = isVTU ? 'VTU Services Platform' : 'Portfolio Website'

    // Save to database in the background so Emmanuel has a persistent record
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: isVTU ? 'vtu_mobile_whatsapp' : 'homepage_mobile_whatsapp',
        }),
      }).catch(() => {})
    } catch (e) {}

    const text = `Hi Emmanuel,\n\nName: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\nSource: ${sourceLabel}\n\nMessage:\n${formData.message.trim()}`
    const whatsappUrl = `https://wa.me/2348162841368?text=${encodeURIComponent(text)}`

    toast.success('Opening WhatsApp...', { icon: '💬' })
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // On mobile screens, route through WhatsApp flow
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      handleWhatsAppSubmit()
      return
    }

    setLoading(true)

    let emailjsSuccess = false
    let dbSuccess = false

    // 1. Try sending via EmailJS
    try {
      if (
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      ) {
        const result = await emailjs.sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          formRef.current!,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        )
        if (result.text === 'OK') {
          emailjsSuccess = true
        }
      }
    } catch (error: any) {
      console.warn('EmailJS delivery error:', error)
    }

    // 2. Persist to MongoDB via /api/contact as reliable backend storage
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: typeof window !== 'undefined' ? window.location.pathname : 'contact_form',
        }),
      })
      if (res.ok) {
        dbSuccess = true
      }
    } catch (dbError) {
      console.warn('Database save error:', dbError)
    }

    if (emailjsSuccess || dbSuccess) {
      toast.success(
        'Message received! Thank you, I will get back to you soon.'
      )
      setFormData({ name: '', email: '', message: '' })
    } else {
      const mailtoUrl = `mailto:emmanuelobiora11@gmail.com?subject=${encodeURIComponent(
        `Contact from ${formData.name}`
      )}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`
      toast.error(
        'Automatic email delivery failed. Opening your email app to send directly...',
        { duration: 5000 }
      )
      if (typeof window !== 'undefined') {
        window.location.href = mailtoUrl
      }
    }

    setLoading(false)
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
      className={`py-20 ${
        isDarkMode ? 'bg-[#000000]' : 'bg-gradient-to-br from-gray-50 to-white'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
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
            {title}
          </h2>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}
          >
            {subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left - Contact Info */}
          <motion.div
            className="space-y-8 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <h3
                className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {heading}
              </h3>
              <p
                className={`leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}
              >
                {description}
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <motion.div
                className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-[#121212] border-neutral-800/80 shadow-black/40'
                    : `bg-gradient-to-br ${currentTheme.badgeBg} ${currentTheme.badgeBorder}`
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
                    href="mailto:emmanuelobiora11@gmail.com"
                    className={`${currentTheme.primary} hover:underline break-all`}
                  >
                    emmanuelobiora11@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border ${
                  isDarkMode
                    ? 'bg-[#121212] border-neutral-800/80 shadow-black/40'
                    : `bg-gradient-to-br ${currentTheme.badgeBg} ${currentTheme.badgeBorder}`
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
                  <p className={isDarkMode ? 'text-neutral-400' : 'text-gray-600'}>
                    Usually within 24 hours
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              id="contact-form"
              ref={formRef}
              onSubmit={handleSubmit}
              className={`rounded-3xl shadow-xl border p-6 sm:p-8 space-y-4 sm:space-y-6 ${
                isDarkMode
                  ? 'bg-[#121212] border-neutral-800/80 shadow-2xl shadow-black/50'
                  : 'bg-white border-gray-100'
              }`}
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className={`flex items-center gap-2 text-sm font-medium ${
                    isDarkMode ? 'text-neutral-300' : 'text-gray-700'
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
                  className={`w-full px-4 py-3 text-base rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600 focus:ring-neutral-700/30'
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
                    isDarkMode ? 'text-neutral-300' : 'text-gray-700'
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
                  className={`w-full px-4 py-3 text-base rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600 focus:ring-neutral-700/30'
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
                    isDarkMode ? 'text-neutral-300' : 'text-gray-700'
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
                  className={`w-full px-4 py-3 text-base rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                    isDarkMode
                      ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600 focus:ring-neutral-700/30'
                      : 'border-gray-200 focus:border-orange-600 focus:ring-orange-600/20'
                  }`}
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Mobile WhatsApp Button (Only displayed on mobile screens < md) */}
              <motion.button
                type="button"
                onClick={handleWhatsAppSubmit}
                className="w-full md:hidden inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-98"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaWhatsapp className="w-5 h-5 text-white" />
                <span>Send via WhatsApp</span>
              </motion.button>

              {/* Desktop Submit Button (Hidden on mobile, displayed on desktop/computer screens >= md) */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full hidden md:inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium hover:${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <Send className="w-5 h-5" />
                {loading ? 'Sending...' : 'Send Message'}
              </motion.button>

              <div className="text-center pt-1">
                <a
                  href={`mailto:emmanuelobiora11@gmail.com?subject=${encodeURIComponent(
                    formData.name ? `Message from ${formData.name}` : 'Portfolio Inquiry'
                  )}&body=${encodeURIComponent(formData.message || '')}`}
                  className={`text-xs underline transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'text-neutral-500 hover:text-neutral-300'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Or email directly via your mail client
                </a>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
