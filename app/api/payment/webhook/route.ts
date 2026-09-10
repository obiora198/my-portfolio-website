import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { waitUntil } from '@vercel/functions'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { claimDeliveryLock, fulfillVTUOrder } from '@/lib/vtuFulfillment'

export const maxDuration = 60 // Allow Vercel runtime to stay active for requery loop

export async function POST(request: Request) {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecret) {
      console.error('[Payment Webhook] PAYSTACK_SECRET_KEY missing')
      return new Response('Webhook not configured', { status: 500 })
    }

    const signature = request.headers.get('x-paystack-signature')
    if (!signature) {
      return new Response('Missing signature', { status: 401 })
    }

    const rawBody = await request.text()
    const hash = crypto
      .createHmac('sha512', paystackSecret)
      .update(rawBody)
      .digest('hex')

    if (hash !== signature) {
      console.warn('[Payment Webhook] Invalid signature rejected.')
      return new Response('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(rawBody)
    console.log(`[Payment Webhook] Received Paystack event: ${event.event}`)

    // 1. Successful charge event -> idempotent fulfillment
    if (event.event === 'charge.success') {
      const data = event.data
      const reference = data.reference
      const paidAt = data.paid_at ? new Date(data.paid_at) : new Date()

      console.log(`[Payment Webhook] Processing charge.success for ref: ${reference}`)

      // Single atomic lock write: claims the lock if not_started or expired processing (> 2min)
      const lockAcquired = await claimDeliveryLock(reference, paidAt)

      if (lockAcquired) {
        console.log(`[Payment Webhook] Lock acquired for ${reference}. Triggering fulfillment...`)
        // Keep serverless invocation alive via waitUntil without blocking HTTP 200 response
        waitUntil(
          fulfillVTUOrder(reference).catch((err) => {
            console.error(`[Payment Webhook Background Error for ${reference}]:`, err)
          })
        )
      } else {
        console.log(`[Payment Webhook] Lock already held or order completed for ${reference}.`)
      }
    }

    // 2. Urgent Dispute / Chargeback created (Paystack gives 16h to respond in dashboard)
    if (
      event.event === 'charge.dispute.create' ||
      event.event === 'charge.dispute.remind'
    ) {
      const data = event.data
      const reference =
        data.transaction?.reference || data.transaction_reference || data.reference

      console.error(
        `🚨 [URGENT_CHARGEBACK_DISPUTE] Chargeback opened for ref: ${reference}! You have 16 hours to respond in your Paystack dashboard.`,
        {
          disputeId: data.id,
          amount: data.amount ? data.amount / 100 : undefined,
          reason: data.reason,
          dueAt: data.due_at,
          customerEmail: data.customer?.email,
        }
      )

      await dbConnect()
      await Transaction.updateOne(
        { paymentReference: reference },
        {
          $set: {
            disputeStatus: 'pending',
            disputeData: data,
          },
        }
      )
    }

    // 3. Dispute resolved
    if (event.event === 'charge.dispute.resolve') {
      const data = event.data
      const reference =
        data.transaction?.reference || data.transaction_reference || data.reference
      const resolvedStatus = data.status === 'resolved' ? 'resolved' : 'lost'

      console.log(
        `[Payment Webhook] Dispute resolved for ${reference}: ${resolvedStatus}`
      )

      await dbConnect()
      await Transaction.updateOne(
        { paymentReference: reference },
        {
          $set: {
            disputeStatus: resolvedStatus,
            disputeData: data,
          },
        }
      )
    }

    // Always respond 200 immediately to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error('[Payment Webhook Handler Error]', error)
    return NextResponse.json(
      { message: 'Webhook processing error', error: error.message },
      { status: 500 }
    )
  }
}
