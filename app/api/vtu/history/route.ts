import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function GET(request: Request) {
  try {
    await dbConnect()

    // In a real app, you might filter by user ID from a session
    // For now, we'll return the most recent 20 transactions
    const transactions = await Transaction.find({})
      .sort({ timestamp: -1 })
      .limit(20)

    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error('API History Error:', error.message)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
