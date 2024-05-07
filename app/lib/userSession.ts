'use server'

import { cookies } from 'next/headers'

interface User {
  name: string | null
  token: string | null
}

export async function createUserSession(user: User) {
  cookies().set(
    'user',
    JSON.stringify({ name: user.name, token: user.token }),
    {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: 'strict',
    }
  )
}

export async function getUserSession(): Promise<User> {
  const user = cookies().get('user')?.value
  if (user) {
    return JSON.parse(user)
  } else {
    return { name: null, token: null }
  }
}

export async function deleteSession() {
  cookies().delete('user')
}
