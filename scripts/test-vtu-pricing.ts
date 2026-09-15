import {
  calculateServiceFee,
  addPaystackGatewayFee,
  CABLE_TV_SERVICES,
} from '../lib/vtuPricing'

function runTests() {
  console.log('--- Running VTU Pricing & Gateway Fee Tests ---')
  let passed = 0
  let failed = 0

  function assert(testName: string, actual: any, expected: any) {
    if (actual === expected) {
      console.log(`✅ [PASS] ${testName}`)
      passed++
    } else {
      console.error(`❌ [FAIL] ${testName} - Expected: ${expected}, Got: ${actual}`)
      failed++
    }
  }

  // 1. Local Airtime: always 0 (face value preserved 1:1, discount absorbs gateway fee)
  assert('MTN Airtime ₦1,000 has ₦0 fee', calculateServiceFee('mtn', 1000), 0)
  assert('Airtel Airtime ₦5,000 has ₦0 fee', calculateServiceFee('airtel', 5000), 0)
  assert('Glo Airtime ₦500 has ₦0 fee', calculateServiceFee('glo', 500), 0)
  assert('9mobile (etisalat) ₦2,000 has ₦0 fee', calculateServiceFee('etisalat', 2000), 0)

  // 2. International Airtime: 2.5% target margin + rounded gateway fee
  assert('International ₦10,000 has fee ₦510 (total ₦10,510)', calculateServiceFee('foreign-airtime', 10000), 510)
  assert('International ₦1,500 has fee ₦70 (total ₦1,570)', calculateServiceFee('foreign-airtime', 1500), 70)

  // 3. Showmax Carve-out: always 0 markup
  assert('Showmax ₦2,500 has ₦0 fee', calculateServiceFee('showmax', 2500), 0)
  assert('Showmax ₦8,000 has ₦0 fee', calculateServiceFee('showmax', 8000), 0)
  assert('Showmax ₦50,000 has ₦0 fee', calculateServiceFee('showmax', 50000), 0)
  assert('Showmax is NOT in CABLE_TV_SERVICES set', CABLE_TV_SERVICES.has('showmax'), false)

  // 4. Data Bundles
  assert('MTN Data ₦100 has ₦10 fee (total ₦110, covers 1.5% fee)', calculateServiceFee('mtn-data', 100), 10)
  assert('Airtel Data ₦500 has ₦10 fee (total ₦510, covers 1.5% fee)', calculateServiceFee('airtel-data', 500), 10)
  assert('Glo Data ₦1,000 has ₦50 fee (total ₦1,050, covers ₦30 margin + gateway)', calculateServiceFee('glo-data', 1000), 50)
  assert('MTN Data ₦5,000 has ₦210 fee (total ₦5,210)', calculateServiceFee('mtn-data', 5000), 210)
  assert('Smile ₦19,800 has ₦510 fee (total ₦20,310)', calculateServiceFee('smile-direct', 19800), 510)

  // 5. Cable TV (DStv, GOtv, StarTimes)
  assert('GOtv Smallie ₦800 has ₦70 fee (total ₦870)', calculateServiceFee('gotv', 800), 70)
  assert('DStv Padi ₦2,500 has ₦200 fee (total ₦2,700)', calculateServiceFee('dstv', 2500), 200)
  assert('DStv Confam ₦4,615 has ₦275 fee (total ₦4,890)', calculateServiceFee('dstv', 4615), 275)
  assert('DStv Compact ₦7,900 has ₦330 fee (total ₦8,230)', calculateServiceFee('dstv', 7900), 330)
  assert('DStv Premium ₦21,000 has ₦580 fee (total ₦21,580)', calculateServiceFee('dstv', 21000), 580)

  // 6. Electricity DISCOs
  assert('IKEDC ₦1,500 has ₦80 fee (total ₦1,580)', calculateServiceFee('ikeja-electric', 1500), 80)
  assert('EKEDC ₦5,000 has ₦280 fee (total ₦5,280)', calculateServiceFee('eko-electric', 5000), 280)
  assert('AEDC ₦25,000 has ₦640 fee (total ₦25,640)', calculateServiceFee('abuja-electric', 25000), 640)
  assert('IBEDC ₦100,000 has ₦1,830 fee (total ₦101,830)', calculateServiceFee('ibadan-electric', 100000), 1830)

  // 7. Margin Preservation & Settlement Invariant across sample transactions
  const samples = [
    { serviceID: 'mtn-data', amount: 600, targetMargin: 30 },
    { serviceID: 'mtn-data', amount: 1000, targetMargin: 30 },
    { serviceID: 'mtn-data', amount: 2000, targetMargin: 30 },
    { serviceID: 'mtn-data', amount: 3000, targetMargin: 30 },
    { serviceID: 'dstv', amount: 4615, targetMargin: 100 },
    { serviceID: 'ikeja-electric', amount: 1500, targetMargin: 50 },
    { serviceID: 'eko-electric', amount: 5000, targetMargin: 100 },
  ]

  for (const s of samples) {
    const fee = calculateServiceFee(s.serviceID, s.amount)
    const gross = s.amount + fee
    // Ensure gross is clean multiple of 10
    const isMultipleOf10 = gross % 10 === 0
    // Paystack fee calculation
    const paystackFee = gross < 2500 ? gross * 0.015 : Math.min(2000, gross * 0.015 + 100)
    const settled = gross - paystackFee
    const netTarget = s.amount + s.targetMargin
    const preservesMargin = settled >= netTarget

    assert(
      `${s.serviceID} ₦${s.amount} gross (₦${gross}) is multiple of ₦10 and settles >= net target (settled: ₦${settled.toFixed(2)} >= ₦${netTarget})`,
      isMultipleOf10 && preservesMargin,
      true
    )
  }

  // 8. Multi-hyphenated plan resolution test (e.g., gotv-lite-3months)
  const mockVariations = [
    { name: 'GOtv Lite N400', variation_code: 'gotv-lite', variation_amount: '400.00' },
    { name: 'GOtv Max N3,600', variation_code: 'gotv-max', variation_amount: '3600.00' },
    { name: 'GOtv Lite (3 Months) N1,080', variation_code: 'gotv-lite-3months', variation_amount: '1080.00' },
    { name: 'GOtv Lite (1 Year) N3,180', variation_code: 'gotv-lite-1year', variation_amount: '3180.00' },
    { name: 'GOtv Supa Plus - monthly N15,700', variation_code: 'gotv-supa-plus', variation_amount: '15700.00' }
  ]

  const testCodes = [
    { input: 'gotv-lite-3months', expectedAmount: 1080 },
    { input: 'gotv-lite-3months-2', expectedAmount: 1080 }, // with UI composite index
    { input: 'gotv-lite', expectedAmount: 400 },
    { input: 'gotv-supa-plus', expectedAmount: 15700 },
    { input: 'gotv-supa-plus-4', expectedAmount: 15700 },
  ]

  for (const tc of testCodes) {
    const clean = tc.input.replace(/-\d+$/, '')
    const matched =
      mockVariations.find((v) => v.variation_code === tc.input) ||
      mockVariations.find((v) => v.variation_code === clean)

    assert(
      `Variation resolution for "${tc.input}" matches ${tc.expectedAmount}`,
      matched ? Number(matched.variation_amount) : 0,
      tc.expectedAmount
    )
  }

  console.log(`\nTests Completed: ${passed} passed, ${failed} failed.`)
  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
