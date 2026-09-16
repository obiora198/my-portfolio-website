import { NextResponse } from 'next/server'

/**
 * DEPRECATED & DISABLED:
 * Direct unauthenticated disbursement via /api/vtu/pay is disabled for security.
 * All VTU orders must follow the verified payment pipeline:
 * /api/payment/initialize -> Paystack -> /api/payment/webhook & /api/payment/verify -> fulfillVTUOrder
 */
export async function POST() {
  return NextResponse.json(
    {
      message:
        'Direct disbursement endpoint is disabled for security. All transactions must be initialized and verified via /api/payment/initialize.',
    },
    { status: 403 }
  )
}

