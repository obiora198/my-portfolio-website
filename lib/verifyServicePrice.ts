export interface VariationsFetcher {
  (
    serviceID: string,
    baseURL: string,
    apiKey: string,
    secretKey: string
  ): Promise<any[]>
}

export class PriceVerificationError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    Object.setPrototypeOf(this, PriceVerificationError.prototype)
    this.name = 'PriceVerificationError'
    this.status = status
  }
}

/**
 * Resolves the server-verified amount for a variation-priced service.
 * Fails closed (throws PriceVerificationError, status 503) if the
 * variations fetch cannot be completed — never falls back to client input.
 */
export async function verifyVariationAmount(
  serviceID: string,
  variationCode: string,
  cleanCode: string,
  baseURL: string,
  apiKey: string,
  secretKey: string,
  fetchVariations: VariationsFetcher,
  retries = 1,
  delayMs = 1500
): Promise<number> {
  let variations: any[]
  try {
    variations = await fetchVariations(serviceID, baseURL, apiKey, secretKey)
  } catch (err) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      return verifyVariationAmount(
        serviceID,
        variationCode,
        cleanCode,
        baseURL,
        apiKey,
        secretKey,
        fetchVariations,
        retries - 1,
        delayMs
      )
    }
    throw new PriceVerificationError(
      'Unable to verify plan pricing right now. Please try again shortly.',
      503
    )
  }

  const matched = variations.find(
    (v: any) =>
      v.variation_code === cleanCode ||
      String(v.variation_code) === cleanCode ||
      v.variation_code === variationCode
  )

  if (!matched) {
    throw new PriceVerificationError(`Invalid plan selected (${cleanCode}).`, 400)
  }

  return Number(matched.variation_amount)
}
