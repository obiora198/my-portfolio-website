
'use client'

import Image from 'next/image'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  AlertCircle,
  Zap,
  CreditCard,
  Smartphone,
  Wifi,
  Tv,
  Globe,
  ArrowLeft,
  Search,
  Loader2,
  Sparkles,
  Copy,
} from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import AxiosInstance from '@/app/utils/axiosInstance'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CustomSelect } from '@/app/vtu/components/CustomSelect'
import { calculateServiceFee } from '@/lib/vtuPricing'

interface VTUPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService: string | null
  onSuccess: () => void
}

type VTUTab = 'airtime' | 'data' | 'tv' | 'electricity' | 'international' | 'wallet'

interface Service {
  serviceID: string
  name: string
  image: string
}

// Local provider images stored in /public/images/vtu-providers/
const LOCAL_PROVIDER_IMAGES: Record<string, string> = {
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

function getProviderImage(serviceID: string, remoteUrl?: string): string {
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
  return remoteUrl || '/images/vtu-providers/airtel.jpg'
}

function getProviderLabel(service: Service): string {
  const id = service.serviceID.toLowerCase()
  const name = service.name.toLowerCase()

  if (id === 'glo-sme-data' || (id.includes('glo') && name.includes('sme'))) {
    return 'GLO SME'
  }
  if (id === 'glo-data' || id === 'glo') {
    return id === 'glo-data' ? 'GLO Data' : 'GLO'
  }
  if (id === 'spectranet') {
    return 'Spectranet'
  }
  if (id === 'smile-direct' || id.includes('smile')) {
    return 'Smile'
  }
  if (id === 'etisalat-data' || id === 'etisalat') {
    return '9mobile'
  }
  if (id === 'airtel-data' || id === 'airtel') {
    return id === 'airtel-data' ? 'Airtel Data' : 'Airtel'
  }
  if (id === 'mtn-data' || id === 'mtn') {
    return id === 'mtn-data' ? 'MTN Data' : 'MTN'
  }
  if (id === 'dstv') return 'DStv'
  if (id === 'gotv') return 'GOtv'
  if (id === 'startimes') return 'StarTimes'
  if (id === 'showmax') return 'Showmax'

  // Electricity DISCOs
  if (id.endsWith('-electric')) {
    const disco = id.replace('-electric', '')
    return disco.charAt(0).toUpperCase() + disco.slice(1)
  }

  if (name.includes('sme')) {
    return `${service.name.split(' ')[0]} SME`
  }

  return service.name.split(' ')[0]
}

// Clean plan name to prevent repeating the price already shown as primary headline
// and enrich combo/hybrid packages with their actual data and voice breakdown
function cleanPlanName(
  name: string,
  amount?: string | number,
  code?: string
): string {
  if (!name) return ''

  const lowerName = name.toLowerCase()
  const lowerCode = (code || '').toLowerCase()
  const numAmount =
    parseFloat(String(amount || '0').replace(/[^0-9.]/g, '')) || 0

  // 1. MTN XtraData & XtraTalk combo packages
  if (lowerName.includes('xtradata') || lowerCode.includes('xtradata')) {
    if (numAmount === 200 || lowerName.includes('200')) {
      return '200MB + ₦200 Airtime (3 days)'
    }
    return 'XtraData (Data + Airtime)'
  }

  if (lowerName.includes('xtratalk') || lowerCode.includes('xtratalk')) {
    if (numAmount === 200 || lowerName.includes('200')) return '50MB + ₦1,000 Voice (3 days)'
    if (numAmount === 300 || lowerName.includes('300')) return '100MB + ₦1,500 Voice (7 days)'
    if (numAmount === 500 || lowerName.includes('500')) return '250MB + ₦2,500 Voice (7 days)'
    if (numAmount === 1000 || lowerName.includes('1000')) return '500MB + ₦5,000 Voice (30 days)'
    if (numAmount === 2000 || lowerName.includes('2000')) return '1GB + ₦10,000 Voice (30 days)'
    if (numAmount === 5000 || lowerName.includes('5000')) return '2.5GB + ₦25,000 Voice (30 days)'
    if (numAmount === 10000 || lowerName.includes('10000')) return '5GB + ₦50,000 Voice (30 days)'
    if (numAmount === 15000 || lowerName.includes('15000')) return '7.5GB + ₦75,000 Voice (30 days)'
    if (numAmount === 20000 || lowerName.includes('20000')) return '10GB + ₦100,000 Voice (30 days)'
    return 'XtraTalk (Voice + Data)'
  }

  // 2. Airtel Voice Bundles
  if (lowerName.includes('voice bundle') || lowerCode.includes('airt-voice')) {
    if (numAmount === 100 || lowerName.includes('600')) return '₦600 Talk Time (Voice Bundle)'
    if (numAmount === 200 || lowerName.includes('1200')) return '₦1,200 Talk Time (Voice Bundle)'
    if (numAmount === 500 || lowerName.includes('3000')) return '₦3,000 Talk Time (Voice Bundle)'
    if (numAmount === 1000 || lowerName.includes('6000')) return '₦6,000 Talk Time (Voice Bundle)'
  }

  // 3. Spectranet Wallet Topups
  if (lowerName.includes('spectranet') && !/\d+\s*(?:gb|mb)/i.test(lowerName)) {
    return 'Account Refill / Top-up'
  }

  // 4. SmileVoice plans
  if (lowerName.includes('smilevoice')) {
    const minsMatch = lowerName.match(/(\d+)\s*(?:for|days|mins?|minutes?)/i)
    if (minsMatch) {
      return `${minsMatch[1]} Voice Mins (30 days)`
    }
  }

  // Standard cleanup:
  // 1. Remove provider + price prefix, e.g. 'Glo Data N100 – ', 'N1000 1.5GB', 'MTN N200 - ', 'NGN 1,000 - '
  let cleaned = name
    .replace(
      /^(?:(?:glo|mtn|airtel|9mobile|etisalat|smile|spectranet)\s*(?:data|sme|cg|direct|gifting)?\s*[-–—:]*\s*)?(?:[n₦]|ngn\s*)\s*[\d,]+(?:\.00)?(?:\s*[-–—:]\s*|\s+)/i,
      ''
    )
    .trim()
  // 2. Remove trailing price if present, e.g. 'DStv Yanga - N3,500' -> 'DStv Yanga'
  cleaned = cleaned
    .replace(/\s*[-–—:]\s*(?:[n₦]|ngn\s*)\s*[\d,]+(?:\.00)?\s*$/i, '')
    .trim()
  // 3. Remove redundant provider prefix if left, e.g. 'MTN Data 1.5GB' -> '1.5GB'
  cleaned = cleaned
    .replace(
      /^(?:glo|mtn|airtel|9mobile|etisalat|smile|spectranet)\s*(?:data|sme|cg|direct|gifting)?\s*[-–—:]*\s*/i,
      ''
    )
    .trim()
  // 4. Remove leading hyphen or separator if left
  cleaned = cleaned.replace(/^[-–—:]\s*/, '').trim()
  return cleaned || name
}

function ProviderIcon({ service }: { service: Service }) {
  const [src, setSrc] = useState(() =>
    getProviderImage(service.serviceID, service.image)
  )

  useEffect(() => {
    setSrc(getProviderImage(service.serviceID, service.image))
  }, [service.serviceID, service.image])

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden relative shadow-md ring-2 ring-white/10 flex-shrink-0 bg-neutral-900 flex items-center justify-center">
      <Image
        src={src}
        alt={service.name}
        width={48}
        height={48}
        className="w-full h-full object-cover"
        unoptimized
        onError={() => {
          if (service.serviceID.includes('glo')) {
            setSrc('/images/vtu-providers/glo.jpg')
          } else if (service.serviceID.includes('mtn')) {
            setSrc('/images/vtu-providers/mtn.jpg')
          } else if (service.serviceID.includes('airtel')) {
            setSrc('/images/vtu-providers/airtel.jpg')
          } else if (service.serviceID.includes('spectranet')) {
            setSrc('/images/vtu-providers/spectranet.jpg')
          } else {
            setSrc('/images/vtu-providers/airtel.jpg')
          }
        }}
      />
    </div>
  )
}

