import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    const apiKey = process.env.VTPASS_API_KEY || process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const publicKey = process.env.VTPASS_PUBLIC_KEY || process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY
    const baseURL = (process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL)?.replace(/\/$/, '')

    const response = await axios.get(
      `${baseURL}/get-international-airtime-countries`,
      {
        headers: {
          'api-key': apiKey,
          'public-key': publicKey,
          'Content-Type': 'application/json',
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(
      'API Countries Proxy Error:',
      error.response?.data || error.message
    )
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}
