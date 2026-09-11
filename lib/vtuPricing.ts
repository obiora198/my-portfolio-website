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
 * Calculates platform service fee (markup) in Naira.
 *
 * @param serviceID - VTpass confirmed service identifier
 * @param baseAmount - Base face value of the service in Naira
 * @param activeTab - Optional UI tab context for fallback routing
 * @returns Service fee in whole Naira (0 if no markup applies)
 */
export function calculateServiceFee(
  serviceID: string,
  baseAmount: number,
  activeTab?: string
): number {
  if (!baseAmount || baseAmount <= 0) return 0

  // 1. Local Airtime: ₦0 markup (profit is VTpass 3-5% discount)
  if (AIRTIME_SERVICES.has(serviceID)) {
    return 0
  }

  // 2. International (Airtime, Foreign Data, Gift Cards): 2.5% fee
  if (serviceID === 'foreign-airtime') {
    return Math.round(baseAmount * 0.025)
  }

  // 3. Streaming (Showmax): ₦0 markup to match direct card payment pricing
  if (serviceID === 'showmax') {
    return 0
  }

  // 4. Data & Internet Bundles
  if (DATA_SERVICES.has(serviceID) || activeTab === 'data') {
    if (baseAmount <= 500) return 0 // Micro-plans: ₦0 fee (protect comparison volume)
    if (baseAmount <= 5000) return 30 // Mid-tier (1GB - 5GB): ₦30
    return 100 // Large / Unlimited bundles (> ₦5,000): ₦100
  }

  // 5. Cable TV (DStv, GOtv, StarTimes)
  if (CABLE_TV_SERVICES.has(serviceID) || activeTab === 'tv') {
    if (baseAmount <= 2500) return 50 // Entry (GOtv Smallie/Jinja, DStv Padi)
    if (baseAmount <= 8000) return 100 // Mid (Confam, Compact, Max)
    return 150 // Premium (Compact Plus, Premium)
  }

  // 6. Electricity DISCOs (All 12 Providers)
  if (
    ELECTRICITY_SERVICES.has(serviceID) ||
    activeTab === 'electricity' ||
    serviceID.endsWith('-electric')
  ) {
    if (baseAmount <= 2000) return 50
    if (baseAmount <= 10000) return 100
    if (baseAmount <= 50000) return 150
    return 200 // Cap at ₦200
  }

  return 0
}
