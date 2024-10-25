'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FormEventHandler } from 'react'
import { TextField, Button } from '@mui/material'
import signIn from '@/firebase/auth/signIn'

export default function Login() {
  const router = useRouter()
  // const {setUser} = useUser()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const clearForm = () => {
    setEmail('')
    setPassword('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const user = await signIn(email, password)
      if (user) {
        router.push('/')
      }
    } catch (e) {
      console.log('could not log in')
    }
    setLoading(false)
  }

  return (
    <div
      id="contact-section"
      className="w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center py-8"
    >
      <h3 className="text-5xl font-bold mb-8">Admin Login</h3>
      <div className="min-w-[50%]  bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8 relative">
        <form
          className="w-full flex flex-col items-center gap-4"
          method="POST"
          onSubmit={handleSubmit}
        >
          <TextField
            id="outlined-basic"
            type="email"
            variant="outlined"
            placeholder="email"
            className="w-full"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            type="password"
            variant="outlined"
            placeholder="password"
            className="w-full"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            className="bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full mt-4"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
