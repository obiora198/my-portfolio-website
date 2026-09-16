import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()

async function fetchCatalog() {
  const baseURL = (process.env.VTPASS_BASE_URL || process.env.NEXT_PUBLIC_VTPASS_BASE_URL || 'https://sandbox.vtpass.com/api/').replace(/\/$/, '')
  const apiKey = process.env.VTPASS_API_KEY
  const secretKey = process.env.VTPASS_SECRET_KEY

  console.log('Connecting to VTpass baseURL:', baseURL)
  const headers = {
    'api-key': apiKey,
    'secret-key': secretKey,
  }

  // 1. Fetch all service categories
  const categories = ['airtime', 'data', 'tv-subscription', 'electricity-bill']
  const allServices: any[] = []

  for (const cat of categories) {
    try {
      const res = await axios.get(`${baseURL}/services?identifier=${cat}`, { headers })
      const services = res.data.content || []
      console.log(`Category [${cat}]: Found ${services.length} services`)
      allServices.push(...services)
    } catch (e: any) {
      console.error(`Error fetching category ${cat}:`, e.message)
    }
  }

  console.log(`\nTotal services found: ${allServices.length}`)

  // 2. For each service, fetch sample variations
  const catalog: any[] = []

  for (const s of allServices) {
    let variations: any[] = []
    try {
      const varRes = await axios.get(`${baseURL}/service-variations?serviceID=${s.serviceID}`, { headers })
      variations = varRes.data.content?.variations || varRes.data.content?.varations || []
    } catch (e) {
      // Some services (like pure airtime) have no variation codes
    }

    catalog.push({
      serviceID: s.serviceID,
      name: s.name,
      category: s.category || s.identifier,
      convenienceFee: s.convinience_fee,
      variationsCount: variations.length,
      sampleVariations: variations.slice(0, 10).map((v: any) => ({
        name: v.name,
        code: v.variation_code,
        amount: v.variation_amount,
      })),
      allVariations: variations.map((v: any) => ({
        name: v.name,
        code: v.variation_code,
        amount: v.variation_amount,
      })),
    })
  }

  console.log('\n--- CATALOG SUMMARY ---')
  for (const item of catalog) {
    console.log(`\nService: ${item.name} (${item.serviceID}) [${item.category}]`)
    console.log(`Variations: ${item.variationsCount}`)
    if (item.sampleVariations.length > 0) {
      console.log('Sample plans:', item.sampleVariations.slice(0, 3))
    }
  }

  // Write out full catalog JSON to scripts/vtu_catalog.json for detailed processing
  const fs = await import('fs')
  fs.writeFileSync('scripts/vtu_catalog.json', JSON.stringify(catalog, null, 2))
  console.log('\nSaved full catalog to scripts/vtu_catalog.json')
}

fetchCatalog().catch(console.error)
