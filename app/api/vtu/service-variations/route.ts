import { NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceID = searchParams.get('serviceID')
    const operator_id = searchParams.get('operator_id')
    const product_type_id = searchParams.get('product_type_id')

    if (!serviceID) {
      return NextResponse.json(
        { message: 'Missing serviceID parameter' },
        { status: 400 }
      )
    }

    const apiKey = process.env.VTPASS_API_KEY || process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const publicKey = process.env.VTPASS_PUBLIC_KEY || process.env.NEXT_PUBLIC_VTPASS_PUBLIC_KEY
    const baseURL = (process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL)?.replace(/\/$/, '')

    let url = `${baseURL}/service-variations?serviceID=${serviceID}`
    if (operator_id) url += `&operator_id=${operator_id}`
    if (product_type_id) url += `&product_type_id=${product_type_id}`

    const response = await axios.get(url, {
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
      'API Service Variations Error:',
      error.response?.data || error.message
    )
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}
