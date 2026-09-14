import { NextResponse } from 'next/server'
import axios from 'axios'
import { getCached, setCached, getStale } from '../cache'

export async function GET() {
  try {
    const cacheKey = 'countries_international'
    const cachedData = getCached(cacheKey, 1000 * 60 * 60 * 24) // 24 hours TTL

    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
          'X-Cache': 'HIT',
        },
      })
    }

    const apiKey = process.env.VTPASS_API_KEY
    const publicKey =
      process.env.VTPASS_PUBLIC_KEY || process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY
    const baseURL = (
      process.env.VTPASS_BASE_URL ||
      process.env.NEXT_PUBLIC_VTPASS_BASE_URL ||
      'https://sandbox.vtpass.com/api'
    ).replace(/\/$/, '')

    const response = await axios.get(
      `${baseURL}/get-international-airtime-countries`,
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
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'X-Cache': 'MISS',
      },
    })
  } catch (error: any) {
    const staleData = getStale('countries_international')
    if (staleData) {
      return NextResponse.json(staleData, {
        headers: { 'X-Cache': 'STALE' },
      })
    }

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
