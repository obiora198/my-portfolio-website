'use client'

import React, { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CanvasRevealEffect } from './PixelMatrix'
import { TextField } from '@mui/material'
import emailjs from '@emailjs/browser'
import { toast } from 'react-hot-toast'

interface ContactPageProps {
  className?: string
}

export default function Contact() {
  return (
    <section
      id="contact-section"
      className="flex w-full h-screen justify-center items-center"
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

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

  if (!serviceId || !templateId) {
    console.error('EmailJS environment variables are not set')
  }

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

          // Trigger success animation
          setReverseCanvasVisible(true)
          setTimeout(() => {
            setInitialCanvasVisible(false)
          }, 50)

          // Show success state
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
      className={`flex w-full flex-col min-h-screen sm:pb-16 pb-8 relative
        ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {/* Initial canvas (forward animation) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName=""
              colors={[
                [99, 102, 241], // indigo-500
                [196, 181, 253], // violet-300
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        {/* Reverse canvas (appears when form is submitted) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-white"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}

        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_rgba(225,225,225,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col flex-1">
        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Center content (contact form) */}
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
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Get in Touch
                        </span>
                      </motion.h1>
                      {/* <h1 className="text-4xl font-bold text-indigo-500">
                        Get in Touch
                      </h1> */}
                      <p className="text-lg text-indigo-400 font-extralight">
                        Let&apos;s start a conversation
                      </p>
                    </div>

                    {/* Contact Form */}
                    <div className="backdrop-blur-sm bg-white rounded-3xl border border-indigo-300 px-6 py-8 shadow-lg">
                      <form
                        ref={formRef}
                        className="flex flex-col gap-4"
                        onSubmit={handleFormSubmit}
                      >
                        {/* Name Field */}
                        <div className="relative">
                          <TextField
                            type="text"
                            name="userName"
                            placeholder="Your Name"
                            variant="outlined"
                            className="w-full bg-gray-100 rounded-lg"
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                borderRadius: '8px',
                                '& fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.5)',
                                },
                                '& input::placeholder': {
                                  color: 'rgba(165 180 252, 0.5)',
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                          <TextField
                            type="email"
                            name="userEmail"
                            placeholder="Your Email"
                            variant="outlined"
                            className="w-full bg-gray-100 rounded-lg"
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                borderRadius: '8px',
                                '& fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.5)',
                                },
                                '& input::placeholder': {
                                  color: 'rgba(165 180 252, 0.5)',
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        </div>

                        {/* Message Field */}
                        <div className="relative">
                          <TextField
                            multiline
                            name="message"
                            rows={4}
                            placeholder="Your Message..."
                            variant="outlined"
                            className="w-full bg-gray-100 rounded-lg"
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                borderRadius: '8px',
                                '& fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.2)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgba(165 180 252, 0.5)',
                                },
                                '& textarea::placeholder': {
                                  color: 'rgba(165 180 252, 0.5)',
                                  opacity: 1,
                                },
                              },
                            }}
                          />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                            loading
                              ? 'bg-white/20 text-white/50 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-[1.02]'
                          }`}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                              <span>Sending...</span>
                            </div>
                          ) : (
                            'Send Message'
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
                      <h1 className="text-4xl font-bold text-indigo-500">
                        Message Sent!
                      </h1>
                      <p className="text-lg text-indigo/70 font-light">
                        Thank you for reaching out
                      </p>
                    </div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="py-10"
                    >
                      <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-black"
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
                      <p className="text-indigo-500 font-light">
                        We&apos;ve received your message and will respond within 24
                        hours.
                      </p>

                      <motion.button
                        onClick={handleBackToForm}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors"
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
