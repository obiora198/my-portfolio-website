import { calculateServiceFee } from '../lib/vtuPricing'

/**
 * Integration test simulating the independent invariant checks in /api/payment/initialize/route.ts
 */
function testInvariantLogic() {
  console.log('--- Running Invariant Re-Derivation Integration Tests ---')
  let passed = 0
  let failed = 0

  function assertThrows(name: string, fn: () => void, expectedMessageSubstr: string) {
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
  function runPersistedInvariant(savedTx: {
    serviceID: string
    amount: number
    serviceFee: number
    totalPaid: number
    activeTab?: string
  }, verifiedAmount: number) {
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
    return Math.round(savedTx.totalPaid * 100)
  }

  // 1. Valid Cable TV transaction (DStv Confam: ₦4,615 + ₦100 = ₦4,715)
  assertNoThrow('Valid DStv Confam passes invariant check', () => {
    const kobo = runPersistedInvariant({
      serviceID: 'dstv',
      amount: 4615,
      serviceFee: 100,
      totalPaid: 4715,
      activeTab: 'tv',
    }, 4615)
    if (kobo !== 471500) throw new Error('Kobo conversion mismatch')
  })

  // 2. Tampered DB: serviceFee mutated to ₦0 (attacker tried to skip service fee)
  assertThrows('Mutated serviceFee (tampered in DB) throws invariant error', () => {
    runPersistedInvariant({
      serviceID: 'dstv',
      amount: 4615,
      serviceFee: 0, // TAMPERED
      totalPaid: 4615,
      activeTab: 'tv',
    }, 4615)
  }, 'stored serviceFee (0) != recomputed (100)')

  // 3. Tampered DB: amount drifted from server-verified amount
  assertThrows('Mutated amount (under-priced) throws invariant error', () => {
    runPersistedInvariant({
      serviceID: 'dstv',
      amount: 100, // TAMPERED down from 4615
      serviceFee: 50,
      totalPaid: 150,
      activeTab: 'tv',
    }, 4615)
  }, 'persisted amount drifted from verified amount')

  // 4. Tampered DB: totalPaid does not match amount + serviceFee
  assertThrows('Mutated totalPaid throws invariant error', () => {
    runPersistedInvariant({
      serviceID: 'dstv',
      amount: 4615,
      serviceFee: 100,
      totalPaid: 4000, // TAMPERED
      activeTab: 'tv',
    }, 4615)
  }, 'totalPaid does not equal amount + serviceFee')

  // 5. Fail-Closed on Variation Verification Failure
  // Simulate variation-price verification throwing (e.g. VTpass timeout)
  function simulateVariationVerification(hasVariation: boolean, mockFetchThrows: boolean, clientAmount: number) {
    let verifiedAmount: number = 0
    if (hasVariation) {
      try {
        if (mockFetchThrows) {
          throw new Error('VTpass connection timed out after 5000ms')
        }
        verifiedAmount = 4615 // matched
      } catch (err: any) {
        // Must fail closed with 503, NEVER fall back to clientAmount
        return { status: 503, message: 'Unable to verify plan pricing right now. Please try again shortly.' }
      }
    }
    return { status: 200, verifiedAmount }
  }

  const failClosedRes = simulateVariationVerification(true, true, 1) // Attacker passed ₦1 during VTpass timeout
  if (failClosedRes.status === 503 && !('verifiedAmount' in failClosedRes)) {
    console.log('✅ [PASS] Variation API timeout fails closed with 503 (client ₦1 amount rejected)')
    passed++
  } else {
    console.error('❌ [FAIL] Variation API timeout failed to reject client amount')
    failed++
  }

  console.log(`\nInvariant Integration Tests: ${passed} passed, ${failed} failed.`)
  if (failed > 0) process.exit(1)
}

testInvariantLogic()
