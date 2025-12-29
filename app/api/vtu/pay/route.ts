import { NextResponse } from 'next/server'
import axios from 'axios'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const {
      request_id,
      serviceID,
      amount,
      phone,
      variation_code,
      billersCode,
      // International fields
      operator_id,
      country_code,
      product_type_id,
      email,
      whatsappNumber,
      activeTab,
    } = body

    const apiKey = process.env.NEXT_PUBLIC_VTPASS_API_KEY
    const secretKey = process.env.NEXT_PUBLIC_VTPASS_SECRET_KEY
    const baseURL = process.env.NEXT_PUBLIC_VTPASS_BASE_URL?.replace(/\/$/, '')

    console.log('VTpass Pay Request:', {
      request_id,
      serviceID,
      amount,
      phone,
    })

    const vtpassPayload: any = {
      request_id,
      serviceID,
      amount,
      phone,
      variation_code,
      billersCode,
    }

    // Add international fields if they exist
    if (operator_id) vtpassPayload.operator_id = operator_id
    if (country_code) vtpassPayload.country_code = country_code
    if (product_type_id) vtpassPayload.product_type_id = product_type_id
    if (email) vtpassPayload.email = email

    const response = await axios.post(`${baseURL}/pay`, vtpassPayload, {
      headers: {
        'api-key': apiKey,
        'secret-key': secretKey,
        'Content-Type': 'application/json',
      },
    })

    console.log('VTpass Pay Response:', response.data)

    // Save to MongoDB
    try {
      await Transaction.create({
        requestId: request_id,
        serviceID: serviceID,
        amount: amount,
        phone: phone,
        billersCode: billersCode || phone,
        variationCode: variation_code,
        status: response.data.content?.transactions?.status || 'initiated',
        description: response.data.response_description,
        email: email,
        whatsappNumber: whatsappNumber,
        operatorId: operator_id,
        countryCode: country_code,
        productTypeId: product_type_id,
        activeTab: activeTab,
      })
    } catch (dbError) {
      console.error('MongoDB Save Error:', dbError)
      // We don't want to fail the request if DB save fails,
      // but in a production app you'd likely want to handle this better.
    }

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('API Pay Error:', error.response?.data || error.message)
    return NextResponse.json(
      error.response?.data || { message: 'Internal Server Error' },
      { status: error.response?.status || 500 }
    )
  }
}
