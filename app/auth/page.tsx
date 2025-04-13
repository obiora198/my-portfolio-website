'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FormEventHandler } from 'react'
import { TextField, Button } from '@mui/material'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import firebase_app from '@/firebase/config'

export default function Login() {
  const router = useRouter()
  // const {setUser} = useUser()
  const auth = getAuth(firebase_app)

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

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          router.push('/auth/admin')
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    setLoading(false)
  }

  return (
    <div
      className="w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center py-8"
    >
      <h1 className="text-4xl font-bold text-gray-900 inline-block text-center border-b-2 mb-4">
        Admin Login
      </h1>
      <div className="w-[400px] bg-white flex flex-col gap-4 rounded-[32px] p-8 border-2">
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
            className="px-4 py-2 text-sm rounded-full mt-4"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
