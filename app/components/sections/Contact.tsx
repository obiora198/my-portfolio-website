'use client'

import React from 'react'
import { TextField, Button } from '@mui/material'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [loading, setLoading] = React.useState<boolean>(false)

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  if (!serviceId || !templateId) {
    throw new Error('EMAILJS_SERVICE_ID environment variable is not set')
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    emailjs
      .sendForm(serviceId, templateId, '#myForm', {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      })
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text)
          alert('message sent successfully')
          setLoading(false)
        },
        (error) => {
          console.log('FAILED...', error)
          alert('Failed to send email')
          setLoading(false)
        }
      )
  }

  return (
    <section
      id="contact-section"
      className="w-full min-h-[calc(100vh-60px)] flex flex-col items-center justify-center sm:px-40 px-4 py-16"
    >
      <h1 className="text-4xl font-bold text-indigo-500 text-center border-b-2 mb-12">
        Get in Touch
      </h1>

      <div className="w-full max-w-[600px] bg-white rounded-3xl border-2 p-6 sm:p-8 shadow-sm">
        <form
          id="contact-form"
          className="flex flex-col gap-6"
          onSubmit={handleFormSubmit}
        >
          {/* Name Field */}
          <TextField
            type="text"
            name="userName"
            placeholder="Your Name"
            variant="outlined"
            className="w-full"
            required
          />

          {/* Email Field */}
          <TextField
            type="email"
            name="userEmail"
            placeholder="Your Email"
            variant="outlined"
            className="w-full"
            required
          />

          {/* Message Field */}
          <TextField
            multiline
            name="message"
            rows={4}
            placeholder="Your Message..."
            variant="outlined"
            className="w-full"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-indigo-500 text-indigo-500 font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-indigo-600"></div>
            ) : (
              'Submit'
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
