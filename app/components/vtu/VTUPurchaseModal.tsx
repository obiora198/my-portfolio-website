'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import AxiosInstance from '@/app/utils/axiosInstance'
import axios from 'axios'
import toast from 'react-hot-toast'

interface VTUPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService: string | null
  onSuccess: () => void
}

type VTUTab = 'airtime' | 'data' | 'electricity' | 'international'

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
    if (!service) return 'airtime'
    const map: { [key: string]: VTUTab } = {
      airtime: 'airtime',
      data: 'data',
      'cable-tv': 'electricity',
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

  // Fetch Services
  const { data: services = [], isLoading: isServicesLoading } = useQuery<
    Service[]
  >({
    queryKey: ['services', activeTab],
    queryFn: async () => {
      const identifierMap: { [key: string]: string } = {
        airtime: 'airtime',
        data: 'data',
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
      return response.data.content.varations || []
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
      const response = await AxiosInstance.get(
        '/get-international-airtime-countries'
      )
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
        `/get-international-airtime-product-types?code=${selectedCountryCode}`
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
        `/get-international-airtime-operators?code=${selectedCountryCode}&product_type_id=${selectedProductTypeId}`
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

  // Handle Plan/Variation Change
  const handlePlanChange = (val: string) => {
    setVariationCode(val)
    const selectedPlan = variations.find((v: any) => v.variation_code === val)
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
        variation_code: variationCode,
        billersCode: activeTab === 'international' ? phone : billersCode,
      }

      if (activeTab === 'international') {
        payload.operator_id = selectedOperatorId
        payload.country_code = selectedCountryCode
        payload.product_type_id = selectedProductTypeId
        payload.email = email
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
        setModalMessage('Transaction failed. Please try again.')
        setShowResultModal(true)
      }
    } catch (err: any) {
      console.error('Purchase error:', err)
      setModalType('error')
      setModalMessage('Network error. Please check your connection.')
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
    } else if (activeTab === 'electricity') {
      return !!selectedServiceId && !!variationCode && !!billersCode
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'airtime', label: 'Airtime' },
                { id: 'data', label: 'Data' },
                { id: 'electricity', label: 'Electric' },
                { id: 'international', label: 'Intl' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as VTUTab)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
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
                    {activeTab === 'electricity' ? 'Provider' : 'Network'}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className={`w-full px-4 py-3 pr-10 rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all appearance-none cursor-pointer font-medium ${
                        isDarkMode
                          ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500 hover:border-gray-600'
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'
                      }`}
                      required
                    >
                      <option
                        value=""
                        className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
                      >
                        Choose a country...
                      </option>
                      {countriesList.map((c: any) => (
                        <option
                          key={c.code}
                          value={c.code}
                          className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
                        >
                          {c.name} ({c.currency})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
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
                  <select
                    value={selectedProductTypeId || ''}
                    onChange={(e) =>
                      setSelectedProductTypeId(Number(e.target.value))
                    }
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
                    required
                  >
                    <option value="">Choose service type...</option>
                    {productTypes.map((type: any) => (
                      <option
                        key={type.product_type_id}
                        value={type.product_type_id}
                      >
                        {type.name}
                      </option>
                    ))}
                  </select>
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

              {/* Data/Electricity Variation Selection */}
              {(activeTab === 'data' || activeTab === 'electricity') &&
                selectedServiceId && (
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Select Plan
                    </label>
                    <div className="relative">
                      <select
                        value={variationCode}
                        onChange={(e) => handlePlanChange(e.target.value)}
                        className={`w-full px-4 py-3 pr-10 rounded-lg border-2 focus:ring-2 focus:ring-offset-0 transition-all appearance-none cursor-pointer font-medium ${
                          isDarkMode
                            ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500 hover:border-gray-600'
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400'
                        }`}
                        required
                      >
                        <option
                          value=""
                          className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
                        >
                          Choose a plan...
                        </option>
                        {variations.map((v: any) => (
                          <option
                            key={v.variation_code}
                            value={v.variation_code}
                            className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
                          >
                            {v.name}{' '}
                            {v.variation_amount &&
                              `- ₦${v.variation_amount.toLocaleString()}`}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {isVariationsLoading && (
                      <p
                        className={`text-xs mt-2 ${isDarkMode ? 'text-orange-400' : 'text-indigo-600'} animate-pulse flex items-center gap-1`}
                      >
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Loading plans...
                      </p>
                    )}
                  </div>
                )}

              {/* Electricity Meter Number */}
              {activeTab === 'electricity' && variationCode && (
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Meter Number
                  </label>
                  <input
                    type="text"
                    value={billersCode}
                    onChange={(e) => setBillersCode(e.target.value)}
                    placeholder="Enter meter number"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                    }`}
                    required
                  />
                </div>
              )}

              {/* Phone Number */}
              {((activeTab === 'airtime' && selectedServiceId) ||
                (activeTab === 'data' && variationCode) ||
                (activeTab === 'electricity' && variationCode && billersCode) ||
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
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={
                      activeTab === 'international'
                        ? 'Include country code'
                        : '08012345678'
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
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="WhatsApp number"
                          className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 transition-all ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white focus:ring-orange-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500'
                          }`}
                        />
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
