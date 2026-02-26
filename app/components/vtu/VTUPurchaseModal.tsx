'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import AxiosInstance from '@/app/utils/axiosInstance'
import axios from 'axios'
import toast from 'react-hot-toast'
import { CustomSelect } from '@/app/vtu/components/CustomSelect'

interface VTUPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService: string | null
  onSuccess: () => void
}

type VTUTab = 'airtime' | 'data' | 'tv' | 'electricity' | 'international'

interface Service {
  serviceID: string
  name: string
  image: string
}

export function VTUPurchaseModal({
  isOpen,
  onClose,
  selectedService,
  onSuccess,
}: VTUPurchaseModalProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

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
    }
    return map[service] || 'airtime'
  }

  const [activeTab, setActiveTab] = useState<VTUTab>(
    getTabFromService(selectedService)
  )
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [billersCode, setBillersCode] = useState('')
  const [variationCode, setVariationCode] = useState('')
  const [email, setEmail] = useState('')

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

  // Update tab when selectedService changes
  useEffect(() => {
    if (selectedService && isOpen) {
      setActiveTab(getTabFromService(selectedService))
    }
  }, [selectedService, isOpen])

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
      return (
        response.data.content.variations ||
        response.data.content.varations ||
        []
      )
    },
    enabled:
      activeTab !== 'airtime' &&
      (activeTab === 'international'
        ? !!selectedOperatorId && !!selectedProductTypeId
        : !!selectedServiceId) &&
      isOpen,
    staleTime: 1000 * 60 * 30,
  })

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
  const { data: operators = [] } = useQuery({
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
      return intlPattern.test(phoneNumber)
    } else {
      // Nigerian: Must be 11 digits starting with 0, or 10 digits without 0
      const nigerianPattern = /^(0|\+234)?[789]\d{9}$/
      return nigerianPattern.test(phoneNumber.replace(/\s/g, ''))
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    if (value && !validatePhone(value, activeTab === 'international')) {
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
    if (value && !validatePhone(value, false)) {
      setWhatsappError('Enter valid Nigerian number (e.g., 08012345678)')
    } else {
      setWhatsappError('')
    }
  }

  // Check Transaction Status (Requery)
  const checkTransactionStatus = async (
    requestId: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post('/api/vtu/requery', {
        request_id: requestId,
      })

      const code = response.data.code
      const status = response.data.content?.transactions?.status

      if (code === '000') {
        if (status === 'delivered' || status === 'successful') {
          setModalType('success')
          setModalMessage('Transaction successful!')
          setShowResultModal(true)
          onSuccess()
          return true
        } else if (
          status === 'pending' ||
          status === 'initiated' ||
          status === 'processing'
        ) {
          setModalType('pending')
          setModalMessage('Processing... Retrying in 5s')
          setTimeout(() => checkTransactionStatus(requestId), 5000)
          return false
        } else {
          setModalType('error')
          setModalMessage(`Transaction failed: ${status}`)
          setShowResultModal(true)
          return false
        }
      } else if (code === '099' || code === '089') {
        setTimeout(() => checkTransactionStatus(requestId), 5000)
        return false
      } else {
        setModalType('error')
        setModalMessage('Transaction verification failed')
        setShowResultModal(true)
        return false
      }
    } catch (err) {
      console.error('Requery error:', err)
      setTimeout(() => checkTransactionStatus(requestId), 10000)
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
  const handlePlanChange = (val: string) => {
    setVariationCode(val)
    // Find the exact plan using index to handle duplicates correctly
    const selectedPlan = variations.find(
      (v: any, index: number) => `${v.variation_code}-${index}` === val
    )
    if (selectedPlan?.variation_amount) {
      setAmount(selectedPlan.variation_amount)
    }
  }

  // Handle Purchase
  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requestId = generateRequestId()
      const payload: any = {
        request_id: requestId,
        serviceID:
          activeTab === 'international' ? 'foreign-airtime' : selectedServiceId,
        amount: Number(amount),
        phone: phone,
        variation_code: variationCode.includes('-')
          ? variationCode.split('-').slice(0, -1).join('-')
          : variationCode,
        billersCode: activeTab === 'international' ? phone : billersCode,
      }

      if (activeTab === 'international') {
        payload.operator_id = selectedOperatorId
        payload.country_code = selectedCountryCode
        payload.product_type_id = selectedProductTypeId
        payload.email = email
      }

      if (activeTab === 'tv') {
        payload.subscription_type = subscriptionType
      }

      payload.whatsappNumber = useTransactionNumber ? phone : whatsappNumber
      payload.activeTab = activeTab

      // Store for receipt
      setLastTransaction({
        requestId,
        serviceID: payload.serviceID,
        amount: payload.amount,
        phone: payload.phone,
        billersCode: payload.billersCode,
        whatsappNumber: payload.whatsappNumber,
      })

      const response = await axios.post('/api/vtu/pay', payload)
      const code = response.data.code
      const status = response.data.content?.transactions?.status

      if (code === '000') {
        // Look for token in response
        const token = response.data.token
        if (token) {
          setLastTransaction((prev: any) => ({ ...prev, token }))
        }

        if (status === 'delivered' || status === 'successful') {
          setModalType('success')
          setModalMessage('Transaction successful!')
          setShowResultModal(true)
          setAmount('')
          setPhone('')
          onSuccess()
        } else {
          setModalType('pending')
          setModalMessage('Processing transaction...')
          setShowResultModal(true)
          setTimeout(() => checkTransactionStatus(requestId), 5000)
        }
      } else if (code === '099' || code === '089') {
        setModalType('pending')
        setModalMessage('Processing...')
        setShowResultModal(true)
        setTimeout(() => checkTransactionStatus(requestId), 5000)
      } else {
        setModalType('error')
        setModalMessage(
          response.data.response_description ||
            'Transaction failed. Please try again.'
        )
        setShowResultModal(true)
      }
    } catch (err: any) {
      console.error('Purchase error:', err)
      setModalType('error')
      setModalMessage(
        err.response?.data?.message || 'Network error. Please try again.'
      )
      setShowResultModal(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const canSubmit = () => {
    if (!phone) return false

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
      if (email && selectedOperatorId) {
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 shadow-2xl ${
              isDarkMode ? 'bg-[#1C1E2E] border border-gray-800' : 'bg-white'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2
                className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                Purchase Services
              </h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Select a service and complete your purchase
              </p>
            </div>

            {/* Service Tabs */}
            <div className="flex overflow-x-auto pb-4 sm:grid sm:grid-cols-5 gap-2 mb-6 scrollbar-hide">
              {[
                { id: 'airtime', label: 'Airtime' },
                { id: 'data', label: 'Data' },
                { id: 'tv', label: 'TV' },
                { id: 'electricity', label: 'Electric' },
                { id: 'international', label: 'Intl' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as VTUTab)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap min-w-[100px] sm:min-w-0 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${currentTheme.buttonGradient} text-white shadow-lg`
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Purchase Form */}
            <form onSubmit={handlePurchase} className="space-y-5">
              {/* Service/Provider Selection */}
              {activeTab !== 'international' && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Select{' '}
                    {activeTab === 'electricity' || activeTab === 'tv'
                      ? 'Provider'
                      : 'Network'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {isServicesLoading ? (
                      <div className="col-span-full text-center py-4">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      </div>
                    ) : (
                      services.map((service) => (
                        <button
                          key={service.serviceID}
                          type="button"
                          onClick={() =>
                            setSelectedServiceId(service.serviceID)
                          }
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            selectedServiceId === service.serviceID
                              ? isDarkMode
                                ? 'border-orange-500 bg-orange-500/10'
                                : 'border-indigo-500 bg-indigo-50'
                              : isDarkMode
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                '/images/airtime.jpg'
                            }}
                          />
                          <span
                            className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {service.name.split(' ')[0]}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* International Country Selection */}
              {activeTab === 'international' && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Network Operator
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {operators.map((op: any) => (
                      <button
                        key={op.operator_id}
                        type="button"
                        onClick={() => setSelectedOperatorId(op.operator_id)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          selectedOperatorId === op.operator_id
                            ? isDarkMode
                              ? 'border-orange-500 bg-orange-500/10'
                              : 'border-indigo-500 bg-indigo-50'
                            : isDarkMode
                              ? 'border-gray-700 hover:border-gray-600'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {op.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Electricity Type */}
              {activeTab === 'electricity' && (
                <div className="flex gap-2 mb-4">
                  {(['prepaid', 'postpaid'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setElectricityType(type)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        electricityType === type
                          ? isDarkMode
                            ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                            : 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : isDarkMode
                            ? 'border-gray-700 text-gray-400'
                            : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* TV Subscription Type */}
              {activeTab === 'tv' && (
                <div className="flex gap-2 mb-4">
                  {(['renew', 'change'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSubscriptionType(type)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        subscriptionType === type
                          ? isDarkMode
                            ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                            : 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : isDarkMode
                            ? 'border-gray-700 text-gray-400'
                            : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Data/TV/Electricity Variation Selection */}
              {(activeTab === 'data' ||
                activeTab === 'electricity' ||
                activeTab === 'tv') &&
                selectedServiceId && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Select Plan
                    </label>
                    <div className="relative">
                      <CustomSelect
                        options={variations.map((v: any, index: number) => ({
                          ...v,
                          label: v.name,
                          value: `${v.variation_code}-${index}`,
                          original_variation_code: v.variation_code,
                        }))}
                        value={variationCode}
                        onChange={(val) => handlePlanChange(val)}
                        placeholder="Choose a plan..."
                        isLoading={isVariationsLoading}
                        searchPlaceholder="Search plans..."
                        renderOption={(option) => (
                          <div className="flex flex-col w-full text-left">
                            <span className="text-sm font-bold truncate">
                              {option.name}
                            </span>
                            <div className="flex items-center justify-between mt-1">
                              {option.variation_amount && (
                                <span className="text-xs text-indigo-500 font-black">
                                  ₦
                                  {Number(
                                    option.variation_amount
                                  ).toLocaleString()}
                                </span>
                              )}
                              {option.fixedPrice === 'Yes' && (
                                <span className="text-[8px] uppercase tracking-tighter bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded-full">
                                  Fixed Price
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        className="w-full"
                      />
                    </div>
                    {isVariationsLoading && (
                      <div
                        className={`text-xs mt-2 ${isDarkMode ? 'text-orange-400' : 'text-indigo-600'} animate-pulse flex items-center gap-1`}
                      >
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading plans...
                      </div>
                    )}
                  </div>
                )}

              {/* Electricity Meter / TV Smartcard Number */}
              {(activeTab === 'electricity' || activeTab === 'tv') &&
                variationCode && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition-all ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                      }`}
                      required
                    />
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
                        className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          isDarkMode
                            ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
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
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder={
                      activeTab === 'international'
                        ? '+1234567890'
                        : '08012345678'
                    }
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all ${
                      phoneError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
                    required
                  />
                  {phoneError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {phoneError}
                    </p>
                  )}
                </div>
              )}

              {/* International Email */}
              {activeTab === 'international' && selectedOperatorId && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
                    required
                  />
                </div>
              )}

              {/* Amount (for airtime and international without variations) */}
              {phone &&
                ((activeTab === 'airtime' && selectedServiceId) ||
                  (activeTab === 'international' &&
                    selectedOperatorId &&
                    variations.length === 0)) && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Amount {activeTab !== 'international' && '(₦)'}
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="50"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition-all ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                      }`}
                      required
                    />
                  </div>
                )}

              {/* WhatsApp Receipt Toggle */}
              {canSubmit() && (
                <div
                  className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label
                      className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      WhatsApp Receipt
                    </label>
                    <div
                      className={`flex rounded-lg p-0.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                      <button
                        type="button"
                        onClick={() => setUseTransactionNumber(true)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                          useTransactionNumber
                            ? isDarkMode
                              ? 'bg-gray-600 text-white'
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
                              ? 'bg-gray-600 text-white'
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
                          placeholder="08012345678"
                          className={`w-full px-4 py-2.5 rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all ${
                            whatsappError
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-orange-500 focus:border-orange-500'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                        />
                        {whatsappError && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
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

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !canSubmit()}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 bg-gradient-to-r ${currentTheme.buttonGradient} hover:shadow-lg flex items-center justify-center gap-2`}
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
            </form>
          </motion.div>
        ) : (
          // Result Modal
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${
              isDarkMode ? 'bg-[#1C1E2E] border border-gray-800' : 'bg-white'
            }`}
          >
            <button
              onClick={() => {
                setShowResultModal(false)
                if (modalType === 'success') onClose()
              }}
              className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                {modalType === 'success' ? (
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div>
                <h3
                  className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {modalType === 'success'
                    ? 'Success!'
                    : modalType === 'pending'
                      ? 'Processing'
                      : 'Transaction Failed'}
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {modalMessage}
                </p>

                {lastTransaction?.token && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-2 border-dashed ${
                      isDarkMode
                        ? 'bg-orange-500/5 border-orange-500/30'
                        : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <p
                      className={`text-xs uppercase font-bold mb-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}
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
                  if (modalType === 'success') onClose()
                }}
                className={`w-full py-3 rounded-lg font-semibold transition-all bg-gradient-to-r ${currentTheme.buttonGradient} text-white`}
              >
                {modalType === 'success' ? 'Done' : 'Close'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}
