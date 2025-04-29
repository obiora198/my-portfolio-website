'use client'

import React, { useState, FormEventHandler } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'
import firebase_app from '../../../firebase/config'

export default function Login() {
  const router = useRouter()
  const auth = getAuth(firebase_app)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const clearForm = () => {
    setEmail('')
    setPassword('')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      router.push('/auth/admin')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-60px)] flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-4xl font-bold text-indigo-500 text-center border-b-2 mb-8">
        Admin Login
      </h1>

      <div className="w-full max-w-md bg-white rounded-3xl border-2 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full border-2 border-indigo-500 text-indigo-500 font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-indigo-600"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
