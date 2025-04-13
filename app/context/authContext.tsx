'use client'

import React from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import firebase_app from '../../firebase/config'
import Loading from '../components/Loading'

const auth = getAuth(firebase_app)

interface User {
  uid: string
  displayName?: string | null
  email?: string | null
  // Add other properties as needed
}

interface AuthContextType {
  user: User | null
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
)

export const useAuthContext = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthContextProvider')
  }
  return context
}

interface AuthContextProviderProps {
  children: React.ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <Loading dark={null} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
