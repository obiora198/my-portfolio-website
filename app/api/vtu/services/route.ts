import { NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier')

    if (!identifier) {
      return NextResponse.json(
        { message: 'Missing identifier parameter' },
        { status: 400 }
      )
    }

    const apiKey = process.env.VTPASS_API_KEY || process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const publicKey = process.env.VTPASS_PUBLIC_KEY || process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY
    const baseURL = (process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL)?.replace(/\/$/, '')

    const response = await axios.get(
      `${baseURL}/services?identifier=${identifier}`,
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
    console.error('API Services Proxy Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    })
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error', error: error.message },
      { status: error.response?.status || 500 }
    )
  }
}
