import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function GET(request: Request) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { message: 'Missing search query' },
        { status: 400 }
      )
    }

    // Search by requestId, phone, or billersCode
    const transactions = await Transaction.find({
      $or: [{ requestId: query }, { phone: query }, { billersCode: query }],
    }).sort({ timestamp: -1 })

    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error('API Search Error:', error.message)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
