import { calculateServiceFee } from '../lib/vtuPricing'
import {
  verifyVariationAmount,
  PriceVerificationError,
} from '../lib/verifyServicePrice'

/**
 * Integration tests exercising:
 * 1. The independent invariant checks on persisted records in /api/payment/initialize/route.ts
 * 2. The real, exported verifyVariationAmount function from lib/verifyServicePrice.ts
 */
async function testInvariantLogic() {
  console.log('--- Running Invariant & Price Verification Integration Tests ---')
  let passed = 0
  let failed = 0

  function assertThrows(
    name: string,
    fn: () => void,
    expectedMessageSubstr: string
  ) {
    try {
      fn()
      console.error(`❌ [FAIL] ${name} - Expected function to throw, but it succeeded`)
      failed++
    } catch (err: any) {
      if (err.message && err.message.includes(expectedMessageSubstr)) {
        console.log(`✅ [PASS] ${name} (Threw as expected: "${err.message}")`)
        passed++
      } else {
        console.error(`❌ [FAIL] ${name} - Threw unexpected error: "${err.message}"`)
        failed++
      }
    }
  }

  function assertNoThrow(name: string, fn: () => void) {
    try {
      fn()
      console.log(`✅ [PASS] ${name}`)
      passed++
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name} - Threw error: "${err.message}"`)
      failed++
    }
  }

  // Helper matching /api/payment/initialize invariant block
  function runPersistedInvariant(
    savedTx: {
      serviceID: string
      amount: number
      serviceFee: number
      totalPaid: number
      activeTab?: string
    },
    verifiedAmount: number
  ) {
    const recomputedFee = calculateServiceFee(
      savedTx.serviceID,
      savedTx.amount,
      savedTx.activeTab
    )
    if (savedTx.amount !== verifiedAmount) {
      throw new Error(
        'Pricing invariant failed: persisted amount drifted from verified amount'
      )
    }
    if (savedTx.serviceFee !== recomputedFee) {
      throw new Error(
        `Pricing invariant failed: stored serviceFee (${savedTx.serviceFee}) != recomputed (${recomputedFee})`
      )
    }
    if (savedTx.totalPaid !== savedTx.amount + (savedTx.serviceFee || 0)) {
      throw new Error(
        'Pricing invariant failed: totalPaid does not equal amount + serviceFee'
      )
    }
    return Math.round(savedTx.totalPaid * 100)
  }

  // 1. Valid Cable TV transaction (DStv Confam: ₦4,615 + ₦100 = ₦4,715)
  assertNoThrow('Valid DStv Confam passes invariant check', () => {
    const kobo = runPersistedInvariant(
      {
        serviceID: 'dstv',
        amount: 4615,
        serviceFee: 100,
        totalPaid: 4715,
        activeTab: 'tv',
      },
      4615
    )
    if (kobo !== 471500) throw new Error('Kobo conversion mismatch')
  })

  // 2. Tampered DB: serviceFee mutated to ₦0 (attacker tried to skip service fee)
  assertThrows(
    'Mutated serviceFee (tampered in DB) throws invariant error',
    () => {
      runPersistedInvariant(
        {
          serviceID: 'dstv',
          amount: 4615,
          serviceFee: 0, // TAMPERED
          totalPaid: 4615,
          activeTab: 'tv',
        },
        4615
      )
    },
    'stored serviceFee (0) != recomputed (100)'
  )

  // 3. Tampered DB: amount drifted from server-verified amount
  assertThrows(
    'Mutated amount (under-priced) throws invariant error',
    () => {
      runPersistedInvariant(
        {
          serviceID: 'dstv',
          amount: 100, // TAMPERED down from 4615
          serviceFee: 50,
          totalPaid: 150,
          activeTab: 'tv',
        },
        4615
      )
    },
    'persisted amount drifted from verified amount'
  )

  // 4. Tampered DB: totalPaid does not match amount + serviceFee
  assertThrows(
    'Mutated totalPaid throws invariant error',
    () => {
      runPersistedInvariant(
        {
          serviceID: 'dstv',
          amount: 4615,
          serviceFee: 100,
          totalPaid: 4000, // TAMPERED
          activeTab: 'tv',
        },
        4615
      )
    },
    'totalPaid does not equal amount + serviceFee'
  )

  // 5. Real verifyVariationAmount: Fails closed with 503 on fetcher error (never trusts client amount)
  const throwingFetcher = async () => {
    throw new Error('VTpass connection timed out after 5000ms')
  }

  try {
    await verifyVariationAmount(
      'dstv',
      'dstv-confam-2',
      'dstv-confam',
      'https://sandbox.vtpass.com/api',
      'test-key',
      'test-secret',
      throwingFetcher,
      0, // 0 retries for instant test execution
      0
    )
    console.error('❌ [FAIL] Expected verifyVariationAmount to throw, but it resolved')
    failed++
  } catch (err: any) {
    if (err instanceof PriceVerificationError && err.status === 503) {
      console.log(
        '✅ [PASS] Real verifyVariationAmount fails closed with PriceVerificationError (503) on fetch failure'
      )
      passed++
    } else {
      console.error(`❌ [FAIL] Real verifyVariationAmount threw wrong error: ${err.message}`)
      failed++
    }
  }

  // 6. Real verifyVariationAmount: Throws 400 on invalid / unmatched variation code
  const unmatchedFetcher = async () => [
    { variation_code: 'dstv-padi', variation_amount: '2500' },
  ]

  try {
    await verifyVariationAmount(
      'dstv',
      'dstv-nonexistent',
      'dstv-nonexistent',
      'https://sandbox.vtpass.com/api',
      'test-key',
      'test-secret',
      unmatchedFetcher,
      0,
      0
    )
    console.error('❌ [FAIL] Expected verifyVariationAmount to throw 400, but it resolved')
    failed++
  } catch (err: any) {
    if (err instanceof PriceVerificationError && err.status === 400) {
      console.log(
        '✅ [PASS] Real verifyVariationAmount throws PriceVerificationError (400) on invalid plan'
      )
      passed++
    } else {
      console.error(`❌ [FAIL] Real verifyVariationAmount threw wrong error for 400: ${err.message}`)
      failed++
    }
  }

  // 7. Real verifyVariationAmount: Resolves verified amount on matching variation
  const validFetcher = async () => [
    { variation_code: 'dstv-confam', variation_amount: '4615' },
  ]

  try {
    const verified = await verifyVariationAmount(
      'dstv',
      'dstv-confam-1',
      'dstv-confam',
      'https://sandbox.vtpass.com/api',
      'test-key',
      'test-secret',
      validFetcher,
      0,
      0
    )
    if (verified === 4615) {
      console.log('✅ [PASS] Real verifyVariationAmount correctly resolves verified price (4615)')
      passed++
    } else {
      console.error(`❌ [FAIL] Expected 4615, got: ${verified}`)
      failed++
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] Unexpected error in valid variation test: ${err.message}`)
    failed++
  }

  console.log(`\nInvariant & Verification Tests: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

testInvariantLogic()
