import React from "react";
import { TextField, Button } from "@mui/material";

export default function ContactForm() {
  return (
    <>
      <div id="contact-section" className="w-full sm:h-screen flex flex-col items-center justify-center py-8">
        <h1 className="text-5xl font-bold mb-4 sm:my-16">Get in touch</h1>
        <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8">
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

            <Button
              variant="contained"
              className='bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full mt-4'
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
