import React from 'react'
import { TextField, Button } from '@mui/material'

export default function Contact() {
  return (
    <section
      id="contact-section"
    >
      <div className="w-full h-screen flex flex-col items-center justify-center px-40 pt-16 pb-4">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 mt-8 mb-4">Get in touch</h1>
        <div className="w-full max-w-[600px] bg-white flex flex-col gap-4 rounded-[32px] border-2 p-8">
          <form className="w-full flex flex-col items-center gap-4">
            <TextField
              id="outlined-basic"
              type="text"
              variant="outlined"
              placeholder="Your Name"
              className="w-full"
            />
            <TextField
              id="outlined-basic"
              type="email"
              variant="outlined"
              placeholder="Your Email"
              className="w-full"
            />
            <TextField
              id="outlined-basic"
              multiline
              variant="outlined"
              rows={4}
              placeholder="Message..."
              className="w-full"
            />
            <button
              type='submit'
              className="text-l px-8 py-2 rounded-full border-2 font-bold hover:bg-indigo-500 hover:text-white transition-all duration-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
