import { NextResponse } from 'next/server'
import axios from 'axios'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { claimDeliveryLock, fulfillVTUOrder } from '@/lib/vtuFulfillment'

export const maxDuration = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { message: 'Payment reference query parameter is required.' },
        { status: 400 }
      )
    }

    await dbConnect()

    let tx = await Transaction.findOne({ paymentReference: reference })

    // Fallback: If not found by paymentReference, recover via Paystack metadata
    if (!tx) {
      const paystackSecret = process.env.PAYSTACK_SECRET_KEY
      if (paystackSecret) {
        try {
          const paystackRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
              headers: { Authorization: `Bearer ${paystackSecret}` },
            }
          )

          const pData = paystackRes.data?.data
          const metaRequestId = pData?.metadata?.requestId

          if (metaRequestId) {
            tx = await Transaction.findOne({ requestId: metaRequestId })
            if (tx) {
              console.log(
                `[Payment Verify] Recovered unlinked transaction by requestId: ${metaRequestId}`
              )
              await Transaction.updateOne(
                { _id: tx._id },
                {
                  $set: {
                    paymentReference: reference,
                    paymentStatus: pData.status === 'success' ? 'success' : tx.paymentStatus,
                  },
                }
              )
              tx = await Transaction.findById(tx._id)
            }
          }
        } catch (err: any) {
          console.error(
            `[Payment Verify Recovery Error for ${reference}]:`,
            err.message
          )
        }
      }
    }

    if (!tx) {
      return NextResponse.json(
        { message: 'Transaction record not found.' },
        { status: 404 }
      )
    }

    // 1. If already delivered, return immediately with receipt & token
    if (tx.deliveryStatus === 'delivered') {
      return NextResponse.json({
        success: true,
        paymentStatus: tx.paymentStatus,
        deliveryStatus: tx.deliveryStatus,
        token: tx.token,
        amount: tx.amount,
        serviceID: tx.serviceID,
        phone: tx.phone,
        billersCode: tx.billersCode,
        requestId: tx.requestId,
        description: tx.description,
      })
    }

    // 2. Mark stale pending sessions as abandoned (> 30 minutes without payment)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    if (tx.paymentStatus === 'pending' && tx.timestamp < thirtyMinutesAgo) {
      await Transaction.updateOne(
        { paymentReference: reference, paymentStatus: 'pending' },
        { $set: { paymentStatus: 'abandoned' } }
      )
      return NextResponse.json({
        success: false,
        paymentStatus: 'abandoned',
        deliveryStatus: tx.deliveryStatus,
        message: 'Payment session expired. Please initialize a new purchase.',
      })
    }

    // 3. If delivery is currently processing, check lock age
    if (tx.deliveryStatus === 'processing') {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
      if (tx.lockedAt && tx.lockedAt > twoMinutesAgo) {
        // Active worker is currently fulfilling
        return NextResponse.json({
          success: true,
          paymentStatus: tx.paymentStatus,
          deliveryStatus: 'processing',
          message: 'Payment confirmed. Delivery is currently in progress...',
        })
      }

      // If lock is older than 2 minutes (stale crash recovery), reclaim lock and resume
      console.log(`[Payment Verify] Recovering stale processing lock for reference: ${reference}`)
      const lockAcquired = await claimDeliveryLock(reference)
      if (lockAcquired) {
        await fulfillVTUOrder(reference)
        tx = await Transaction.findOne({ paymentReference: reference })
      }
    }

    // 4. If delivery has not started, query Paystack directly to verify payment
    if (!tx.deliveryStatus || tx.deliveryStatus === 'not_started') {
      const paystackSecret = process.env.PAYSTACK_SECRET_KEY
      if (!paystackSecret) {
        return NextResponse.json(
          { message: 'Payment gateway configuration missing' },
          { status: 500 }
        )
      }

      try {
        const paystackRes = await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: { Authorization: `Bearer ${paystackSecret}` },
          }
        )

        const pData = paystackRes.data?.data
        if (pData?.status === 'success') {
          const paidAt = pData.paid_at ? new Date(pData.paid_at) : new Date()
          const chargedAmount =
            typeof pData.amount === 'number' ? pData.amount / 100 : undefined
          // Claim atomic lock
          const lockAcquired = await claimDeliveryLock(
            reference,
            paidAt,
            chargedAmount
          )
          if (lockAcquired) {
            console.log(`[Payment Verify] Won atomic lock for ${reference}. Fulfilling...`)
            await fulfillVTUOrder(reference)
            tx = await Transaction.findOne({ paymentReference: reference })
          }
        } else if (pData?.status === 'failed' || pData?.status === 'abandoned') {
          await Transaction.updateOne(
            { paymentReference: reference },
            { $set: { paymentStatus: pData.status } }
          )
          return NextResponse.json({
            success: false,
            paymentStatus: pData.status,
            deliveryStatus: tx.deliveryStatus,
            message: `Payment ${pData.status}.`,
          })
        }
      } catch (err: any) {
        console.error(`[Payment Verify Paystack Error for ${reference}]:`, err.message)
      }
    }

    // Return current status snapshot
    return NextResponse.json({
      success: tx.deliveryStatus === 'delivered',
      paymentStatus: tx.paymentStatus,
      deliveryStatus: tx.deliveryStatus,
      token: tx.token,
      amount: tx.amount,
      serviceFee: tx.serviceFee,
      totalPaid: tx.totalPaid,
      paystackChargedAmount: tx.paystackChargedAmount,
      serviceID: tx.serviceID,
      phone: tx.phone,
      billersCode: tx.billersCode,
      requestId: tx.requestId,
      description: tx.description,
      refundRequired: tx.refundRequired,
      message:
        tx.deliveryStatus === 'delivered'
          ? 'Transaction successful!'
          : tx.deliveryStatus === 'processing'
            ? 'Processing delivery with provider...'
            : tx.deliveryStatus === 'pending_review'
              ? 'Transaction is processing with provider and awaiting resolution.'
              : tx.deliveryStatus === 'failed'
                ? tx.description || 'Transaction delivery failed.'
                : 'Awaiting payment confirmation.',
    })
  } catch (error: any) {
    console.error('[Payment Verify Route Error]', error)
    return NextResponse.json(
      { message: 'Verification error', error: error.message },
      { status: 500 }
    )
  }
}
