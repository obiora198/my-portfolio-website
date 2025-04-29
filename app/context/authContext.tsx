'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import firebase_app from '@/firebase/config'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth(firebase_app)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easier usage
export function useAuth() {
  return useContext(AuthContext)
}
