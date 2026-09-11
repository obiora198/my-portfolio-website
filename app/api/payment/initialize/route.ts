import { NextResponse } from 'next/server'
import axios from 'axios'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { checkRateLimit } from '@/lib/rateLimiter'
import { generateRequestId } from '@/app/utils/vtuProviders'
import { calculateServiceFee } from '@/lib/vtuPricing'
import {
  verifyVariationAmount,
  PriceVerificationError,
} from '@/lib/verifyServicePrice'

const variationsCache = new Map<string, { data: any[]; expires: number }>()

async function getServiceVariations(
  serviceID: string,
  baseURL: string,
  apiKey: string,
  secretKey: string
): Promise<any[]> {
  const cached = variationsCache.get(serviceID)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }

  const varResponse = await axios.get(
    `${baseURL}/service-variations?serviceID=${serviceID}`,
    {
      headers: {
        'api-key': apiKey,
        'secret-key': secretKey,
      },
      timeout: 5000,
    }
  )

  const variations =
    varResponse.data.content?.variations ||
    varResponse.data.content?.varations ||
    []

  if (variations.length > 0) {
    variationsCache.set(serviceID, {
      data: variations,
      expires: Date.now() + 60 * 60 * 1000, // 1 hour cache
    })
  }

  return variations
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1'

    const { allowed } = checkRateLimit(clientIp, 5, 60000)
    if (!allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      )
    }

    await dbConnect()
    const body = await request.json()
    const {
      serviceID,
      amount,
      phone,
      billersCode,
      variation_code,
      name,
      email,
      whatsappNumber,
      activeTab,
      operator_id,
      country_code,
      product_type_id,
    } = body

    if (!serviceID || !phone) {
      return NextResponse.json(
        { message: 'Missing required parameters: serviceID and phone are required.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.VTPASS_API_KEY || process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const secretKey = process.env.VTPASS_SECRET_KEY || process.env.NEXT_PUBLIC_VTPASS_SECRET_KEY
    const baseURL = (process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL)?.replace(/\/$/, '')
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecret) {
      console.error('[Payment Initialize] PAYSTACK_SECRET_KEY is missing in environment.')
      return NextResponse.json(
        { message: 'Payment gateway is not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // 2. Server-side Price Verification
    let verifiedAmount: number = 0

    if (variation_code) {
      const cleanCode = variation_code.includes('-')
        ? variation_code.split('-').slice(0, -1).join('-')
        : variation_code

      try {
        verifiedAmount = await verifyVariationAmount(
          serviceID,
          variation_code,
          cleanCode,
          baseURL || 'https://sandbox.vtpass.com/api',
          apiKey || '',
          secretKey || '',
          getServiceVariations
        )
      } catch (err: any) {
        console.error(
          '[Payment Initialize] Failed to verify variation price:',
          err.message
        )
        if (err instanceof PriceVerificationError) {
          return NextResponse.json(
            { message: err.message },
            { status: err.status }
          )
        }
        return NextResponse.json(
          {
            message:
              'Unable to verify plan pricing right now. Please try again shortly.',
          },
          { status: 503 }
        )
      }
    } else {
      // Direct amount (e.g. Airtime, Electricity)
      verifiedAmount = Number(amount)
      if (isNaN(verifiedAmount) || verifiedAmount < 50 || verifiedAmount > 500000) {
        return NextResponse.json(
          { message: 'Please specify a valid amount between ₦50 and ₦500,000.' },
          { status: 400 }
        )
      }
    }

    if (!verifiedAmount || verifiedAmount <= 0) {
      return NextResponse.json(
        { message: 'Invalid transaction amount.' },
        { status: 400 }
      )
    }

    // 3. Prepare Customer Email & Identifiers
    const cleanPhone = phone.replace(/\D/g, '')
    const customerEmail =
      email && email.includes('@')
        ? email.trim()
        : `guest_${cleanPhone || Date.now()}@obiora.dev`

    const requestId = generateRequestId()
    const paymentReference = `VTU_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // 4. Server-side Service Fee & Pricing Derivation
    const serviceFee = calculateServiceFee(serviceID, verifiedAmount, activeTab)
    const platformTotal = verifiedAmount + serviceFee

    if (!Number.isFinite(verifiedAmount) || verifiedAmount <= 0) {
      return NextResponse.json({ message: 'Invalid transaction amount.' }, { status: 400 })
    }
    if (!Number.isFinite(serviceFee) || serviceFee < 0) {
      throw new Error(`Pricing error: Invalid computed serviceFee (${serviceFee})`)
    }

    // 5. Store pending transaction record in MongoDB
    const tx = await Transaction.create({
      requestId,
      serviceID,
      amount: verifiedAmount,
      serviceFee,
      totalPaid: platformTotal,
      phone,
      billersCode: billersCode || phone,
      variationCode: variation_code,
      status: 'initiated',
      description: `Payment pending for ${serviceID}`,
      email: customerEmail,
      customerName: name || undefined,
      whatsappNumber,
      paymentReference,
      paymentStatus: 'pending',
      paymentGateway: 'paystack',
      deliveryStatus: 'not_started',
      activeTab,
      operatorId: operator_id,
      countryCode: country_code,
      productTypeId: product_type_id,
    })

    // 6. Independent Invariant Verification on Persisted Record
    const savedTx = await Transaction.findById(tx._id).lean()
    if (!savedTx) {
      throw new Error('Failed to retrieve persisted transaction for invariant verification')
    }

    const recomputedFee = calculateServiceFee(savedTx.serviceID, savedTx.amount, savedTx.activeTab)
    if (savedTx.amount !== verifiedAmount) {
      throw new Error('Pricing invariant failed: persisted amount drifted from verified amount')
    }
    if (savedTx.serviceFee !== recomputedFee) {
      throw new Error(`Pricing invariant failed: stored serviceFee (${savedTx.serviceFee}) != recomputed (${recomputedFee})`)
    }
    if (savedTx.totalPaid !== savedTx.amount + (savedTx.serviceFee || 0)) {
      throw new Error('Pricing invariant failed: totalPaid does not equal amount + serviceFee')
    }

    const paystackKobo = Math.round(savedTx.totalPaid * 100)

    // 7. Initialize Paystack Transaction with Invariant-Verified Total
    const origin = request.headers.get('origin') || 'https://obiora.dev'
    const paystackPayload = {
      email: customerEmail,
      amount: paystackKobo, // In Kobo
      reference: paymentReference,
      callback_url: `${origin}/vtu?payment_ref=${paymentReference}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: name || 'Guest' },
          { display_name: 'Service', variable_name: 'service_id', value: serviceID },
          { display_name: 'Plan', variable_name: 'plan', value: variation_code || 'Custom Topup' },
          { display_name: 'Service Amount (₦)', variable_name: 'service_amount', value: String(verifiedAmount) },
          { display_name: 'Service Fee (₦)', variable_name: 'service_fee', value: String(serviceFee) },
          { display_name: 'Total (₦)', variable_name: 'total_amount', value: String(savedTx.totalPaid) },
          { display_name: 'Recipient Phone', variable_name: 'recipient_phone', value: phone },
          { display_name: 'Billers Code', variable_name: 'billers_code', value: billersCode || phone },
        ],
        customerName: name,
        serviceID,
        variationCode: variation_code,
        phone,
        billersCode: billersCode || phone,
        requestId,
        activeTab,
        customerEmail,
        serviceFee,
        totalPaid: savedTx.totalPaid,
      },
    }

    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!paystackRes.data?.status || !paystackRes.data?.data?.access_code) {
      throw new Error(paystackRes.data?.message || 'Failed to initialize Paystack transaction')
    }

    return NextResponse.json({
      success: true,
      access_code: paystackRes.data.data.access_code,
      reference: paymentReference,
      amount: verifiedAmount,
      serviceFee,
      totalAmount: savedTx.totalPaid,
    })
  } catch (error: any) {
    console.error('[Payment Initialize Error]', error.response?.data || error.message)
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to initialize payment transaction.',
      },
      { status: 500 }
    )
  }
}
