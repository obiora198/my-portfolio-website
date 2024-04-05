import React from "react";

import { TextField, Button } from "@mui/material";



export default function Login() {
  const handleSubmit = async () => {
    const res = await fetch('https://my-portfolio-api-1v51.onrender.com/api/v1/login')
  }
  return (
    <div
      id="contact-section"
      className="w-full sm:h-screen flex flex-col items-center justify-center py-8"
    >
      <h1 className="text-5xl font-bold mb-4 sm:my-16">Admin Login</h1>
      <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8">
        <form
          className="w-full flex flex-col items-center gap-4"
          method="POST"
          action="https://my-portfolio-api-1v51.onrender.com/api/v1/login"
        >
          <TextField
            id="outlined-basic"
            type="text"
            variant="outlined"
            placeholder="email"
            className="w-full"
          />
          <TextField
            id="outlined-basic"
            type="email"
            variant="outlined"
            placeholder="password"
            className="w-full"
          />
          <Button
            variant="contained"
            className="bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full mt-4"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
