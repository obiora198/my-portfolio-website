import { NextResponse } from 'next/server'
import axios from 'axios'
import { getCached, setCached, getStale } from '../cache'

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

    const cacheKey = `services_${identifier.toLowerCase()}`
    const cachedData = getCached(cacheKey, 1000 * 60 * 60) // 1 hour TTL

    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cache': 'HIT',
        },
      })
    }

    const apiKey = process.env.VTPASS_API_KEY
    const publicKey =
      process.env.VTPASS_PUBLIC_KEY || process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY
    const baseURL = (
      process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL
    )?.replace(/\/$/, '')

    const response = await axios.get(
      `${baseURL}/services?identifier=${identifier}`,
      {
        headers: {
          'api-key': apiKey,
          'public-key': publicKey,
          'Content-Type': 'application/json',
        },
        timeout: 12000,
      }
    )

    if (response.data && response.status === 200) {
      setCached(cacheKey, response.data)
    }

    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache': 'MISS',
      },
    })
  } catch (error: any) {
    const { searchParams } = new URL(request.url)
    const identifier = searchParams.get('identifier')
    if (identifier) {
      const staleData = getStale(`services_${identifier.toLowerCase()}`)
      if (staleData) {
        return NextResponse.json(staleData, {
          headers: { 'X-Cache': 'STALE' },
        })
      }
    }

    console.error('API Services Proxy Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    })
    return NextResponse.json(
      error.response?.data || {
        message: 'Internal Server Error',
        error: error.message,
      },
      { status: error.response?.status || 500 }
    )
  }
}
