import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import ContactMessage from '@/models/ContactMessage'

export async function POST(req: Request) {
  try {
    const { name, email, message, source } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    await dbConnect()

    const contact = await ContactMessage.create({
      name,
      email,
      message,
      source: source || 'portfolio_contact',
    })

    return NextResponse.json({
      success: true,
      message: 'Message stored successfully.',
      id: contact._id,
    })
  } catch (error: any) {
    console.error('Error saving contact message:', error)
    return NextResponse.json(
      { error: 'Failed to save contact message.' },
      { status: 500 }
    )
  }
}