const getThemeAccentStyles = (themeName: string, isDarkMode: boolean) => {
  switch (themeName) {
    case 'sky':
      return {
        activeBorder: 'border-sky-500',
        activeBorderHover: 'hover:border-sky-400',
        activeBg: isDarkMode ? 'bg-sky-500/15' : 'bg-sky-50',
        activeText: isDarkMode ? 'text-sky-400' : 'text-sky-600',
        focusRing: 'focus:ring-2 focus:ring-sky-500/50',
        focusBorder: 'focus:border-sky-500',
        badge: isDarkMode
          ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
          : 'bg-sky-50 text-sky-700 border-sky-200',
        glow: 'shadow-sky-500/20',
      }
    case 'emerald':
      return {
        activeBorder: 'border-emerald-500',
        activeBorderHover: 'hover:border-emerald-400',
        activeBg: isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-50',
        activeText: isDarkMode ? 'text-emerald-400' : 'text-emerald-600',
        focusRing: 'focus:ring-2 focus:ring-emerald-500/50',
        focusBorder: 'focus:border-emerald-500',
        badge: isDarkMode
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200',
        glow: 'shadow-emerald-500/20',
      }
    case 'minimal':
      return {
        activeBorder: isDarkMode ? 'border-neutral-300' : 'border-neutral-900',
        activeBorderHover: isDarkMode
          ? 'hover:border-white'
          : 'hover:border-black',
        activeBg: isDarkMode ? 'bg-white/10' : 'bg-neutral-100',
        activeText: isDarkMode ? 'text-white' : 'text-neutral-900',
        focusRing: 'focus:ring-2 focus:ring-neutral-500/50',
        focusBorder: 'focus:border-neutral-500',
        badge: isDarkMode
          ? 'bg-white/10 text-white border-white/20'
          : 'bg-neutral-100 text-neutral-800 border-neutral-300',
        glow: 'shadow-neutral-500/20',
      }
    case 'sunset':
    default:
      return {
        activeBorder: 'border-orange-500',
        activeBorderHover: 'hover:border-orange-400',
        activeBg: isDarkMode ? 'bg-orange-500/15' : 'bg-orange-50',
        activeText: isDarkMode ? 'text-orange-400' : 'text-orange-600',
        focusRing: 'focus:ring-2 focus:ring-orange-500/50',
        focusBorder: 'focus:border-orange-500',
        badge: isDarkMode
          ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
          : 'bg-orange-50 text-orange-700 border-orange-200',
        glow: 'shadow-orange-500/20',
      }
  }
}

