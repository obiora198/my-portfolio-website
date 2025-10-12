'use client'

import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CanvasRevealEffect from './PixelMatrix'
import emailjs from '@emailjs/browser'
import { toast } from 'react-hot-toast'

interface ContactPageProps {
  className?: string
}

export default function Contact() {
  return (
    <section
      id="contact-section"
      className="flex w-full h-screen justify-center items-center bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      <ContactPage />
    </section>
  )
}

export const ContactPage = ({ className }: ContactPageProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true)
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false)
  
  // Intersection Observer state
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

  if (!serviceId || !templateId) {
    console.error('EmailJS environment variables are not set')
  }

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.2,
        rootMargin: '50px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!formRef.current || !serviceId || !templateId) return

    toast.loading('Sending message...', { id: 'contact-toast' })

    emailjs
      .sendForm(serviceId, templateId, formRef.current, {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      })
      .then(
        (response) => {
          toast.success('Message sent successfully!', { id: 'contact-toast' })

          setReverseCanvasVisible(true)
          setInitialCanvasVisible(false)

          setTimeout(() => {
            setFormSubmitted(true)
            setLoading(false)
          }, 2000)

          formRef.current?.reset()
        },
        (error) => {
          toast.error('Failed to send message. Please try again.', {
            id: 'contact-toast',
          })
          setLoading(false)
        }
      )
  }

  const handleBackToForm = () => {
    setFormSubmitted(false)
    setReverseCanvasVisible(false)
    setInitialCanvasVisible(true)
  }

  return (
    <div
      ref={sectionRef}
      className={`flex w-full flex-col min-h-screen sm:pb-16 pb-8 relative bg-white dark:bg-slate-900 transition-colors duration-300 ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {/* Initial canvas (forward animation) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={6}
              colors={[
                [99, 102, 241], // indigo-500
                [196, 181, 253], // violet-300
              ]}
              dotSize={5}
              reverse={false}
              isVisible={isInView}
            />
          </div>
        )}

        {/* Reverse canvas (appears when form is submitted) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={6}
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={5}
              reverse={true}
              isVisible={isInView}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(225,225,225,1)_0%,_transparent_100%)] dark:bg-[radial-gradient(circle_at_center,_rgba(30,41,59,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-gray-50 to-transparent dark:from-slate-800 dark:to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-50 to-transparent dark:from-slate-800 dark:to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col flex-1">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-center items-center px-4 pt-4">
            <div className="w-full max-w-lg">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <motion.h1
                        className="text-5xl font-bold text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                          Get in Touch
                        </span>
                      </motion.h1>
                      <p className="text-lg text-indigo-400 dark:text-indigo-300 font-extralight">
                        Let&apos;s start a conversation
                      </p>
                    </div>

                    {/* Contact Form */}
                    <div className="backdrop-blur-sm bg-white dark:bg-slate-800 rounded-3xl border border-indigo-300 dark:border-slate-600 px-6 py-8 shadow-lg dark:shadow-slate-900/20">
                      <form
                        ref={formRef}
                        className="flex flex-col gap-6"
                        onSubmit={handleFormSubmit}
                      >
                        {/* Name Field */}
                        <div className="relative">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="userName"
                            placeholder="Enter your name"
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="userEmail"
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                          />
                        </div>

                        {/* Message Field */}
                        <div className="relative">
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            placeholder="Tell me about your project..."
                            required
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                            loading
                              ? 'bg-gray-400 dark:bg-slate-600 text-white cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25'
                          }`}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-white/80 rounded-full animate-spin border-t-white"></div>
                              <span className="text-white">Sending Message...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <span>Send Message</span>
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                                />
                              </svg>
                            </div>
                          )}
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-step"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
                    className="space-y-8 text-center"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl font-bold text-indigo-500 dark:text-indigo-400">
                        Message Sent!
                      </h1>
                      <p className="text-lg text-indigo-500/70 dark:text-indigo-300/70 font-light">
                        Thank you for reaching out
                      </p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-white to-white/70 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-black dark:text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </motion.div>

                    <div className="space-y-4">
                      <p className="text-indigo-500 dark:text-indigo-400 font-light text-lg">
                        We&apos;ve received your message and will respond within 24 hours.
                      </p>

                      <motion.button
                        onClick={handleBackToForm}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="w-full py-4 rounded-xl bg-white dark:bg-slate-700 text-black dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600 shadow-sm"
                      >
                        Send Another Message
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}