import { NextResponse } from 'next/server'
import axios from 'axios'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { checkRateLimit } from '@/lib/rateLimiter'
import { generateRequestId } from '@/app/utils/vtuProviders'

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
        const variations = await getServiceVariations(
          serviceID,
          baseURL || 'https://sandbox.vtpass.com/api',
          apiKey || '',
          secretKey || ''
        )

        const matched = variations.find(
          (v: any) =>
            v.variation_code === cleanCode ||
            String(v.variation_code) === cleanCode ||
            v.variation_code === variation_code
        )

        if (!matched) {
          return NextResponse.json(
            { message: `Invalid plan selected (${cleanCode}).` },
            { status: 400 }
          )
        }

        verifiedAmount = Number(matched.variation_amount)
      } catch (err: any) {
        console.error('[Payment Initialize] Failed to verify variation price:', err.message)
        // Fallback to validated client amount if variation API temporarily fails
        verifiedAmount = Number(amount)
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

    // 4. Initialize Paystack Transaction
    const origin = request.headers.get('origin') || 'https://obiora.dev'
    const paystackPayload = {
      email: customerEmail,
      amount: Math.round(verifiedAmount * 100), // In Kobo
      reference: paymentReference,
      callback_url: `${origin}/vtu?payment_ref=${paymentReference}`,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: name || 'Guest' },
          { display_name: 'Service', variable_name: 'service_id', value: serviceID },
          { display_name: 'Plan', variable_name: 'plan', value: variation_code || 'Custom Topup' },
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

    // 5. Store pending transaction record in MongoDB
    await Transaction.create({
      requestId,
      serviceID,
      amount: verifiedAmount,
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

    return NextResponse.json({
      success: true,
      access_code: paystackRes.data.data.access_code,
      reference: paymentReference,
      amount: verifiedAmount,
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
