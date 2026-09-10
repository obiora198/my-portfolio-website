import axios from 'axios'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

interface RequeryResult {
  status: 'delivered' | 'failed' | 'pending'
  token?: string
  data?: any
}

/**
 * Atomic helper to claim the delivery lock on a transaction.
 * Self-heals: allows claiming if `not_started`, or if previously `processing` but locked over 2 minutes ago.
 */
export async function claimDeliveryLock(
  paymentReference: string,
  paystackPaidAt?: Date
) {
  await dbConnect()
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)

  const tx = await Transaction.findOneAndUpdate(
    {
      paymentReference,
      $or: [
        { deliveryStatus: 'not_started' },
        { deliveryStatus: { $exists: false } },
        { deliveryStatus: null },
        { deliveryStatus: 'processing', lockedAt: { $lt: twoMinutesAgo } },
      ],
    },
    {
      $set: {
        paymentStatus: 'success',
        deliveryStatus: 'processing',
        lockedAt: new Date(),
        ...(paystackPaidAt ? { paidAt: paystackPaidAt } : {}),
      },
    },
    { new: false } // Returns pre-update doc to verify we won the lock
  )

  return tx
}

/**
 * Poll VTpass /requery endpoint with backoff sequence (5s -> 10s -> 15s)
 */
async function pollVTpassRequery(
  requestId: string,
  baseURL: string,
  headers: any
): Promise<RequeryResult> {
  const delays = [5000, 10000, 15000]

  for (let i = 0; i < delays.length; i++) {
    console.log(
      `[VTpass Requery] Attempt ${i + 1}/${delays.length} for request ${requestId} in ${delays[i] / 1000}s...`
    )
    await new Promise((resolve) => setTimeout(resolve, delays[i]))

    try {
      const response = await axios.post(
        `${baseURL}/requery`,
        { request_id: requestId },
        { headers }
      )

      const code = response.data?.code
      const status = response.data?.content?.transactions?.status

      if (code === '000') {
        if (status === 'delivered' || status === 'successful') {
          const token =
            response.data.purchased_code ||
            response.data.mainToken ||
            response.data.content?.transactions?.token
          return { status: 'delivered', token, data: response.data }
        } else if (status === 'failed') {
          return { status: 'failed', data: response.data }
        }
      }
    } catch (err: any) {
      console.error(
        `[VTpass Requery] Network error on attempt ${i + 1}:`,
        err.message
      )
    }
  }

  return { status: 'pending' }
}

/**
 * Idempotent fulfillment worker for paid VTU transactions.
 */
