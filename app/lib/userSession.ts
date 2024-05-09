'use server'

import { cookies } from 'next/headers'
import { UserType } from '../configs/tsTypes'

export async function createUserSession(user: UserType) {
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

export async function getUserSession(): Promise<UserType> {
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
