import { calculateServiceFee, CABLE_TV_SERVICES } from '../lib/vtuPricing'

function runTests() {
  console.log('--- Running VTU Pricing Tests ---')
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

  // 1. Local Airtime: always 0
  assert('MTN Airtime ₦1,000 has 0 markup', calculateServiceFee('mtn', 1000), 0)
  assert('Airtel Airtime ₦5,000 has 0 markup', calculateServiceFee('airtel', 5000), 0)
  assert('Glo Airtime ₦500 has 0 markup', calculateServiceFee('glo', 500), 0)
  assert('9mobile (etisalat) ₦2,000 has 0 markup', calculateServiceFee('etisalat', 2000), 0)

  // 2. International Airtime: 2.5% rounded
  assert('International ₦10,000 has 2.5% fee (₦250)', calculateServiceFee('foreign-airtime', 10000), 250)
  assert('International ₦1,500 has 2.5% fee (₦38)', calculateServiceFee('foreign-airtime', 1500), 38)

  // 3. Showmax Carve-out: always 0 markup
  assert('Showmax ₦2,500 has 0 fee', calculateServiceFee('showmax', 2500), 0)
  assert('Showmax ₦8,000 has 0 fee', calculateServiceFee('showmax', 8000), 0)
  assert('Showmax ₦50,000 has 0 fee', calculateServiceFee('showmax', 50000), 0)
  assert('Showmax is NOT in CABLE_TV_SERVICES set', CABLE_TV_SERVICES.has('showmax'), false)

  // 4. Data Bundles
  assert('MTN Data ₦100 has 0 fee (<= 500)', calculateServiceFee('mtn-data', 100), 0)
  assert('Airtel Data ₦500 has 0 fee (<= 500)', calculateServiceFee('airtel-data', 500), 0)
  assert('Glo Data ₦1,000 has ₦30 fee (501 - 5000)', calculateServiceFee('glo-data', 1000), 30)
  assert('MTN Data ₦5,000 has ₦30 fee (501 - 5000)', calculateServiceFee('mtn-data', 5000), 30)
  assert('Smile ₦19,800 has ₦100 fee (> 5000)', calculateServiceFee('smile-direct', 19800), 100)

  // 5. Cable TV (DStv, GOtv, StarTimes)
  assert('GOtv Smallie ₦800 has ₦50 fee (<= 2500)', calculateServiceFee('gotv', 800), 50)
  assert('DStv Padi ₦2,500 has ₦50 fee (<= 2500)', calculateServiceFee('dstv', 2500), 50)
  assert('DStv Confam ₦4,615 has ₦100 fee (2501 - 8000)', calculateServiceFee('dstv', 4615), 100)
  assert('DStv Compact ₦7,900 has ₦100 fee (2501 - 8000)', calculateServiceFee('dstv', 7900), 100)
  assert('DStv Premium ₦21,000 has ₦150 fee (> 8000)', calculateServiceFee('dstv', 21000), 150)

  // 6. Electricity DISCOs
  assert('IKEDC ₦1,500 has ₦50 fee (<= 2000)', calculateServiceFee('ikeja-electric', 1500), 50)
  assert('EKEDC ₦5,000 has ₦100 fee (2001 - 10000)', calculateServiceFee('eko-electric', 5000), 100)
  assert('AEDC ₦25,000 has ₦150 fee (10001 - 50000)', calculateServiceFee('abuja-electric', 25000), 150)
  assert('IBEDC ₦100,000 has ₦200 fee (> 50000 capped)', calculateServiceFee('ibadan-electric', 100000), 200)

  console.log(`\nTests Completed: ${passed} passed, ${failed} failed.`)
  if (failed > 0) {
    process.exit(1)
  }
}

runTests()
