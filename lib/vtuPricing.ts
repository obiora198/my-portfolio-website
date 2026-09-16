/**
 * VTU Service Fee and Pricing Matrix
 * Exact, deterministic calculations based on verified baseAmount in Naira.
 *
 * All service IDs are confirmed against VTpass live catalog.
 */

export const AIRTIME_SERVICES = new Set(['airtel', 'mtn', 'glo', 'etisalat'])

export const DATA_SERVICES = new Set([
  'airtel-data',
  'mtn-data',
  'glo-data',
  'etisalat-data',
  'glo-sme-data',
  'smile-direct',
  'spectranet',
])

export const CABLE_TV_SERVICES = new Set(['dstv', 'gotv', 'startimes'])

export const ELECTRICITY_SERVICES = new Set([
  'ikeja-electric',
  'eko-electric',
  'abuja-electric',
  'kano-electric',
  'portharcourt-electric',
  'jos-electric',
  'kaduna-electric',
  'enugu-electric',
  'ibadan-electric',
  'benin-electric',
  'aba-electric',
  'yola-electric',
])

/**
 * Calculates the gross total needed to cover Paystack's gateway fee in Nigeria
 * so the platform settles the full netTarget, rounded up to the nearest ₦10.
 *
 * Paystack Nigeria fee schedule (when merchant absorbs fees):
 * - Under ₦2,500: 1.5%
 * - ₦2,500 and above: 1.5% + ₦100 (capped at ₦2,000)
 */
export function addPaystackGatewayFee(netTarget: number): number {
  if (netTarget <= 0) return 0

  let gross = netTarget / 0.985
  let rounded = Math.ceil(gross / 10) * 10

  // If the rounded total reaches or exceeds ₦2,500, Paystack adds the flat ₦100 fee
  if (rounded >= 2500) {
    gross = (netTarget + 100) / 0.985
    // Cap fee at ₦2,000 max
    if (gross - netTarget > 2000) {
      gross = netTarget + 2000
    }
    rounded = Math.ceil(gross / 10) * 10
  }

  return rounded
}

/**
 * Calculates platform service fee in Naira.
 * Combines target markup margin with gateway processing fee, rounded to nearest ₦10.
 *
 * @param serviceID - VTpass confirmed service identifier
 * @param baseAmount - Base face value of the service in Naira
 * @param activeTab - Optional UI tab context for fallback routing
 * @returns Service fee in whole Naira (0 if no fee applies)
 */
export function calculateServiceFee(
  serviceID: string,
  baseAmount: number,
  activeTab?: string
): number {
  if (!baseAmount || baseAmount <= 0) return 0

  // 1. Local Airtime: ₦0 fee (telco discount covers gateway fee, preserving 1:1 face value)
  if (AIRTIME_SERVICES.has(serviceID)) {
    return 0
  }

  // 2. Streaming (Showmax): ₦0 fee (matches direct subscription pricing)
  if (serviceID === 'showmax') {
    return 0
  }

  // Determine platform target margin
  let targetMargin = 0

  // 3. International (Airtime, Foreign Data): 2.5% margin
  if (serviceID === 'foreign-airtime') {
    targetMargin = Math.round(baseAmount * 0.025)
  }
  // 4. Data & Internet Bundles
  else if (DATA_SERVICES.has(serviceID) || activeTab === 'data') {
    if (baseAmount <= 500) targetMargin = 0 // Micro-plans: ₦0 target margin (gateway fee covered by rounding)
    else if (baseAmount <= 5000) targetMargin = 30 // Mid-tier (1GB - 5GB): ₦30 margin
    else targetMargin = 100 // Large / Unlimited bundles (> ₦5,000): ₦100 margin
  }
  // 5. Cable TV (DStv, GOtv, StarTimes)
  else if (CABLE_TV_SERVICES.has(serviceID) || activeTab === 'tv') {
    if (baseAmount <= 2500) targetMargin = 50 // Entry (GOtv Smallie/Jinja, DStv Padi)
    else if (baseAmount <= 8000) targetMargin = 100 // Mid (Confam, Compact, Max)
    else targetMargin = 150 // Premium (Compact Plus, Premium)
  }
  // 6. Electricity DISCOs (All 12 Providers)
  else if (
    ELECTRICITY_SERVICES.has(serviceID) ||
    activeTab === 'electricity' ||
    serviceID.endsWith('-electric')
  ) {
    if (baseAmount <= 2000) targetMargin = 50
    else if (baseAmount <= 10000) targetMargin = 100
    else if (baseAmount <= 50000) targetMargin = 150
    else targetMargin = 200 // Cap at ₦200
  }

  // Gross total needed to cover gateway fee and preserve platform margin, rounded to nearest ₦10
  const finalTotal = addPaystackGatewayFee(baseAmount + targetMargin)
  return Math.max(0, finalTotal - baseAmount)
}

