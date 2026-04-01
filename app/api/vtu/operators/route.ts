import { NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const product_type_id = searchParams.get('product_type_id')

    if (!code || !product_type_id) {
      return NextResponse.json(
        { message: 'Missing parameters' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const publicKey = process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY
    const baseURL = process.env.NEXT_PUBLIC_VTPASS_BASE_URL?.replace(/\/$/, '')

    const response = await axios.get(
      `${baseURL}/get-international-airtime-operators?code=${code}&product_type_id=${product_type_id}`,
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
      'API Operators Proxy Error:',
      error.response?.data || error.message
    )
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}
