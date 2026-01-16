'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, MessageSquare, Send } from 'lucide-react'
import { useTheme } from '../ThemeContext'
import emailjs from '@emailjs/browser'
import { toast } from 'react-hot-toast'

export default function Contact() {
  const { currentTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    message: '',
  })

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formRef.current || !serviceId || !templateId) {
      console.error('EmailJS configuration missing')
      setLoading(false)
      return
    }

    toast.loading('Sending message...', { id: 'contact-toast' })

    emailjs
      .sendForm(serviceId, templateId, formRef.current, {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          toast.success('Message sent successfully!', { id: 'contact-toast' })
          setFormSubmitted(true)
          setLoading(false)
          setFormData({ userName: '', userEmail: '', message: '' })
          formRef.current?.reset()
        },
        (error) => {
          console.error('EmailJS error:', error)
          toast.error('Failed to send message. Please try again.', {
            id: 'contact-toast',
          })
          setLoading(false)
        }
      )
  }

  const handleBackToForm = () => {
    setFormSubmitted(false)
  }

  return (
    <section
      id="contact-section"
      className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 transition-colors duration-300"
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
          <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a project in mind? Let&apos;s work together to create something
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
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Let&apos;s create something amazing together
              </h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-lg">
                I&apos;m always interested in hearing about new projects and
                opportunities. Whether you have a question or just want to say
                hi, feel free to drop me a message!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4 text-lg">
              <motion.div
                className={`flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br ${currentTheme.badgeBg} border border-${currentTheme.badgeBorder} shadow-sm`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`p-4 rounded-xl bg-gradient-to-br ${currentTheme.iconBg} text-white flex-shrink-0`}
                >
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:emmanuelobiora.dev@gmail.com"
                    className={`${currentTheme.primary} hover:underline`}
                  >
                    emmanuelobiora.dev@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                className={`flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br ${currentTheme.badgeBg} border border-${currentTheme.badgeBorder} shadow-sm`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`p-4 rounded-xl bg-gradient-to-br ${currentTheme.iconBg} text-white flex-shrink-0`}
                >
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Response Time
                  </h4>
                  <p className="text-gray-600 dark:text-slate-400">
                    Usually within 24 hours
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Element */}
            <div className="relative hidden lg:block h-32">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-10 rounded-3xl blur-2xl`}
              />
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form
                  key="contact-form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 space-y-6"
                >
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
                    >
                      <User className={`w-4 h-4 ${currentTheme.primary}`} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:${currentTheme.primary.replace(
                        'text-',
                        'border-'
                      )} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200`}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
                    >
                      <Mail className={`w-4 h-4 ${currentTheme.primary}`} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:${currentTheme.primary.replace(
                        'text-',
                        'border-'
                      )} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200`}
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-300"
                    >
                      <MessageSquare
                        className={`w-4 h-4 ${currentTheme.primary}`}
                      />
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border-2 border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:${currentTheme.primary.replace('text-', 'border-')} dark:focus:${currentTheme.primary.replace('text-', 'border-')} focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none`}
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${currentTheme.buttonGradient} text-white rounded-xl font-medium ${currentTheme.buttonHover} transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 p-12 text-center space-y-6"
                >
                  <div
                    className={`w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto`}
                  >
                    <Send className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Message Sent!
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400">
                      Thank you for reaching out. I&apos;ll get back to you
                      within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={handleBackToForm}
                    className={`${currentTheme.primary} font-medium hover:underline`}
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
