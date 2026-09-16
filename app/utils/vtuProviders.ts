// Local provider images stored in /public/images/vtu-providers/
export const LOCAL_PROVIDER_IMAGES: Record<string, string> = {
  // Airtime
  mtn: '/images/vtu-providers/mtn.jpg',
  airtel: '/images/vtu-providers/airtel.jpg',
  glo: '/images/vtu-providers/glo.jpg',
  etisalat: '/images/vtu-providers/etisalat.jpg',
  'foreign-airtime': '/images/vtu-providers/foreign-airtime.jpg',
  'mtn-airtime': '/images/vtu-providers/mtn-airtime.jpg',
  'airtel-airtime': '/images/vtu-providers/airtel-airtime.jpg',
  'glo-airtime': '/images/vtu-providers/glo-airtime.jpg',
  'etisalat-airtime': '/images/vtu-providers/etisalat-airtime.jpg',

  // Data
  'mtn-data': '/images/vtu-providers/mtn-data.jpg',
  'airtel-data': '/images/vtu-providers/airtel-data.jpg',
  'glo-data': '/images/vtu-providers/glo-data.jpg',
  'glo-sme-data': '/images/vtu-providers/glo-sme-data.jpg',
  'etisalat-data': '/images/vtu-providers/etisalat-data.jpg',
  'smile-direct': '/images/vtu-providers/smile-direct.jpg',
  spectranet: '/images/vtu-providers/spectranet.jpg',

  // TV
  dstv: '/images/vtu-providers/dstv.jpg',
  gotv: '/images/vtu-providers/gotv.jpg',
  startimes: '/images/vtu-providers/startimes.jpg',
  showmax: '/images/vtu-providers/showmax.jpg',

  // Electricity
  'ikeja-electric': '/images/vtu-providers/ikeja-electric.jpg',
  'eko-electric': '/images/vtu-providers/eko-electric.jpg',
  'abuja-electric': '/images/vtu-providers/abuja-electric.jpg',
  'kano-electric': '/images/vtu-providers/kano-electric.jpg',
  'portharcourt-electric': '/images/vtu-providers/portharcourt-electric.jpg',
  'jos-electric': '/images/vtu-providers/jos-electric.jpg',
  'kaduna-electric': '/images/vtu-providers/kaduna-electric.jpg',
  'enugu-electric': '/images/vtu-providers/enugu-electric.jpg',
  'ibadan-electric': '/images/vtu-providers/ibadan-electric.jpg',
  'benin-electric': '/images/vtu-providers/benin-electric.jpg',
  'aba-electric': '/images/vtu-providers/aba-electric.jpg',
  'yola-electric': '/images/vtu-providers/yola-electric.jpg',
}

export function getProviderImage(serviceID: string, remoteUrl?: string): string {
  if (!serviceID) return '/images/vtu-providers/airtel.jpg'
  const id = serviceID.toLowerCase()
  if (LOCAL_PROVIDER_IMAGES[id]) {
    return LOCAL_PROVIDER_IMAGES[id]
  }
  // Substring matching and fallback
  if (id.includes('glo')) return '/images/vtu-providers/glo.jpg'
  if (id.includes('mtn')) return '/images/vtu-providers/mtn.jpg'
  if (id.includes('airtel')) return '/images/vtu-providers/airtel.jpg'
  if (id.includes('etisalat') || id.includes('9mobile'))
    return '/images/vtu-providers/etisalat.jpg'
  if (id.includes('smile')) return '/images/vtu-providers/smile-direct.jpg'
  if (id.includes('spectranet')) return '/images/vtu-providers/spectranet.jpg'
  if (id.includes('dstv')) return '/images/vtu-providers/dstv.jpg'
  if (id.includes('gotv')) return '/images/vtu-providers/gotv.jpg'
  if (id.includes('startimes')) return '/images/vtu-providers/startimes.jpg'
  if (id.includes('showmax')) return '/images/vtu-providers/showmax.jpg'
  if (id.includes('ikeja')) return '/images/vtu-providers/ikeja-electric.jpg'
  if (id.includes('eko')) return '/images/vtu-providers/eko-electric.jpg'
  if (id.includes('abuja')) return '/images/vtu-providers/abuja-electric.jpg'
  if (id.includes('kano')) return '/images/vtu-providers/kano-electric.jpg'
  if (id.includes('enugu')) return '/images/vtu-providers/enugu-electric.jpg'
  if (id.includes('ibadan')) return '/images/vtu-providers/ibadan-electric.jpg'
  if (id.includes('benin')) return '/images/vtu-providers/benin-electric.jpg'
  if (id.includes('jos')) return '/images/vtu-providers/jos-electric.jpg'
  if (id.includes('kaduna')) return '/images/vtu-providers/kaduna-electric.jpg'
  if (id.includes('aba')) return '/images/vtu-providers/aba-electric.jpg'
  if (id.includes('yola')) return '/images/vtu-providers/yola-electric.jpg'
  if (id.includes('portharcourt')) return '/images/vtu-providers/portharcourt-electric.jpg'
  return remoteUrl || '/images/vtu-providers/airtel.jpg'
}

export function formatServiceName(serviceID: string): string {
  if (!serviceID) return ''
  const id = serviceID.toLowerCase()
  if (id === 'glo-sme-data') return 'GLO SME Data'
  if (id === 'glo-data') return 'GLO Data'
  if (id === 'glo') return 'GLO Airtime'
  if (id === 'mtn-data') return 'MTN Data'
  if (id === 'mtn') return 'MTN Airtime'
  if (id === 'airtel-data') return 'Airtel Data'
  if (id === 'airtel') return 'Airtel Airtime'
  if (id === 'etisalat-data' || id === '9mobile-data') return '9mobile Data'
  if (id === 'etisalat' || id === '9mobile') return '9mobile Airtime'
  if (id === 'smile-direct') return 'Smile Data'
  if (id === 'spectranet') return 'Spectranet'
  if (id === 'dstv') return 'DStv'
  if (id === 'gotv') return 'GOtv'
  if (id === 'startimes') return 'StarTimes'
  if (id === 'showmax') return 'Showmax'
  if (id.endsWith('-electric')) {
    const disco = id.replace('-electric', '')
    return disco.charAt(0).toUpperCase() + disco.slice(1) + ' Electric'
  }
  return serviceID.replace('-', ' ')
}

export function generateRequestId(): string {
  const now = new Date()
  const options = {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const
  const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(now)
  const d = parts.find((p) => p.type === 'day')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const y = parts.find((p) => p.type === 'year')?.value
  const h = parts.find((p) => p.type === 'hour')?.value
  const min = parts.find((p) => p.type === 'minute')?.value

  const requestIdBase = `${y}${m}${d}${h}${min}`
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `${requestIdBase}${randomStr}`
}