export function VTUPurchaseModal({
  isOpen,
  onClose,
  selectedService,
  onSuccess,
}: VTUPurchaseModalProps) {
  const { theme, themeName, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const queryClient = useQueryClient()
  const themeStyles = getThemeAccentStyles(themeName, isDarkMode)

  // Map selected service to tab
  const getTabFromService = (service: string | null): VTUTab => {
    const map: { [key: string]: VTUTab } = {
      airtime: 'airtime',
      data: 'data',
      'cable-tv': 'tv',
      dstv: 'tv',
      gotv: 'tv',
      startimes: 'tv',
      showmax: 'tv',
      electricity: 'electricity',
      international: 'international',
      wallet: 'wallet',
    }
    return (service ? map[service] : null) || 'airtime'
  }

  const [activeTab, setActiveTab] = useState<VTUTab>(
    getTabFromService(selectedService)
  )
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [billersCode, setBillersCode] = useState('')
  const [variationCode, setVariationCode] = useState('')
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null)
  const [email, setEmail] = useState('')
  const [planSearch, setPlanSearch] = useState('')
  const [isPlansExpanded, setIsPlansExpanded] = useState(false)

  // International fields
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >(null)
  const [selectedOperatorId, setSelectedOperatorId] = useState('')

  // WhatsApp receipt
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [useTransactionNumber, setUseTransactionNumber] = useState(true)

  // Validation state
  const [phoneError, setPhoneError] = useState('')
  const [whatsappError, setWhatsappError] = useState('')
  const [meterVerifyError, setMeterVerifyError] = useState('')
  const [fullName, setFullName] = useState('')

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [electricityType, setElectricityType] = useState<
    'prepaid' | 'postpaid'
  >('prepaid')
  const [subscriptionType, setSubscriptionType] = useState<'renew' | 'change'>(
    'renew'
  )

  // Transaction state
  const [loading, setLoading] = useState(false)
  const [modalType, setModalType] = useState<
    'success' | 'error' | 'pending' | null
  >(null)
  const [modalMessage, setModalMessage] = useState('')
  const [showResultModal, setShowResultModal] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)
  const [cardCopied, setCardCopied] = useState(false)

  // Demo Autofill Helpers
  const handleFillDemoDetails = () => {
    // 1. Auto-fill known-good VTpass test phone number
    setPhone('08011111111')
    setPhoneError('')

    // 2. Auto-fill KYC details
    if (!fullName) setFullName('Test Customer')
    if (!email) setEmail('tester@example.com')

    // 3. Auto-fill Electricity meter or TV smartcard if on those tabs
    if (activeTab === 'electricity') {
      setBillersCode('1111111111111')
      setMeterVerifyError('')
    } else if (activeTab === 'tv') {
      setBillersCode('1212121212')
      setMeterVerifyError('')
    }

    // 4. Auto-fill demo amount if needed
    if (activeTab === 'airtime' && !amount) {
      setAmount('100')
    } else if (activeTab === 'electricity' && !amount) {
      setAmount('1000')
    }

    // 5. Copy Paystack test card to clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('4084 0840 8408 4084')
        setCardCopied(true)
        setTimeout(() => setCardCopied(false), 3000)
      }
    } catch (e) {}

    toast.success(
      'Demo details filled! Phone: 08011111111 • Paystack Test Card (4084 0840 8408 4084) copied to clipboard!',
      { duration: 4000, icon: '🧪' }
    )
  }

  const handleCopyTestCard = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('4084 0840 8408 4084')
        setCardCopied(true)
        setTimeout(() => setCardCopied(false), 2500)
        toast.success('Paystack test card copied: 4084 0840 8408 4084', { icon: '📋' })
      }
    } catch (e) {}
  }

  const resetForm = () => {
    setAmount('')
    setPhone('')
    setBillersCode('')
    setVariationCode('')
    setSelectedPlanIndex(null)
    setFullName('')
    setEmail('')
    setCustomerName('')
    setIsVerified(false)
    setMeterVerifyError('')
    setPhoneError('')
    setWhatsappError('')
  }

  const numericAmount = Number(amount) || 0
  const activeServiceID =
    activeTab === 'international' ? 'foreign-airtime' : selectedServiceId
  const liveServiceFee = useMemo(
    () => calculateServiceFee(activeServiceID, numericAmount, activeTab),
    [activeServiceID, numericAmount, activeTab]
  )

  // Update tab when selectedService changes
  useEffect(() => {
    if (selectedService && isOpen) {
      setActiveTab(getTabFromService(selectedService))
    }
  }, [selectedService, isOpen])

  // Dynamically load Paystack Inline JS on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Clear form on tab change
  useEffect(() => {
    setAmount('')
    setPhone('')
    setBillersCode('')
    setVariationCode('')
    setSelectedServiceId('')
    setSelectedCountryCode('')
    setSelectedProductTypeId(null)
    setSelectedOperatorId('')
    setEmail('')
    setFullName('')
    setPlanSearch('')
    setIsPlansExpanded(false)
    setPhoneError('')
    setWhatsappError('')
  }, [activeTab])

  // Reset verification when billers/service changes
  useEffect(() => {
    setCustomerName('')
    setIsVerified(false)
    setMeterVerifyError('')
  }, [billersCode, selectedServiceId, electricityType])

  // Fetch Services
  const { data: services = [], isLoading: isServicesLoading } = useQuery<
    Service[]
  >({
    queryKey: ['services', activeTab],
    queryFn: async () => {
      const identifierMap: { [key: string]: string } = {
        airtime: 'airtime',
        data: 'data',
        tv: 'tv-subscription',
        electricity: 'electricity-bill',
      }
      const response = await AxiosInstance.get(
        `/services?identifier=${identifierMap[activeTab]}`
      )
      return response.data.content
        .filter((service: any) => service.serviceID !== 'foreign-airtime')
        .map((service: any) => ({
          ...service,
          image: service.image.replace('-VTU', ''),
        }))
    },
    enabled: activeTab !== 'international' && isOpen,
    staleTime: 1000 * 60 * 10,
  })

  // Fetch Variations
  const { data: variations = [], isLoading: isVariationsLoading } = useQuery({
    queryKey: [
      'variations',
      selectedServiceId,
      selectedOperatorId,
      selectedProductTypeId,
    ],
    queryFn: async () => {
      if (activeTab === 'airtime') return []

      if (activeTab === 'international') {
        if (!selectedOperatorId || !selectedProductTypeId) return []
        const response = await AxiosInstance.get(
          `/service-variations?serviceID=foreign-airtime&operator_id=${selectedOperatorId}&product_type_id=${selectedProductTypeId}`
        )
        return response.data.content.variations || []
      }

      if (!selectedServiceId) return []
      const response = await AxiosInstance.get(
        `/service-variations?serviceID=${selectedServiceId}`
      )
      const list =
        response.data.content?.variations ||
        response.data.content?.varations ||
        []
      return [...list].sort((a: any, b: any) => {
        const priceA = parseFloat(String(a.variation_amount ?? a.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
        const priceB = parseFloat(String(b.variation_amount ?? b.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
        return priceA - priceB
      })
    },
    enabled:
      activeTab !== 'airtime' &&
      (activeTab === 'international'
        ? !!selectedOperatorId && !!selectedProductTypeId
        : !!selectedServiceId) &&
      isOpen,
    staleTime: 1000 * 60 * 30,
  })

  // Auto-set variationCode for electricity based on prepaid/postpaid toggle
  useEffect(() => {
    if (activeTab === 'electricity' && variations.length > 0) {
      const match = variations.find(
        (v: any) =>
          String(v.variation_code).toLowerCase() === electricityType
      )
      if (match) {
        setVariationCode(match.variation_code)
        setAmount('')
      }
    }
  }, [activeTab, electricityType, variations])

  const selectedProvider = useMemo(
    () => services.find((s) => s.serviceID === selectedServiceId),
    [services, selectedServiceId]
  )

  const filteredVariations = useMemo(() => {
    if (!variations || variations.length === 0) return []
    const sorted = [...variations].sort((a: any, b: any) => {
      const priceA = parseFloat(String(a.variation_amount ?? a.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
      const priceB = parseFloat(String(b.variation_amount ?? b.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
      return priceA - priceB
    })
    if (!planSearch.trim()) return sorted
    const q = planSearch.toLowerCase().trim()
    return sorted.filter(
      (v: any) =>
        (v.name || '').toLowerCase().includes(q) ||
        cleanPlanName(v.name, v.variation_amount, v.variation_code)
          .toLowerCase()
          .includes(q) ||
        (v.variation_amount || '').toString().includes(q)
    )
  }, [variations, planSearch])

  const selectedPlan = useMemo(() => {
    if (!variationCode || !variations || variations.length === 0) return null
    if (selectedPlanIndex !== null && variations[selectedPlanIndex]) {
      return variations[selectedPlanIndex]
    }
    return (
      variations.find(
        (v: any) =>
          v.variation_code === variationCode ||
          String(v.variation_code) === variationCode
      ) || null
    )
  }, [variationCode, selectedPlanIndex, variations])

  const isGridExpanded = Boolean(
    (activeTab === 'data' ||
      activeTab === 'tv' ||
      (activeTab === 'international' && variations.length > 0)) &&
    (!selectedPlan || isPlansExpanded) &&
    (activeTab === 'international' ? !!selectedOperatorId : !!selectedServiceId)
  )

  // Prefetch variations for providers in the current tab to make plan selection instantaneous
  useEffect(() => {
    if (
      services.length > 0 &&
      isOpen &&
      (activeTab === 'data' || activeTab === 'tv')
    ) {
      services.forEach((service) => {
        queryClient.prefetchQuery({
          queryKey: ['variations', service.serviceID, '', null],
          queryFn: async () => {
            const response = await AxiosInstance.get(
              `/service-variations?serviceID=${service.serviceID}`
            )
            const list =
              response.data.content?.variations ||
              response.data.content?.varations ||
              []
            return [...list].sort((a: any, b: any) => {
              const priceA = parseFloat(String(a.variation_amount ?? a.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
              const priceB = parseFloat(String(b.variation_amount ?? b.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
              return priceA - priceB
            })
          },
          staleTime: 1000 * 60 * 30,
        })
      })
    }
  }, [services, isOpen, activeTab, queryClient])

  // Fetch Countries (International)
  const { data: countriesList = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await AxiosInstance.get('/countries')
      return response.data.content.countries || []
    },
    enabled: activeTab === 'international' && isOpen,
    staleTime: 1000 * 60 * 60 * 24,
  })

  // Fetch Product Types (International)
  const { data: productTypes = [] } = useQuery({
    queryKey: ['productTypes', selectedCountryCode],
    queryFn: async () => {
      if (!selectedCountryCode) return []
      const response = await AxiosInstance.get(
        `/product-types?code=${selectedCountryCode}`
      )
      return response.data.content || []
    },
    enabled: activeTab === 'international' && !!selectedCountryCode && isOpen,
    staleTime: 1000 * 60 * 60,
  })

  // Fetch Operators (International)
  const { data: operators = [], isLoading: isOperatorsLoading } = useQuery({
    queryKey: ['operators', selectedCountryCode, selectedProductTypeId],
    queryFn: async () => {
      if (!selectedCountryCode || !selectedProductTypeId) return []
      const response = await AxiosInstance.get(
        `/operators?code=${selectedCountryCode}&product_type_id=${selectedProductTypeId}`
      )
      return response.data.content || []
    },
    enabled:
      activeTab === 'international' &&
      !!selectedCountryCode &&
      !!selectedProductTypeId &&
      isOpen,
    staleTime: 1000 * 60 * 60,
  })

  // Generate VTPass Transaction ID
  const generateRequestId = () => {
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

  // Phone Validation
  const validatePhone = (
    phoneNumber: string,
    isInternational: boolean = false
  ): boolean => {
    if (!phoneNumber) return false

    if (isInternational) {
      // International: Must start with + and have 10-15 digits
      const intlPattern = /^\+[1-9]\d{9,14}$/
      return intlPattern.test(phoneNumber.replace(/[\s-]/g, ''))
    } else {
      // Nigerian: Must be 11 digits starting with 0, or 10 digits without 0, or 234/+234 format
      const nigerianPattern = /^(?:0|\+?234)?[789]\d{9}$/
      return nigerianPattern.test(phoneNumber.replace(/[\s-]/g, ''))
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)

    if (!value.trim()) {
      setPhoneError('')
      return
    }

    const isValid = validatePhone(value, activeTab === 'international')
    if (isValid) {
      setPhoneError('')
      return
    }

    // Only show error while typing if user has already entered the expected full length or more,
    // or if an error was already visible from blur
    const cleaned = value.replace(/[\s-]/g, '')
    if (activeTab === 'international') {
      const digits = cleaned.replace(/\D/g, '')
      if (digits.length >= 15 || phoneError) {
        setPhoneError('Enter valid international format (e.g., +1234567890)')
      }
    } else {
      const isWithCountryCode =
        cleaned.startsWith('+234') || cleaned.startsWith('234')
      const targetLen = isWithCountryCode
        ? cleaned.startsWith('+')
          ? 14
          : 13
        : 11
      const digits = cleaned.replace(/\D/g, '')

      if (digits.length >= targetLen || phoneError) {
        setPhoneError('Enter valid Nigerian number (e.g., 08012345678)')
      }
    }
  }

  const handlePhoneBlur = () => {
    if (!phone.trim()) {
      setPhoneError('')
      return
    }
    if (!validatePhone(phone, activeTab === 'international')) {
      setPhoneError(
        activeTab === 'international'
          ? 'Enter valid international format (e.g., +1234567890)'
          : 'Enter valid Nigerian number (e.g., 08012345678)'
      )
    } else {
      setPhoneError('')
    }
  }

  const handleWhatsAppChange = (value: string) => {
    setWhatsappNumber(value)

    if (!value.trim()) {
      setWhatsappError('')
      return
    }

    const isValid = validatePhone(value, false)
    if (isValid) {
      setWhatsappError('')
      return
    }

    const cleaned = value.replace(/[\s-]/g, '')
    const isWithCountryCode =
      cleaned.startsWith('+234') || cleaned.startsWith('234')
    const targetLen = isWithCountryCode
      ? cleaned.startsWith('+')
        ? 14
        : 13
      : 11
    const digits = cleaned.replace(/\D/g, '')

    if (digits.length >= targetLen || whatsappError) {
      setWhatsappError('Enter valid Nigerian number (e.g., 08012345678)')
    }
  }

  const handleWhatsAppBlur = () => {
    if (!whatsappNumber.trim()) {
      setWhatsappError('')
      return
    }
    if (!validatePhone(whatsappNumber, false)) {
      setWhatsappError('Enter valid Nigerian number (e.g., 08012345678)')
    } else {
      setWhatsappError('')
    }
  }

  // Check Transaction Status (Requery)
  // Poll payment and fulfillment verification
  const pollPaymentVerification = async (
    reference: string,
    attempts = 0
  ): Promise<boolean> => {
    try {
      const response = await axios.get(
        `/api/payment/verify?reference=${reference}`
      )
      const data = response.data

      if (data.deliveryStatus === 'delivered' || (data.success && data.token)) {
        if (data.token) {
          setLastTransaction((prev: any) => ({ ...prev, token: data.token }))
        }
        setModalType('success')
        setModalMessage('Transaction successful! Your service has been activated.')
        toast.success(
          'Transaction successful! Your service has been activated.',
          { id: `vtu-tx-${reference}` }
        )
        setShowResultModal(true)
        resetForm()
        onSuccess()
        return true
      }

      if (data.deliveryStatus === 'failed') {
        setModalType('error')
        const failMsg =
          data.message ||
          'Delivery could not be completed. If debited, please contact support with your reference for reversal.'
        setModalMessage(failMsg)
        toast.error(failMsg, { id: `vtu-tx-${reference}` })
        setShowResultModal(true)
        onSuccess()
        return false
      }

      if (
        data.paymentStatus === 'failed' ||
        data.paymentStatus === 'abandoned'
      ) {
        setModalType('error')
        setModalMessage('Payment was cancelled or failed.')
        toast.error('Payment was cancelled or failed.', {
          id: `vtu-tx-${reference}`,
        })
        setShowResultModal(true)
        onSuccess()
        return false
      }

      // If still processing or pending and under 25 attempts (~60s)
      if (attempts < 25) {
        setModalType('pending')
        const progressMsg =
          data.deliveryStatus === 'processing'
            ? 'Payment confirmed! Disbursing service with provider...'
            : 'Payment received! Verifying payment status...'
        setModalMessage(progressMsg)
        toast.loading(progressMsg, { id: `vtu-tx-${reference}` })
        setTimeout(
          () => pollPaymentVerification(reference, attempts + 1),
          2500
        )
        return false
      } else {
        // Polling reached max duration without final failure
        setModalType('pending')
        setModalMessage(
          'Your transaction is currently processing with the provider. It will reflect in your Recent Transactions shortly.'
        )
        toast.success(
          'Transaction is processing with the provider and will reflect shortly.',
          { id: `vtu-tx-${reference}` }
        )
        setShowResultModal(true)
        onSuccess()
        return false
      }
    } catch (err) {
      console.error('Verify poll error:', err)
      if (attempts < 25) {
        setTimeout(
          () => pollPaymentVerification(reference, attempts + 1),
          3000
        )
      } else {
        setModalType('error')
        const errMsg =
          'Could not verify status. Please check your Recent Transactions.'
        setModalMessage(errMsg)
        toast.error(errMsg, { id: `vtu-tx-${reference}` })
        setShowResultModal(true)
        onSuccess()
      }
      return false
    }
  }

  // Handle Verification
  const handleVerify = async () => {
    if (!billersCode || !selectedServiceId) return
    setIsVerifying(true)
    setMeterVerifyError('')
    try {
      const response = await axios.post('/api/vtu/merchant-verify', {
        billersCode,
        serviceID: selectedServiceId,
        type: activeTab === 'electricity' ? electricityType : undefined,
      })

      if (response.data.code === '000') {
        setCustomerName(
          response.data.content.Customer_Name ||
            response.data.content.customerName
        )
        setIsVerified(true)
      } else {
        setMeterVerifyError(
          response.data.response_description || 'Verification failed'
        )
      }
    } catch (err: any) {
      setMeterVerifyError(err.response?.data?.message || 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle Plan/Variation Change
  const handlePlanChange = (code: string, idx?: number) => {
    setVariationCode(code)
    setSelectedPlanIndex(idx !== undefined ? idx : null)
    setIsPlansExpanded(false)
    const selected = variations.find(
      (v: any, index: number) =>
        (idx !== undefined ? index === idx : false) ||
        v.variation_code === code ||
        String(v.variation_code) === code
    )
    if (selected?.variation_amount) {
      setAmount(selected.variation_amount)
    }
  }

  // Handle Purchase via Paystack Guest Checkout
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate phone number before submitting
    if (!validatePhone(phone, activeTab === 'international')) {
      setPhoneError(
        activeTab === 'international'
          ? 'Enter valid international format (e.g., +1234567890)'
          : 'Enter valid Nigerian number (e.g., 08012345678)'
      )
      return
    }

    if (
      !useTransactionNumber &&
      whatsappNumber &&
      !validatePhone(whatsappNumber, false)
    ) {
      setWhatsappError('Enter valid Nigerian number (e.g., 08012345678)')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        serviceID:
          activeTab === 'international' ? 'foreign-airtime' : selectedServiceId,
        amount: Number(amount),
        phone: phone,
        variation_code: variationCode,
        billersCode:
          activeTab === 'tv' || activeTab === 'electricity'
            ? billersCode
            : phone,
        name: fullName.trim() || customerName || undefined,
        email: email && email.includes('@') ? email.trim() : undefined,
        whatsappNumber: useTransactionNumber ? phone : whatsappNumber,
        activeTab: activeTab,
      }

      if (activeTab === 'international') {
        payload.operator_id = selectedOperatorId
        payload.country_code = selectedCountryCode
        payload.product_type_id = selectedProductTypeId
      }

      if (activeTab === 'tv') {
        payload.subscription_type = subscriptionType
      }

      // Initialize Paystack transaction on server
      const initRes = await axios.post('/api/payment/initialize', payload)
      const {
        reference,
        amount: verifiedAmount,
        serviceFee,
        totalAmount,
      } = initRes.data
      const chargeTotal = totalAmount || verifiedAmount

      // Store for receipt modal
      setLastTransaction({
        requestId: reference,
        serviceID: payload.serviceID,
        amount: verifiedAmount,
        serviceFee: serviceFee || 0,
        totalAmount: chargeTotal,
        phone: payload.phone,
        billersCode: payload.billersCode,
        whatsappNumber: payload.whatsappNumber,
      })

      const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
      const PaystackPop = (window as any).PaystackPop

      if (!PaystackPop || !paystackKey) {
        toast.error(
          'Paystack gateway is initializing. Please configure NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in .env.'
        )
        setLoading(false)
        return
      }

      const handler = PaystackPop.setup({
        key: paystackKey,
        email:
          email && email.includes('@')
            ? email.trim()
            : `guest_${phone.replace(/\D/g, '')}@emmanuel-obiora.vercel.app`,
        amount: Math.round(chargeTotal * 100),
        ref: reference,
        onClose: () => {
          setLoading(false)
          toast('Payment cancelled or window closed', { icon: 'ℹ️' })
        },
        callback: (response: any) => {
          setLoading(false)
          setModalType('pending')
          setModalMessage(
            'Payment received! Connecting to provider network to disburse service...'
          )
          setShowResultModal(true)
          toast.loading('Payment confirmed! Disbursing service...', {
            id: `vtu-tx-${reference}`,
          })
          onSuccess()
          pollPaymentVerification(reference)
        },
      })

      handler.openIframe()
    } catch (err: any) {
      console.error('Purchase error:', err)
      setLoading(false)
      setModalType('error')
      setModalMessage(
        err.response?.data?.message ||
          (typeof err.response?.data?.error === 'string'
            ? err.response.data.error
            : null) ||
          err.message ||
          'Payment initialization failed. Please try again.'
      )
      setShowResultModal(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const canSubmit = () => {
    if (!phone || !validatePhone(phone, activeTab === 'international'))
      return false
    if (
      !useTransactionNumber &&
      (!whatsappNumber || !validatePhone(whatsappNumber, false))
    )
      return false

    if (activeTab === 'airtime') {
      return !!selectedServiceId && !!amount
    } else if (activeTab === 'data') {
      return !!selectedServiceId && !!variationCode
    } else if (activeTab === 'tv') {
      return (
        !!selectedServiceId && !!variationCode && !!billersCode && isVerified
      )
    } else if (activeTab === 'electricity') {
      return (
        !!selectedServiceId &&
        !!variationCode &&
        !!billersCode &&
        !!amount &&
        isVerified
      )
    } else if (activeTab === 'international') {
      if (selectedOperatorId) {
        if (variations.length > 0) {
          return !!variationCode
        }
        return !!amount
      }
    }
    return false
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !showResultModal && onClose()}
          className={`fixed inset-0 ${isDarkMode ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm`}
        />

        {/* Main Modal */}
        {!showResultModal ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden rounded-[2rem] p-5 sm:p-7 shadow-2xl backdrop-blur-xl ${
              isDarkMode ? 'bg-[#0d0d0d] border border-neutral-800 shadow-black/80' : 'bg-white/95 border border-gray-100'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl transition-all z-20 ${
                isDarkMode
                  ? 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-neutral-800'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dedicated Service Header - Resized to fit screen statically */}
            <div className="flex-shrink-0 mb-3 sm:mb-4 pr-10">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentTheme.buttonGradient} text-white shadow-md shadow-black/30 flex-shrink-0`}
                >
                  {activeTab === 'wallet' ? (
                    <CreditCard className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : activeTab === 'data' ? (
                    <Wifi className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : activeTab === 'tv' ? (
                    <Tv className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : activeTab === 'international' ? (
                    <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : activeTab === 'airtime' ? (
                    <Smartphone className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  ) : (
                    <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </div>
                <div>
                  <span
                    className={`inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isDarkMode
                        ? 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {activeTab === 'airtime' && 'Airtime Recharge'}
                    {activeTab === 'data' && 'Data Bundles'}
                    {activeTab === 'tv' && 'Cable TV Subscription'}
                    {activeTab === 'electricity' && 'Electricity Bill'}
                    {activeTab === 'international' && 'International Airtime'}
                    {activeTab === 'wallet' && 'Wallet'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  🧪 Test Mode
                </span>
              </div>
              <h2
                className={`text-xl sm:text-2xl font-black tracking-tight mb-0.5 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {activeTab === 'wallet'
                  ? 'Wallet Balance'
                  : activeTab === 'data'
                    ? 'Buy Data Bundle'
                    : activeTab === 'airtime'
                      ? 'Recharge Airtime'
                      : activeTab === 'tv'
                        ? 'Subscribe Cable TV'
                        : activeTab === 'electricity'
                          ? 'Pay Electricity Bill'
                          : activeTab === 'international'
                            ? 'Send International Airtime'
                            : 'Complete Purchase'}
              </h2>
              <p
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? 'text-neutral-400' : 'text-gray-500'
                }`}
              >
                {activeTab === 'wallet'
                  ? 'View and fund your account balance'
                  : 'Select your provider and plan below to proceed'}
              </p>

              {/* Sandbox notice banner */}
              <div
                className={`mt-2.5 p-2.5 rounded-xl flex items-start gap-2 text-[11px] sm:text-xs border ${
                  isDarkMode
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-300/90'
                    : 'bg-amber-50/80 border-amber-200 text-amber-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold">Sandbox Active:</span> Use Paystack test cards or simulated payment. No real money will be charged.
                </div>
              </div>
            </div>

            {/* Wallet Funding Section */}
            {activeTab === 'wallet' && (
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 py-1 pr-1">
                <div
                  className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-sm ${isDarkMode ? 'bg-white/[0.03] border-neutral-800' : 'bg-gray-50 border-gray-100'}`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold opacity-60 uppercase tracking-wider">
                      Current Balance
                    </p>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${themeStyles.activeBg} border ${themeStyles.activeBorder}`}
                    >
                      <CreditCard className={`w-4 h-4 ${themeStyles.activeText}`} />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black">₦0.00</p>
                </div>

                <div className="space-y-2">
                  <p
                    className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Funding Instructions
                  </p>
                  <div
                    className={`p-3.5 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-neutral-800' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-gray-600'}`}
                    >
                      To fund your wallet, please contact our support team or
                      make a direct transfer to our verified accounts. Automatic
                      funding via Paystack will be available soon.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs sm:text-sm transition-all bg-gradient-to-r ${currentTheme.buttonGradient} text-white shadow-lg ${themeStyles.glow}`}
                >
                  Contact Support to Fund
                </button>
              </div>
            )}

              {/* Purchase Form */}
              {activeTab !== 'wallet' && (
                <form
                  onSubmit={handlePurchase}
                  className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden"
                >
                  <div
                    className={`flex-1 min-h-0 flex flex-col ${
                      isGridExpanded ? 'overflow-hidden' : 'overflow-y-auto pr-1'
                    } space-y-3 sm:space-y-3.5`}
                  >
                    {/* Service/Provider Selection OR Plans Grid View */}
                    {activeTab !== 'international' && (
                      <div
                        className={
                          isGridExpanded
                            ? 'flex-1 min-h-0 flex flex-col overflow-hidden'
                            : ''
                        }
                      >
                        {(activeTab === 'data' ||
                          activeTab === 'tv') &&
                        selectedServiceId ? (
                          /* Plans View with Back Button */
                          <div
                            className={`space-y-2.5 sm:space-y-3 ${
                              isGridExpanded
                                ? 'flex-1 min-h-0 flex flex-col overflow-hidden'
                                : ''
                            }`}
                          >
                            {/* Top bar: Back Button & Selected Provider Badge */}
                            <div className="flex-shrink-0 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedServiceId('')
                            setVariationCode('')
                            setAmount('')
                            setPlanSearch('')
                            setIsPlansExpanded(false)
                          }}
                          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all ${
                            isDarkMode
                              ? 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
                              : 'bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>
                            Back to {activeTab === 'data' ? 'Networks' : 'Providers'}
                          </span>
                        </button>

                        {selectedProvider && (
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${themeStyles.badge}`}
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden relative flex-shrink-0">
                              <Image
                                src={getProviderImage(
                                  selectedProvider.serviceID,
                                  selectedProvider.image
                                )}
                                alt=""
                                width={20}
                                height={20}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <span>{getProviderLabel(selectedProvider)}</span>
                          </div>
                        )}
                      </div>


                      {/* TV Subscription Sub-Type Toggle */}
                      {activeTab === 'tv' && (
                        <div className="flex gap-2">
                          {(['renew', 'change'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setSubscriptionType(type)}
                              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all capitalize ${
                                subscriptionType === type
                                  ? `${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText}`
                                  : isDarkMode
                                    ? 'border-neutral-800 bg-[#0c0c0c] text-neutral-400 hover:border-neutral-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              {type === 'renew' ? 'Renew Bouquet' : 'Change Bouquet'}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Plan Header + Search / Minimized View */}
                      {selectedPlan && !isPlansExpanded ? (
                        /* Minimized View: Selected Card + See all plans link */
                        <div className="flex-shrink-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <label
                              className={`block text-xs sm:text-sm font-semibold ${
                                isDarkMode ? 'text-neutral-300' : 'text-gray-700'
                              }`}
                            >
                              Selected Plan
                            </label>
                            <button
                              type="button"
                              onClick={() => setIsPlansExpanded(true)}
                              className={`text-xs sm:text-sm font-bold hover:underline inline-flex items-center gap-1 transition-colors ${themeStyles.activeText}`}
                            >
                              <span>See all plans</span>
                              {variations.length > 0 && (
                                <span className="opacity-70 text-[11px]">
                                  ({variations.length})
                                </span>
                              )}
                            </button>
                          </div>

                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                            {/* Selected Plan Card */}
                            <button
                              type="button"
                              onClick={() => setIsPlansExpanded(true)}
                              title="Click to view all plans"
                              className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-1.5 relative group w-full sm:w-auto min-w-[170px] max-w-xs ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.glow} shadow-md`}
                            >
                              <div className="flex items-center justify-between w-full gap-4">
                                <span
                                  className={`text-sm sm:text-base font-black tracking-tight ${themeStyles.activeText}`}
                                >
                                  ₦{Number(selectedPlan.variation_amount || 0).toLocaleString()}
                                </span>
                                <div
                                  className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText}`}
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              </div>
                              <span
                                className={`text-[11px] font-medium line-clamp-2 leading-tight ${
                                  isDarkMode
                                    ? 'text-neutral-200 font-semibold'
                                    : 'text-gray-800 font-semibold'
                                }`}
                              >
                                {cleanPlanName(
                                  selectedPlan.name,
                                  selectedPlan.variation_amount,
                                  selectedPlan.variation_code
                                )}
                              </span>
                            </button>

                            {/* See All Plans Link Button */}
                            <button
                              type="button"
                              onClick={() => setIsPlansExpanded(true)}
                              className={`text-xs sm:text-sm font-bold hover:underline inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                                isDarkMode
                                  ? 'text-neutral-300 hover:text-white bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <span>See all plans</span>
                              {variations.length > 0 && (
                                <span className="text-xs opacity-60">
                                  ({variations.length})
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Expanded View: Search + Full Grid */
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-2">
                          <div className="flex-shrink-0 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <label
                                className={`block text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                              >
                                Select Plan
                              </label>
                              <div className="flex items-center gap-2.5">
                                {variations.length > 0 && (
                                  <span
                                    className={`text-xs font-semibold ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}
                                  >
                                    {filteredVariations.length}{' '}
                                    {filteredVariations.length === 1 ? 'plan' : 'plans'}
                                  </span>
                                )}
                                {selectedPlan && (
                                  <button
                                    type="button"
                                    onClick={() => setIsPlansExpanded(false)}
                                    className={`text-xs font-semibold hover:underline ${themeStyles.activeText}`}
                                  >
                                    Collapse
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="relative">
                              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                              <input
                                type="text"
                                value={planSearch}
                                onChange={(e) => setPlanSearch(e.target.value)}
                                placeholder="Search plans (e.g. 1GB, 2.5GB, Monthly)..."
                                className={`w-full pl-10 pr-10 py-2 rounded-xl border text-xs sm:text-sm transition-all outline-none ${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                                  isDarkMode
                                    ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                              />
                              {planSearch && (
                                <button
                                  type="button"
                                  onClick={() => setPlanSearch('')}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-200"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Plans Outlined Grid Cards - Sized to match Service Cards */}
                          <div className="flex-1 min-h-[160px] max-h-[320px] sm:max-h-[360px] overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                            {isVariationsLoading ? (
                              Array.from({ length: 8 }).map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-2xl border animate-pulse flex flex-col justify-between gap-2.5 min-h-[76px] ${
                                    isDarkMode
                                      ? 'border-neutral-800/80 bg-[#0c0c0c]'
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div
                                      className={`h-4 w-14 rounded ${
                                        isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'
                                      }`}
                                    />
                                  </div>
                                  <div
                                    className={`h-3 w-20 rounded ${
                                      isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'
                                    }`}
                                  />
                                </div>
                              ))
                            ) : filteredVariations.length === 0 ? (
                              <div
                                className={`col-span-full py-8 text-center text-xs sm:text-sm ${
                                  isDarkMode ? 'text-neutral-400' : 'text-gray-500'
                                }`}
                              >
                                {variations.length === 0
                                  ? 'No plans available for this provider.'
                                  : `No plans match "${planSearch}"`}
                              </div>
                            ) : (
                              filteredVariations.map((v: any, index: number) => {
                                const isSelected =
                                  variationCode === v.variation_code &&
                                  (selectedPlanIndex === null || selectedPlanIndex === index)
                                return (
                                  <button
                                    key={`${v.variation_code}-${index}`}
                                    type="button"
                                    onClick={() => handlePlanChange(v.variation_code, index)}
                                    className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-1.5 relative group ${
                                      isSelected
                                        ? `${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.glow} shadow-md`
                                        : isDarkMode
                                          ? 'border-neutral-800/80 bg-[#0c0c0c] hover:border-neutral-700 hover:bg-[#141414]'
                                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {/* Primary Text: Price + Radio/Check Indicator */}
                                    <div className="flex items-center justify-between w-full">
                                      <span
                                        className={`text-sm sm:text-base font-black tracking-tight ${
                                          isSelected
                                            ? themeStyles.activeText
                                            : isDarkMode
                                              ? 'text-white'
                                              : 'text-gray-900'
                                        }`}
                                      >
                                        ₦{Number(v.variation_amount || 0).toLocaleString()}
                                      </span>
                                      {isSelected && (
                                        <div
                                          className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText}`}
                                        >
                                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        </div>
                                      )}
                                    </div>

                                    {/* Secondary Text: Plan Name with reduced font size */}
                                    <span
                                      className={`text-[11px] font-medium line-clamp-2 leading-tight ${
                                        isSelected
                                          ? isDarkMode
                                            ? 'text-neutral-200 font-semibold'
                                            : 'text-gray-800 font-semibold'
                                          : isDarkMode
                                            ? 'text-neutral-400'
                                            : 'text-gray-600'
                                      }`}
                                    >
                                      {cleanPlanName(
                                        v.name,
                                        v.variation_amount,
                                        v.variation_code
                                      )}
                                    </span>
                                  </button>
                                )
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeTab === 'electricity' && selectedServiceId ? (
                    /* Electricity: Provider selected → show Back + Toggle (meter/amount fields follow below) */
                    <div className="space-y-2.5 sm:space-y-3">
                      {/* Top bar: Back Button & Selected Provider Badge */}
                      <div className="flex-shrink-0 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedServiceId('')
                            setVariationCode('')
                            setAmount('')
                            setBillersCode('')
                            setIsVerified(false)
                            setCustomerName('')
                            setMeterVerifyError('')
                          }}
                          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all ${
                            isDarkMode
                              ? 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
                              : 'bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Providers</span>
                        </button>

                        {selectedProvider && (
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${themeStyles.badge}`}
                          >
                            <div className="w-5 h-5 rounded-full overflow-hidden relative flex-shrink-0">
                              <Image
                                src={getProviderImage(
                                  selectedProvider.serviceID,
                                  selectedProvider.image
                                )}
                                alt=""
                                width={20}
                                height={20}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                            <span>{getProviderLabel(selectedProvider)}</span>
                          </div>
                        )}
                      </div>

                      {/* Electricity Sub-Type Toggle */}
                      <div className="flex gap-2">
                        {(['prepaid', 'postpaid'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setElectricityType(type)}
                            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all capitalize ${
                              electricityType === type
                                ? `${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText}`
                                : isDarkMode
                                  ? 'border-neutral-800 bg-[#0c0c0c] text-neutral-400 hover:border-neutral-700'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Service / Provider Selection Grid */
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                      >
                        Select{' '}
                        {activeTab === 'electricity' || activeTab === 'tv'
                          ? 'Provider'
                          : 'Network'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {isServicesLoading ? (
                          Array.from({ length: 4 }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-2xl border flex flex-col items-center gap-2.5 animate-pulse ${
                                isDarkMode
                                  ? 'border-neutral-800/80 bg-[#0c0c0c]'
                                  : 'border-gray-100 bg-gray-50'
                              }`}
                            >
                              <div
                                className={`w-12 h-12 rounded-full ${
                                  isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'
                                }`}
                              />
                              <div
                                className={`h-3 w-16 rounded-md ${
                                  isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'
                                }`}
                              />
                            </div>
                          ))
                        ) : (
                          services.map((service) => (
                            <button
                              key={service.serviceID}
                              type="button"
                              onClick={() => {
                                setSelectedServiceId(service.serviceID)
                                setVariationCode('')
                                setAmount('')
                                setPlanSearch('')
                                setIsPlansExpanded(false)
                              }}
                              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2.5 ${
                                selectedServiceId === service.serviceID
                                  ? `${themeStyles.activeBorder} ${themeStyles.activeBg} scale-105 shadow-lg ${themeStyles.glow}`
                                  : isDarkMode
                                    ? 'border-neutral-800/80 bg-[#0c0c0c] hover:border-neutral-700 hover:bg-[#141414]'
                                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                              }`}
                            >
                              <ProviderIcon service={service} />
                              <span
                                className={`text-[11px] font-bold uppercase tracking-tight text-center ${
                                  selectedServiceId === service.serviceID
                                    ? `${themeStyles.activeText} font-extrabold`
                                    : isDarkMode
                                      ? 'text-neutral-300'
                                      : 'text-gray-700'
                                }`}
                              >
                                {getProviderLabel(service)}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* International Country Selection */}
              {activeTab === 'international' && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                  >
                    Select Country
                  </label>
                  <div className="relative">
                    <CustomSelect
                      options={countriesList.map((c: any) => ({
                        ...c,
                        label: `${c.name} (${c.currency})`,
                        value: c.code,
                      }))}
                      value={selectedCountryCode}
                      onChange={(val) => setSelectedCountryCode(val)}
                      placeholder="Choose a country..."
                      searchPlaceholder="Search countries..."
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* International Product Type */}
              {activeTab === 'international' && selectedCountryCode && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                  >
                    Service Type
                  </label>
                  <div className="relative">
                    <CustomSelect
                      options={productTypes.map((type: any) => ({
                        ...type,
                        label: type.name,
                        value: type.product_type_id,
                      }))}
                      value={selectedProductTypeId}
                      onChange={(val) => setSelectedProductTypeId(val)}
                      placeholder="Choose service type..."
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* International Operator */}
              {activeTab === 'international' && selectedProductTypeId && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                  >
                    Network Operator
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {isOperatorsLoading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border animate-pulse flex items-center justify-center ${
                            isDarkMode
                              ? 'border-neutral-800 bg-[#0c0c0c]'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div
                            className={`h-4 w-24 rounded ${
                              isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'
                            }`}
                          />
                        </div>
                      ))
                    ) : (
                      operators.map((op: any) => (
                        <button
                          key={op.operator_id}
                          type="button"
                          onClick={() => setSelectedOperatorId(op.operator_id)}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                            selectedOperatorId === op.operator_id
                              ? `${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText} shadow-md`
                              : isDarkMode
                                ? 'border-neutral-800 bg-[#0c0c0c] text-neutral-300 hover:border-neutral-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {op.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* International Variations (if any) */}
              {activeTab === 'international' &&
                selectedOperatorId &&
                variations.length > 0 &&
                (selectedPlan && !isPlansExpanded ? (
                  /* Minimized International Plan View */
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label
                        className={`block text-sm font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                      >
                        Selected Plan
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsPlansExpanded(true)}
                        className={`text-xs sm:text-sm font-bold hover:underline inline-flex items-center gap-1 transition-colors ${themeStyles.activeText}`}
                      >
                        <span>See all plans</span>
                        <span className="opacity-70 text-[11px]">({variations.length})</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlansExpanded(true)}
                        title="Click to view all plans"
                        className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-1.5 relative group w-full sm:w-auto min-w-[170px] max-w-xs ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.glow} shadow-md`}
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span
                            className={`text-sm sm:text-base font-black tracking-tight ${themeStyles.activeText}`}
                          >
                            {selectedPlan.variation_amount
                              ? `₦${Number(selectedPlan.variation_amount).toLocaleString()}`
                              : 'Custom'}
                          </span>
                          <div
                            className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText}`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        </div>
                        <span
                          className={`text-[11px] font-medium line-clamp-2 leading-tight ${
                            isDarkMode
                              ? 'text-neutral-200 font-semibold'
                              : 'text-gray-800 font-semibold'
                          }`}
                        >
                          {cleanPlanName(
                            selectedPlan.name,
                            selectedPlan.variation_amount,
                            selectedPlan.variation_code
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsPlansExpanded(true)}
                        className={`text-xs sm:text-sm font-bold hover:underline inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                          isDarkMode
                            ? 'text-neutral-300 hover:text-white bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                            : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <span>See all plans</span>
                        <span className="text-xs opacity-60">({variations.length})</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Expanded International Variations */
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-2">
                    <div className="flex-shrink-0 flex items-center justify-between">
                      <label
                        className={`block text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                      >
                        Select Plan
                      </label>
                      {selectedPlan && (
                        <button
                          type="button"
                          onClick={() => setIsPlansExpanded(false)}
                          className={`text-xs font-semibold hover:underline ${themeStyles.activeText}`}
                        >
                          Collapse
                        </button>
                      )}
                    </div>
                    <div className="flex-1 min-h-[160px] max-h-[320px] sm:max-h-[360px] overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {variations.map((v: any, index: number) => {
                        const isSelected =
                          variationCode === v.variation_code &&
                          (selectedPlanIndex === null || selectedPlanIndex === index)
                        return (
                          <button
                            key={`${v.variation_code}-${index}`}
                            type="button"
                            onClick={() => handlePlanChange(v.variation_code, index)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-1.5 relative group ${
                              isSelected
                                ? `${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.glow} shadow-md`
                                : isDarkMode
                                  ? 'border-neutral-800/80 bg-[#0c0c0c] hover:border-neutral-700 hover:bg-[#141414]'
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {/* Primary Text: Price + Radio/Check Indicator */}
                            <div className="flex items-center justify-between w-full">
                              <span
                                className={`text-sm sm:text-base font-black tracking-tight ${
                                  isSelected
                                    ? themeStyles.activeText
                                    : isDarkMode
                                      ? 'text-white'
                                      : 'text-gray-900'
                                }`}
                              >
                                {v.variation_amount
                                  ? `₦${Number(v.variation_amount).toLocaleString()}`
                                  : 'Custom'}
                              </span>
                              {isSelected && (
                                <div
                                  className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border transition-all ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText}`}
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            {/* Secondary Text: Plan Name with reduced font size */}
                            <span
                              className={`text-[11px] font-medium line-clamp-2 leading-tight ${
                                isSelected
                                  ? isDarkMode
                                    ? 'text-neutral-200 font-semibold'
                                    : 'text-gray-800 font-semibold'
                                  : isDarkMode
                                    ? 'text-neutral-400'
                                    : 'text-gray-600'
                              }`}
                            >
                              {cleanPlanName(
                                v.name,
                                v.variation_amount,
                                v.variation_code
                              )}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

              {/* Electricity Meter / TV Smartcard Number */}
              {(activeTab === 'electricity' || activeTab === 'tv') &&
                variationCode && (
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                    >
                      {activeTab === 'electricity'
                        ? 'Meter Number'
                        : 'Smartcard / IUC Number'}
                    </label>
                    <input
                      type="text"
                      value={billersCode}
                      onChange={(e) => setBillersCode(e.target.value)}
                      placeholder={
                        activeTab === 'electricity'
                          ? 'Enter meter number'
                          : 'Enter smartcard number'
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                        isDarkMode
                          ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                    <div className="flex items-center justify-between gap-2 mt-1.5 px-1">
                      <p className={`text-[11px] leading-tight ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                        For demo purposes, only the demo number will be successful.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const demoCode = activeTab === 'electricity' ? '1111111111111' : '1212121212'
                          setBillersCode(demoCode)
                          setMeterVerifyError('')
                          handleFillDemoDetails()
                        }}
                        className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 hover:text-amber-400 py-0.5 px-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Fill demo {activeTab === 'electricity' ? 'meter' : 'card'}</span>
                      </button>
                    </div>
                  </div>
                )}

              {/* Verification Section for Electricity/TV */}
              {(activeTab === 'electricity' || activeTab === 'tv') &&
                billersCode && (
                  <div className="pt-2">
                    {!isVerified ? (
                      <button
                        type="button"
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border ${themeStyles.activeBorder} ${themeStyles.activeBg} ${themeStyles.activeText} hover:opacity-90`}
                      >
                        {isVerifying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify Number'
                        )}
                      </button>
                    ) : (
                      <div
                        className={`p-3 rounded-lg flex items-center gap-3 ${
                          isDarkMode
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        <Check className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium uppercase opacity-70 leading-tight">
                            Customer Name
                          </p>
                          <p className="font-bold">{customerName}</p>
                        </div>
                      </div>
                    )}
                    {meterVerifyError && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {meterVerifyError}
                      </p>
                    )}
                  </div>
                )}

              {/* Phone Number */}
              {((activeTab === 'airtime' && selectedServiceId) ||
                (activeTab === 'data' && variationCode) ||
                (activeTab === 'tv' && variationCode && isVerified) ||
                (activeTab === 'electricity' &&
                  variationCode &&
                  billersCode &&
                  isVerified) ||
                (activeTab === 'international' && selectedOperatorId)) && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={handlePhoneBlur}
                    placeholder={
                      activeTab === 'international'
                        ? '+1234567890'
                        : '08012345678'
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                      isDarkMode
                        ? 'bg-[#0c0c0c] text-white placeholder-neutral-500'
                        : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                    } ${
                      phoneError
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50'
                        : `${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                            isDarkMode ? 'border-neutral-800' : 'border-gray-300'
                          }`
                    }`}
                    required
                  />
                  {phoneError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {phoneError}
                    </p>
                  )}

                  {/* Subtle Demo Info & Auto-fill */}
                  <div className="flex items-center justify-between gap-2 mt-1.5 px-1">
                    <p className={`text-[11px] leading-tight ${isDarkMode ? 'text-neutral-400' : 'text-gray-500'}`}>
                      For demo purposes, only the demo number will be successful.
                    </p>
                    <button
                      type="button"
                      onClick={handleFillDemoDetails}
                      className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 hover:text-amber-400 py-0.5 px-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Fill demo number</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Optional KYC Full Name */}
              {phone && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className={`block text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                    >
                      Full Name
                    </label>
                    <span
                      className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}
                    >
                      Optional (KYC)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Emmanuel Obiora"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all outline-none text-xs sm:text-sm ${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                      isDarkMode
                        ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              )}

              {/* Optional Email for receipt */}
              {phone && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      className={`block text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                    >
                      Email Address
                    </label>
                    <span
                      className={`text-[10px] sm:text-xs ${isDarkMode ? 'text-neutral-500' : 'text-gray-400'}`}
                    >
                      Optional (for receipt)
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all outline-none text-xs sm:text-sm ${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                      isDarkMode
                        ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              )}

              {/* Amount (for airtime, electricity, and international without variations) */}
              {phone &&
                ((activeTab === 'airtime' && selectedServiceId) ||
                  (activeTab === 'electricity' &&
                    isVerified &&
                    variationCode) ||
                  (activeTab === 'international' &&
                    selectedOperatorId &&
                    variations.length === 0)) && (
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                    >
                      Amount {activeTab !== 'international' && '(₦)'}
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="50"
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                        isDarkMode
                          ? 'bg-[#0c0c0c] border-neutral-800 text-white placeholder-neutral-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      required
                    />
                  </div>
                )}

              {/* WhatsApp Receipt Toggle */}
              {canSubmit() && (
                <div
                  className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0c0c0c] border-neutral-800' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label
                      className={`text-sm font-medium ${isDarkMode ? 'text-neutral-300' : 'text-gray-700'}`}
                    >
                      WhatsApp Receipt
                    </label>
                    <div
                      className={`flex rounded-lg p-0.5 ${isDarkMode ? 'bg-neutral-800' : 'bg-gray-200'}`}
                    >
                      <button
                        type="button"
                        onClick={() => setUseTransactionNumber(true)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          useTransactionNumber
                            ? isDarkMode
                              ? 'bg-neutral-700 text-white'
                              : 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500'
                        }`}
                      >
                        Same
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseTransactionNumber(false)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          !useTransactionNumber
                            ? isDarkMode
                              ? 'bg-neutral-700 text-white'
                              : 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500'
                        }`}
                      >
                        Other
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {!useTransactionNumber && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <input
                          type="tel"
                          value={whatsappNumber}
                          onChange={(e) => handleWhatsAppChange(e.target.value)}
                          onBlur={handleWhatsAppBlur}
                          placeholder="08012345678"
                          className={`w-full px-4 py-2.5 rounded-xl border-2 transition-all outline-none ${
                            isDarkMode
                              ? 'bg-[#121212] text-white placeholder-neutral-500'
                              : 'bg-white text-gray-900 placeholder-gray-400'
                          } ${
                            whatsappError
                              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/50'
                              : `${themeStyles.focusRing} ${themeStyles.focusBorder} ${
                                  isDarkMode ? 'border-neutral-800' : 'border-gray-300'
                                }`
                          }`}
                        />
                        {whatsappError && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {whatsappError}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p
                    className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
                  >
                    We&apos;ll send your receipt to this number
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button - Fixed at bottom of modal */}
            <div className="flex-shrink-0 flex flex-col gap-2 pt-3 border-t border-neutral-800/40 mt-1">
              {liveServiceFee > 0 && numericAmount > 0 && (
                <div
                  className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                    isDarkMode
                      ? 'bg-white/[0.02] border-white/10 text-neutral-300'
                      : 'bg-black/[0.02] border-black/5 text-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-neutral-500">
                    <span>Service face value:</span>
                    <span>₦{numericAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-500">
                    <span>Service & processing fee:</span>
                    <span className="text-emerald-500 font-medium">
                      + ₦{liveServiceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-semibold pt-1 border-t border-black/5 dark:border-white/5 text-xs sm:text-sm">
                    <span>Total:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      ₦{(numericAmount + liveServiceFee).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <div
                className={`flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl border text-[11px] ${
                  isDarkMode
                    ? 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <CreditCard className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                  <span className="font-mono text-[11px] truncate">
                    Paystack Test Card: <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>4084 · 0840 · 8408 · 4084</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTestCard}
                  className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-sans transition-all ${
                    cardCopied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-orange-400 hover:text-orange-300 border border-neutral-700'
                  }`}
                >
                  {cardCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] text-[11px] text-gray-500 dark:text-neutral-400">
                <CreditCard className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />
                <span>Secure payment powered by Paystack • No hidden fees</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-[#181818] border border-neutral-800 text-neutral-300 hover:bg-[#222222]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit()}
                  className={`flex-1 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all disabled:opacity-50 bg-gradient-to-r ${currentTheme.buttonGradient} hover:shadow-lg flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
          </motion.div>
        ) : (
          // Result Modal
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${
              isDarkMode ? 'bg-[#121212] border border-neutral-800 shadow-2xl shadow-black/80' : 'bg-white'
            }`}
          >
            <button
              onClick={() => {
                setShowResultModal(false)
                if (modalType === 'success' || modalType === 'pending') {
                  resetForm()
                  onClose()
                }
              }}
              className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-neutral-800 text-neutral-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {modalType === 'success' ? (
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shadow-lg shadow-green-500/10">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                ) : modalType === 'pending' ? (
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-blue-500 relative shadow-lg shadow-blue-500/10">
                    <div className="absolute inset-0 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shadow-lg shadow-red-500/10">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div>
                <h3
                  className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {modalType === 'success'
                    ? 'Payment & Delivery Successful!'
                    : modalType === 'pending'
                      ? 'Payment Received!'
                      : 'Transaction Failed'}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {modalMessage}
                </p>

                {modalType === 'pending' && (
                  <div className="mt-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 flex items-start sm:items-center gap-2.5 text-left">
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span>
                      Disbursing your service with the provider. You can wait here or close this window — activation will complete automatically in the background.
                    </span>
                  </div>
                )}

                {lastTransaction?.token && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-2 border-dashed ${themeStyles.activeBorder} ${themeStyles.activeBg}`}
                  >
                    <p
                      className={`text-xs uppercase font-bold mb-1 ${themeStyles.activeText}`}
                    >
                      Token / PIN
                    </p>
                    <p
                      className={`text-2xl font-black tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {lastTransaction.token}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(lastTransaction.token)
                        toast.success('Token copied!')
                      }}
                      className="text-xs mt-2 underline opacity-70 hover:opacity-100"
                    >
                      Copy Token
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowResultModal(false)
                  if (modalType === 'success' || modalType === 'pending') {
                    resetForm()
                    onClose()
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${currentTheme.buttonGradient} text-white hover:opacity-95 shadow-md`}
              >
                {modalType === 'success'
                  ? 'Done'
                  : modalType === 'pending'
                    ? 'Close (Will Complete in Background)'
                    : 'Close'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}
