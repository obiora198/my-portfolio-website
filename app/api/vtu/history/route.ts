import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function GET(request: Request) {
  try {
    console.log('Fetching transaction history...')
    await dbConnect()

    // Ensure model is registered
    if (!Transaction) {
      throw new Error('Transaction model not initialized')
    }

    const transactions = await Transaction.find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .lean() // Use lean for performance

    console.log(`Found ${transactions.length} transactions`)
    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error('API History Error Details:', {
      message: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
