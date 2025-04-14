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
    <section id="contact-section">
      <div className="w-full h-[calc(100vh-60px)] sm:h-screen flex flex-col items-center justify-center sm:px-40 px-4 sm:pt-16 sm:pb-8">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 sm:mt-8 mb-8">
          Get in touch
        </h1>
        <div className="w-full max-w-[600px] bg-white flex flex-col gap-4 rounded-[32px] border-2 sm:p-8 p-4">
          <form
            id="myForm"
            className="w-full flex flex-col items-center gap-4 z-0"
            onSubmit={handleFormSubmit}
          >
            <TextField
              id="outlined-basic"
              type="text"
              variant="outlined"
              name="userName"
              placeholder="Your Name"
              className="w-full z-0"
            />
            <TextField
              id="outlined-basic"
              type="email"
              name="userEmail"
              variant="outlined"
              placeholder="Your Email"
              className="w-full z-0"
            />
            <TextField
              id="outlined-basic"
              multiline
              name="message"
              variant="outlined"
              rows={4}
              placeholder="Message..."
              className="w-full z-0"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-l px-8 py-2 flex items-center justify-center gap-2 rounded-full border-2 font-bold hover:bg-indigo-500 hover:text-white transition-all duration-500"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-indigo-600 inline-block"></div>
              ) : (
                ''
              )}
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
