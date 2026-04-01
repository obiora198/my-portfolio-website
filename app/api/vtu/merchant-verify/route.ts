import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { billersCode, serviceID, type } = body

    if (!billersCode || !serviceID) {
      return NextResponse.json(
        { message: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const secretKey = process.env.NEXT_PUBLIC_VTPASS_SECRET_KEY
    const baseURL = process.env.NEXT_PUBLIC_VTPASS_BASE_URL?.replace(/\/$/, '')

    const payload: any = {
      billersCode,
      serviceID,
    }

    if (type) payload.type = type

    const response = await axios.post(`${baseURL}/merchant-verify`, payload, {
      headers: {
        'api-key': apiKey,
        'secret-key': secretKey,
        'Content-Type': 'application/json',
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error(
      'API Merchant Verify Error:',
      error.response?.data || error.message
    )
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}
