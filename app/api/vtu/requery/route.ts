import { NextResponse } from 'next/server'
import axios from 'axios'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { request_id } = body

    const apiKey = process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const secretKey = process.env.NEXT_PUBLIC_VTPASS_SECRET_KEY
    const baseURL = process.env.NEXT_PUBLIC_VTPASS_BASE_URL?.replace(/\/$/, '')

    console.log('VTpass Requery Request:', { request_id })

    const response = await axios.post(
      `${baseURL}/requery`,
      { request_id },
      {
        headers: {
          'api-key': apiKey,
          'secret-key': secretKey,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('VTpass Requery Response:', response.data)

    // Update MongoDB status if transaction exists
    try {
      if (response.data.content?.transactions?.status) {
        await Transaction.findOneAndUpdate(
          { requestId: request_id },
          {
            status: response.data.content.transactions.status,
            description: response.data.response_description,
          }
        )
      }
    } catch (dbError) {
      console.error('MongoDB Update Error:', dbError)
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('API Requery Error:', error.response?.data || error.message)
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}
