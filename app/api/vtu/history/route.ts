import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    // Privacy mask: preserve last 4 digits for user recognition while stripping private customer data
    const sanitizedTransactions = transactions.map((tx: any) => {
      const rawPhone = tx.phone ? String(tx.phone).trim() : ''
      const rawBillers = tx.billersCode ? String(tx.billersCode).trim() : ''

      return {
        _id: tx._id,
        requestId: tx.requestId,
        serviceID: tx.serviceID,
        amount: tx.amount,
        status: tx.status,
        timestamp: tx.timestamp,
        phone: rawPhone ? `••••${rawPhone.slice(-4)}` : undefined,
        billersCode: rawBillers ? `••••${rawBillers.slice(-4)}` : undefined,
      }
    })

    console.log(`Found ${sanitizedTransactions.length} transactions`)
    return NextResponse.json(sanitizedTransactions, {
      headers: {
        'Cache-Control':
          'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
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