export async function fulfillVTUOrder(paymentReference: string) {
  try {
    await dbConnect()

    const tx = await Transaction.findOne({ paymentReference })
    if (!tx) {
      console.error(`[VTU Fulfillment] No transaction found for reference: ${paymentReference}`)
      return { success: false, message: 'Transaction not found' }
    }

    // Idempotency: if already delivered, do not re-vend
    if (tx.deliveryStatus === 'delivered') {
      return {
        success: true,
        alreadyDelivered: true,
        token: tx.token,
        status: tx.deliveryStatus,
      }
    }

    const apiKey = process.env.VTPASS_API_KEY || process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const secretKey = process.env.VTPASS_SECRET_KEY || process.env.NEXT_PUBLIC_VTPASS_SECRET_KEY
    const baseURL = (process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL)?.replace(/\/$/, '')

    if (!apiKey || !baseURL) {
      throw new Error('VTpass API credentials or baseURL missing in environment')
    }

    const headers = {
      'api-key': apiKey,
      'secret-key': secretKey,
      'Content-Type': 'application/json',
    }

    const vtpassPayload: any = {
      request_id: tx.requestId,
      serviceID: tx.serviceID,
      amount: tx.amount,
      phone: tx.phone,
      variation_code: tx.variationCode,
      billersCode: tx.billersCode || tx.phone,
    }

    if (tx.serviceID === 'foreign-airtime') {
      if (tx.operatorId) vtpassPayload.operator_id = tx.operatorId
      if (tx.countryCode) vtpassPayload.country_code = tx.countryCode
      if (tx.productTypeId) vtpassPayload.product_type_id = tx.productTypeId
      if (tx.email) vtpassPayload.email = tx.email
    }

    if (tx.activeTab === 'tv') {
      vtpassPayload.subscription_type = 'change'
    }

    console.log(`[VTU Fulfillment] Dispatching VTpass pay for reference: ${paymentReference}...`)

    let response: any
    try {
      response = await axios.post(`${baseURL}/pay`, vtpassPayload, { headers })
    } catch (payError: any) {
      console.error('[VTU Fulfillment] Pay request error:', payError.response?.data || payError.message)
      response = payError.response || { data: { code: 'NETWORK_ERROR', message: payError.message } }
    }

    const code = response.data?.code
    const status = response.data?.content?.transactions?.status
    const description = response.data?.response_description || response.data?.message

    console.log(`[VTU Fulfillment] VTpass initial response code: ${code}, status: ${status}`)

    // 1. Immediate Success
    if (code === '000' && (status === 'delivered' || status === 'successful')) {
      const token =
        response.data.purchased_code ||
        response.data.mainToken ||
        response.data.content?.transactions?.token

      await Transaction.updateOne(
        { paymentReference },
        {
          $set: {
            deliveryStatus: 'delivered',
            status: 'successful',
            token: token,
            description: description || 'Transaction successful',
            vtpassResponse: response.data,
            refundRequired: false,
          },
        }
      )

      return { success: true, status: 'delivered', token }
    }

    // 2. Pending / Processing / Requery codes (099 / 089 or status pending)
    if (
      code === '099' ||
      code === '089' ||
      status === 'pending' ||
      status === 'processing' ||
      status === 'initiated'
    ) {
      const pollResult = await pollVTpassRequery(tx.requestId, baseURL, headers)

      if (pollResult.status === 'delivered') {
        await Transaction.updateOne(
          { paymentReference },
          {
            $set: {
              deliveryStatus: 'delivered',
              status: 'successful',
              token: pollResult.token,
              description: 'Transaction delivered after requery',
              vtpassResponse: pollResult.data,
              refundRequired: false,
            },
          }
        )
        return { success: true, status: 'delivered', token: pollResult.token }
      } else if (pollResult.status === 'failed') {
        await Transaction.updateOne(
          { paymentReference },
          {
            $set: {
              deliveryStatus: 'failed',
              status: 'failed',
              description: 'Provider failed after requery',
              vtpassResponse: pollResult.data,
              refundRequired: true,
            },
          }
        )

        console.error(
          '[MANUAL_REFUND_REQUIRED] VTU delivery failed for paid transaction',
          {
            paymentReference,
            requestId: tx.requestId,
            amount: tx.amount,
            phone: tx.phone,
            error: 'Provider failed after requery',
          }
        )

        return { success: false, status: 'failed', refundRequired: true }
      } else {
        // Still pending after all requeries — mark for review without prematurely failing
        await Transaction.updateOne(
          { paymentReference },
          {
            $set: {
              deliveryStatus: 'pending_review',
              status: 'pending',
              description: 'Transaction still processing with provider. Awaiting resolution.',
              vtpassResponse: response.data,
              refundRequired: false,
            },
          }
        )

        return { success: true, status: 'pending_review' }
      }
    }

    // 3. Explicit Failure
    await Transaction.updateOne(
      { paymentReference },
      {
        $set: {
          deliveryStatus: 'failed',
          status: 'failed',
          description: description || 'Transaction failed at provider',
          vtpassResponse: response.data,
          refundRequired: true,
        },
      }
    )

    console.error(
      '[MANUAL_REFUND_REQUIRED] VTU delivery failed for paid transaction',
      {
        paymentReference,
        requestId: tx.requestId,
        amount: tx.amount,
        phone: tx.phone,
        error: description,
      }
    )

    return { success: false, status: 'failed', refundRequired: true, error: description }
  } catch (error: any) {
    console.error('[VTU Fulfillment Exception]', error)
    return { success: false, error: error.message }
  }
}
