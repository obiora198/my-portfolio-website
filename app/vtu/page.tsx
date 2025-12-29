'use client'

import { useEffect, useState } from 'react'
import AxiosInstance from '../utils/axiosInstance'
import Nav from '../components/nav/Nav'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  BsLightningCharge,
  BsShieldCheck,
  BsClockHistory,
  BsWallet2,
  BsPlusCircle,
  BsChevronDown,
  BsCheckCircleFill,
  BsInstagram,
  BsTwitter,
  BsWhatsapp,
} from 'react-icons/bs'
import {
  MdOutlineMobileFriendly,
  MdOutlineTv,
  MdOutlinePower,
  MdErrorOutline,
} from 'react-icons/md'
import { BiSupport } from 'react-icons/bi'
import { IoCloseOutline } from 'react-icons/io5'

interface Service {
  serviceID: string
  name: string
  image: string
}

const VTUPage = () => {
  const [activeTab, setActiveTab] = useState('airtime')
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [billersCode, setBillersCode] = useState('')
  const [variationCode, setVariationCode] = useState('')
  const [email, setEmail] = useState('')
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<
    number | null
  >(null)
  const [selectedOperatorId, setSelectedOperatorId] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalType, setModalType] = useState<
    'success' | 'error' | 'pending' | null
  >(null)
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [useTransactionNumber, setUseTransactionNumber] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // Artificial delay for premium loader feel
    const timer = setTimeout(() => setIsInitialLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    {
      id: 'airtime',
      label: 'Airtime',
      icon: <MdOutlineMobileFriendly size={20} />,
    },
    { id: 'data', label: 'Data', icon: <BsPlusCircle size={18} /> },
    {
      id: 'electricity',
      label: 'Electricity',
      icon: <MdOutlinePower size={22} />,
    },
    {
      id: 'international',
      label: 'International',
      icon: <BsPlusCircle size={18} />,
    },
  ]

  // Fetch History from MongoDB with auto-refresh for status tracking
  const { data: transactionHistory = [], refetch: refetchHistory } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await axios.get('/api/vtu/history')
      return response.data
    },
    enabled: true,
    refetchInterval: 10000, // Refresh every 10s to sync status
    staleTime: 120000, // Keep data fresh for 2 mins unless refetched
  })

  const {
    data: services = [],
    isLoading: isServicesLoading,
    error: servicesError,
  } = useQuery<Service[]>({
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
      // Sanitize image URLs and filter out international from airtime list
      const filteredAndSanitized = response.data.content
        .filter((service: any) => service.serviceID !== 'foreign-airtime')
        .map((service: any) => ({
          ...service,
          image: service.image.replace('-VTU', ''),
        }))
      return filteredAndSanitized
    },
    enabled: activeTab !== 'international',
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  })

  // Fetch Variations for Data/Electricity/International
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
        : !!selectedServiceId),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })

  // Fetch International Countries
  const { data: countriesList = [], isLoading: isCountriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await AxiosInstance.get(
        '/get-international-airtime-countries'
      )
      return response.data.content.countries || []
    },
    enabled: activeTab === 'international',
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  // Fetch Product Types for Country
  const { data: productTypes = [], isLoading: isProductTypesLoading } =
    useQuery({
      queryKey: ['productTypes', selectedCountryCode],
      queryFn: async () => {
        if (!selectedCountryCode) return []
        const response = await AxiosInstance.get(
          `/get-international-airtime-product-types?code=${selectedCountryCode}`
        )
        return response.data.content || []
      },
      enabled: activeTab === 'international' && !!selectedCountryCode,
      staleTime: 1000 * 60 * 60, // 1 hour
    })

  // Fetch Operators for Product Type
  const { data: operators = [], isLoading: isOperatorsLoading } = useQuery({
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
      !!selectedProductTypeId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })

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

  const checkTransactionStatus = async (requestId: string) => {
    try {
      const response = await axios.post('/api/vtu/requery', {
        request_id: requestId,
      })

      const code = response.data.code
      const description = response.data.response_description

      // 000 = TRANSACTION PROCESSED - Check internal status
      if (code === '000') {
        const transactions = response.data.content?.transactions
        const status = transactions?.status

        if (status === 'delivered' || status === 'successful') {
          setModalType('success')
          setModalMessage('Transaction successful and delivered!')
          setShowModal(true)
          setAmount('')
          setPhone('')
          refetchHistory()
          return true
        } else if (
          status === 'pending' ||
          status === 'initiated' ||
          status === 'processing'
        ) {
          // If still pending, only update message but DON'T force modal open
          // This allows users to close the modal and stay on the dashboard
          setModalType('pending')
          setModalMessage('Transaction is still pending. Retrying...')
          setTimeout(() => checkTransactionStatus(requestId), 5000)
          return false
        } else {
          setModalType('error')
          setModalMessage(`Transaction failure: ${status || 'Unknown failure'}`)
          setShowModal(true)
          refetchHistory()
          return false
        }
      }
      // 099 or 089 = PROCESSING - Retry
      else if (code === '099' || code === '089') {
        setModalType('pending')
        setModalMessage('System is processing. Please wait...')
        setTimeout(() => checkTransactionStatus(requestId), 5000)
        return false
      }
      // Any other code is a failure for requery
      else {
        setModalType('error')
        setModalMessage(description || `Verification failed (Code: ${code})`)
        setShowModal(true)
        return false
      }
    } catch (err: any) {
      console.error('Requery error:', err)
      setModalType('error')
      setModalMessage('Connection error during status check. Retrying...')
      setTimeout(() => checkTransactionStatus(requestId), 10000)
      return false
    }
  }

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

      // Metadata for MongoDB
      payload.whatsappNumber = useTransactionNumber ? phone : whatsappNumber
      payload.activeTab = activeTab

      // Use internal API proxy
      const response = await axios.post('/api/vtu/pay', payload)

      const code = response.data.code
      const description = response.data.response_description

      // 000 = TRANSACTION PROCESSED - Check status
      if (code === '000') {
        const transactions = response.data.content?.transactions
        const status = transactions?.status

        if (status === 'delivered' || status === 'successful') {
          setModalType('success')
          setModalMessage(
            `Transaction successful! A receipt will be sent to ${
              useTransactionNumber ? phone : whatsappNumber
            } via WhatsApp.`
          )
          setShowModal(true)
          setAmount('')
          setPhone('')
          refetchHistory()
        } else {
          // If 000 but NOT delivered, treat as pending and requery
          setModalType('pending')
          setModalMessage('Transaction initiated. Verifying status...')
          setShowModal(true)
          setTimeout(() => checkTransactionStatus(requestId), 5000)
        }
      }
      // 099 or 089 = PROCESSING - Requery
      else if (code === '099' || code === '089') {
        setModalType('pending')
        setModalMessage('Transaction is processing. Please wait...')
        setShowModal(true)
        setTimeout(() => checkTransactionStatus(requestId), 5000)
      }
      // Specific Failure Codes (011-087 etc)
      else if (
        ['016', '013', '017', '018', '019', '010', '012'].includes(code)
      ) {
        setModalType('error')
        setModalMessage(
          description || 'Transaction failed. Please check details.'
        )
        setShowModal(true)
      }
      // Any other unexpected response - Treat as pending (as per docs)
      else {
        setModalType('pending')
        setModalMessage('Status unclear. Verifying with provider...')
        setShowModal(true)
        setTimeout(() => checkTransactionStatus(requestId), 5000)
      }
    } catch (err: any) {
      console.error('Purchase error:', err)
      // Treatment for timeout/network error as per docs: treat as pending
      setModalType('error')
      setModalMessage(
        'Network error. If you were charged, please check your history.'
      )
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 min-h-screen font-sans">
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white dark:bg-slate-950 flex flex-col items-center justify-center gap-6"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Stay Connected
              </h2>
              <p className="text-slate-500 font-medium">
                Preparing your dashboard...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Nav />

      {/* Transaction Result Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>

              <div className="text-center space-y-6 pt-4">
                <div className="flex justify-center">
                  {modalType === 'success' ? (
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <BsCheckCircleFill size={48} />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <MdErrorOutline size={48} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3
                    className={`text-2xl font-bold ${
                      modalType === 'success'
                        ? 'text-slate-900 dark:text-white'
                        : modalType === 'pending'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {modalType === 'success'
                      ? 'Payment Confirmed!'
                      : modalType === 'pending'
                        ? 'Securely Processing'
                        : 'Action Required'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                    {modalMessage}
                  </p>
                  {modalType === 'pending' && (
                    <p className="text-xs text-slate-400 font-medium italic mt-2">
                      You can safely close this window. We'll continue
                      processing in the background. Check the History tab for
                      real-time updates.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className={`w-full py-5 rounded-2xl font-bold text-xl transition-all active:scale-[0.98] ${
                    modalType === 'success'
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                      : modalType === 'pending'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20'
                  }`}
                >
                  {modalType === 'success'
                    ? 'Perfect, Thanks'
                    : modalType === 'pending'
                      ? 'Track in History'
                      : 'Got it'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 sm:px-16 md:px-24 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Stay Connected
            </span>
            , In One Place
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Top up airtime, buy data, and settle bills in seconds — no stress,
            no delays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <button
              onClick={() => {
                const element = document.getElementById('services-form')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-lg"
            >
              Get Started Now
            </button>
            <Link
              href="#learn-more"
              className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl font-bold transition-all duration-300 w-full sm:w-auto text-lg"
            >
              Learn VTU Basics
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tabbed Interface Section */}
      <section className="px-6 sm:px-16 md:px-24 pb-24">
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-600/5 border border-slate-100 dark:border-slate-800/50 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                I Want To Buy
              </h2>
              {/* Tab Navigation Buttons */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setSelectedServiceId('')
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Messages (Services Load Errors Only) */}
            <AnimatePresence>
              {(servicesError as any) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl font-bold text-center"
                >
                  {(servicesError as any)?.message ||
                    'Failed to load services.'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Unified Dynamic Form */}
            <div id="services-form">
              {isServicesLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-10 h-10 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-bold animate-pulse">
                    Loading Services...
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.form
                    key={activeTab}
                    onSubmit={handlePurchase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                        Select{' '}
                        {activeTab === 'electricity'
                          ? 'Provider'
                          : activeTab === 'international'
                            ? 'Country'
                            : 'Network'}
                      </label>
                      {activeTab === 'international' ? (
                        <div className="relative">
                          <select
                            value={selectedCountryCode}
                            onChange={(e) =>
                              setSelectedCountryCode(e.target.value)
                            }
                            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold appearance-none cursor-pointer"
                            required
                          >
                            <option value="">Choose a country...</option>
                            {countriesList.map((c: any) => (
                              <option key={c.code} value={c.code}>
                                {c.name} ({c.currency})
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <BsChevronDown size={14} />
                          </div>
                          {isCountriesLoading && (
                            <p className="absolute -bottom-5 left-0 text-[10px] text-indigo-500 font-bold animate-pulse">
                              Loading countries...
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {services.map((service) => (
                            <button
                              key={service.serviceID}
                              type="button"
                              onClick={() =>
                                setSelectedServiceId(service.serviceID)
                              }
                              className={`py-3.5 border rounded-2xl transition-all font-bold group flex flex-col items-center gap-2 ${
                                selectedServiceId === service.serviceID
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 hover:border-indigo-400'
                              }`}
                            >
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-7 h-7 rounded-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/images/airtime.jpg'
                                }}
                              />
                              <span className="text-[10px] uppercase tracking-wider truncate px-2 w-full text-center">
                                {service.name.split(' ')[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {(selectedServiceId ||
                        (activeTab === 'international' &&
                          selectedCountryCode)) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-6 overflow-hidden pt-2"
                        >
                          {/* International Product Type */}
                          {activeTab === 'international' && (
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Service Type
                              </label>
                              <div className="flex gap-3">
                                {productTypes.map((type: any) => (
                                  <button
                                    key={type.product_type_id}
                                    type="button"
                                    onClick={() =>
                                      setSelectedProductTypeId(
                                        type.product_type_id
                                      )
                                    }
                                    className={`flex-1 py-3 border rounded-xl font-bold text-xs transition-all ${
                                      selectedProductTypeId ===
                                      type.product_type_id
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                    }`}
                                  >
                                    {type.name}
                                  </button>
                                ))}
                              </div>
                              {isProductTypesLoading && (
                                <p className="text-[10px] text-indigo-500 font-bold animate-pulse">
                                  Loading categories...
                                </p>
                              )}
                            </div>
                          )}

                          {/* International Operator */}
                          {activeTab === 'international' &&
                            selectedProductTypeId && (
                              <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                  Network Operator
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  {operators.map((op: any) => (
                                    <button
                                      key={op.operator_id}
                                      type="button"
                                      onClick={() =>
                                        setSelectedOperatorId(op.operator_id)
                                      }
                                      className={`py-3 border rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                        selectedOperatorId === op.operator_id
                                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                          : 'border-slate-200 dark:border-slate-800 text-slate-500'
                                      }`}
                                    >
                                      {op.operator_image && (
                                        <img
                                          src={op.operator_image}
                                          className="w-4 h-4 rounded-full"
                                          onError={(e) => {
                                            const target =
                                              e.target as HTMLImageElement
                                            target.src = '/images/airtime.jpg'
                                          }}
                                        />
                                      )}
                                      {op.name}
                                    </button>
                                  ))}
                                </div>
                                {isOperatorsLoading && (
                                  <p className="text-[10px] text-indigo-500 font-bold animate-pulse">
                                    Loading operators...
                                  </p>
                                )}
                              </div>
                            )}
                          {/* Electricity Meter Number */}
                          {activeTab === 'electricity' && (
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Meter Number
                              </label>
                              <input
                                type="text"
                                value={billersCode}
                                onChange={(e) => setBillersCode(e.target.value)}
                                placeholder="Enter meter number"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold"
                                required
                              />
                            </div>
                          )}

                          {/* Variation Selection (Data or Electricity type) */}
                          {(activeTab === 'data' ||
                            activeTab === 'electricity') && (
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Select Plan
                              </label>
                              <div className="relative">
                                <select
                                  value={variationCode}
                                  onChange={(e) =>
                                    setVariationCode(e.target.value)
                                  }
                                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold appearance-none cursor-pointer"
                                  required
                                >
                                  <option value="">Choose a plan...</option>
                                  {variations.map((v: any) => (
                                    <option
                                      key={v.variation_code}
                                      value={v.variation_code}
                                    >
                                      {v.name} - ₦{v.variation_amount}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <BsChevronDown size={14} />
                                </div>
                              </div>
                              {isVariationsLoading && (
                                <p className="text-[10px] text-indigo-500 font-bold animate-pulse">
                                  Loading plans...
                                </p>
                              )}
                            </div>
                          )}

                          {/* Phone Number (for Airtime/Data/International) */}
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {activeTab === 'international'
                                  ? 'Recipient Phone'
                                  : 'Phone Number'}
                              </label>
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={
                                  activeTab === 'international'
                                    ? 'Include country code'
                                    : '08011111111'
                                }
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold"
                                required
                              />
                            </div>

                            {/* WhatsApp Receipt Toggle */}
                            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                  WhatsApp Receipt
                                </span>
                                <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setUseTransactionNumber(true)
                                    }
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                                      useTransactionNumber
                                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    SAME NO
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setUseTransactionNumber(false)
                                    }
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                                      !useTransactionNumber
                                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    OTHER
                                  </button>
                                </div>
                              </div>
                              <AnimatePresence>
                                {!useTransactionNumber && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2"
                                  >
                                    <input
                                      type="tel"
                                      value={whatsappNumber}
                                      onChange={(e) =>
                                        setWhatsappNumber(e.target.value)
                                      }
                                      placeholder="WhatsApp number"
                                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <p className="text-[10px] text-slate-400 font-medium italic">
                                We will send your transaction receipt to this
                                number on WhatsApp.
                              </p>
                            </div>
                          </div>

                          {/* Email Address (for International) */}
                          {activeTab === 'international' && (
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Your Email Address
                              </label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="customer@example.com"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold"
                                required
                              />
                            </div>
                          )}

                          {/* Amount (Only for Airtime or Electricity manual entry) */}
                          {(activeTab === 'airtime' ||
                            activeTab === 'electricity') && (
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Amount
                              </label>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                  ₦
                                </span>
                                <input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  placeholder="0.00"
                                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-10 pr-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-bold"
                                  required
                                />
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-3 active:scale-[0.99] mt-4`}
                          >
                            {loading ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              'Pay Securely'
                            )}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* History & Search Section */}
      <section className="px-6 sm:px-16 md:px-24 pb-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Search Box */}
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by Transaction ID or Phone No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] py-5 px-6 pl-14 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-slate-900 dark:text-white shadow-xl shadow-indigo-600/5"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
              <BsClockHistory size={20} />
            </div>
            <button
              onClick={async () => {
                if (!searchQuery) return
                setIsSearching(true)
                try {
                  const response = await axios.get(
                    `/api/vtu/search?q=${searchQuery}`
                  )
                  setSearchResults(response.data)
                } catch (err) {
                  console.error('Search error:', err)
                } finally {
                  setIsSearching(false)
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              {isSearching ? '...' : 'SEARCH'}
            </button>
          </div>

          {/* History List */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-indigo-600/5 border border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <BsClockHistory className="text-indigo-600" />
                Transaction History
              </h3>
              {searchResults.length > 0 && (
                <button
                  onClick={() => setSearchResults([])}
                  className="text-xs font-bold text-indigo-600 hover:underline px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
                >
                  Clear Search
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(searchResults.length > 0 ? searchResults : transactionHistory)
                .length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-4">
                    <BsClockHistory size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold">
                    No transactions found yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Your recent activities will appear here.
                  </p>
                </div>
              ) : (
                (searchResults.length > 0
                  ? searchResults
                  : transactionHistory
                ).map((tx: any) => (
                  <div
                    key={tx.requestId}
                    className="group bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-600/5 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          tx.status === 'delivered' ||
                          tx.status === 'successful'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : tx.status === 'failed'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                        }`}
                      >
                        {tx.activeTab === 'airtime' ? (
                          <MdOutlineMobileFriendly size={24} />
                        ) : tx.activeTab === 'data' ? (
                          <BsPlusCircle size={22} />
                        ) : tx.activeTab === 'electricity' ? (
                          <MdOutlinePower size={24} />
                        ) : (
                          <MdOutlineTv size={24} />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {tx.activeTab}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                              tx.status === 'delivered' ||
                              tx.status === 'successful'
                                ? 'bg-green-500 text-white'
                                : tx.status === 'failed'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-orange-500 text-white'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase leading-tight">
                          {tx.serviceID.replace('-', ' ')} • ₦{tx.amount}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-bold flex items-center gap-2">
                          <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                            {tx.billersCode || tx.phone}
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          {new Date(tx.timestamp).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {tx.status !== 'failed' && (
                        <a
                          href={`https://wa.me/${tx.whatsappNumber}?text=${encodeURIComponent(
                            `*TRANSACTION RECEIPT*\n\nID: ${tx.requestId}\nService: ${tx.serviceID}\nAmount: ₦${tx.amount}\nTarget: ${tx.billersCode || tx.phone}\nStatus: ${tx.status}\nDate: ${new Date(tx.timestamp).toLocaleString()}\n\nThank you for choosing our platform!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-[11px] font-black flex items-center gap-2 transition-all shadow-md shadow-green-500/10 active:scale-95"
                        >
                          <BsWhatsapp size={14} /> RECEIPT
                        </a>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tx.requestId)
                        }}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95"
                        title="Copy Request ID"
                      >
                        <BsShieldCheck size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our VTU Platform */}
      <section className="py-24 px-6 sm:px-16 md:px-24 bg-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                🚀 Why Choose Our VTU Platform
              </h2>
              <div className="space-y-6">
                <p className="text-xl text-indigo-100 font-medium">
                  A single platform built for speed, reliability, and profit.
                </p>
                <div className="overflow-hidden rounded-3xl border border-white/20">
                  <table className="w-full text-left">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="p-5 font-bold uppercase tracking-wider text-sm">
                          Service
                        </th>
                        <th className="p-5 font-bold uppercase tracking-wider text-sm">
                          Benefit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="p-5 font-bold">Airtime & Data</td>
                        <td className="p-5 text-indigo-50">
                          Instant delivery, no delays
                        </td>
                      </tr>
                      <tr>
                        <td className="p-5 font-bold">Electricity Bills</td>
                        <td className="p-5 text-indigo-50">
                          Pay and receive tokens instantly
                        </td>
                      </tr>
                      <tr>
                        <td className="p-5 font-bold">TV Subscriptions</td>
                        <td className="p-5 text-indigo-50">
                          DSTV, GOTV & Startimes
                        </td>
                      </tr>
                      <tr>
                        <td className="p-5 font-bold">VTU Reselling</td>
                        <td className="p-5 text-indigo-50">
                          Earn commission on every transaction
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Link
                  href="/services"
                  className="inline-block mt-4 text-white font-bold underline underline-offset-8 decoration-2 hover:text-indigo-200 transition-colors"
                >
                  View All Services
                </Link>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <BsLightningCharge size={40} className="mb-4 text-yellow-300" />
                <h3 className="text-xl font-bold mb-2">Fast Execution</h3>
                <p className="text-indigo-100 text-sm">
                  Transactions are processed in milliseconds.
                </p>
              </div>
              <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <BsShieldCheck size={40} className="mb-4 text-green-300" />
                <h3 className="text-xl font-bold mb-2">Maximum Security</h3>
                <p className="text-indigo-100 text-sm">
                  Military-grade encryption for all payments.
                </p>
              </div>
              <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <BsClockHistory size={40} className="mb-4 text-blue-300" />
                <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
                <p className="text-indigo-100 text-sm">
                  Our systems never sleep. Buy anytime.
                </p>
              </div>
              <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                <BiSupport size={40} className="mb-4 text-pink-300" />
                <h3 className="text-xl font-bold mb-2">Expert Support</h3>
                <p className="text-indigo-100 text-sm">
                  We're always here to help you resolve issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 sm:px-16 md:px-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-600/5 rounded-[3rem] blur-2xl"></div>
              <img
                src="/images/vtu-mockup.png"
                alt="VTU App"
                className="relative rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800"
              />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <div>
              <h4 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.3em] text-sm mb-4">
                🎯 Benefits
              </h4>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                What Changes When You Use Our VTU Platform
              </h2>
            </div>
            <div className="space-y-6">
              {[
                'No more failed transactions',
                'Buy VTU at discounted rates',
                'Earn steady income daily',
                'Simple dashboard anyone can use',
                'Secure wallet & transaction history',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <BsCheckCircleFill size={18} />
                  </div>
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 sm:px-16 md:px-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto text-center">
          <h4 className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.3em] text-sm mb-4">
            ⚙️ How It Works
          </h4>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-16">
            Get Started in 3 Easy Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-100 dark:bg-slate-800 -translate-y-1/2 -z-10"></div>
            {[
              {
                step: '01',
                title: 'Create a free account',
                desc: 'Sign up in seconds with just your basics.',
              },
              {
                step: '02',
                title: 'Fund your wallet',
                desc: 'Securely add funds to your personal VTU wallet.',
              },
              {
                step: '03',
                title: 'Buy VTU or start earning',
                desc: 'Enjoy instant services or resell for profit.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="space-y-6 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-transform"
              >
                <div className="w-16 h-16 bg-indigo-600 text-white flex items-center justify-center rounded-2xl mx-auto font-black text-2xl shadow-lg shadow-indigo-600/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn & Earn */}
      <section
        id="learn-more"
        className="py-24 px-6 sm:px-16 md:px-24 bg-white dark:bg-slate-900 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h4 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.3em] text-sm">
                📚 Learn & Earn
              </h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Learn VTU & Start Earning
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Understand how VTU works and how to grow income by reselling.
                Our expert-led resources help you scale your business.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all group"
              >
                <span>Learn More</span>
                <BsPlusCircle className="group-hover:rotate-90 transition-transform" />
              </Link>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {[
                {
                  title: 'Learn VTU Basics',
                  desc: 'Learn how VTU platforms work',
                },
                {
                  title: 'How VTU Reselling Works',
                  desc: 'Understand pricing & commissions',
                },
                {
                  title: 'Grow Your VTU Business',
                  desc: 'Tips to scale your earnings',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group flex items-start gap-6"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm font-black text-xl">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 sm:px-16 md:px-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.3em] text-sm mb-4">
              ❓ FAQs
            </h4>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'What is VTU?',
                a: 'VTU (Virtual Top-Up) allows you to buy airtime, data, and pay bills instantly through an online platform.',
              },
              {
                q: 'Can I earn money with this platform?',
                a: 'Yes. You earn commissions when you resell VTU services.',
              },
              {
                q: 'How fast are transactions?',
                a: 'Most transactions are completed instantly within milliseconds.',
              },
              {
                q: 'Is my money safe?',
                a: 'Yes. We use standard military-grade encryption and secure systems to protect all wallets and transactions.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    {item.q}
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full group-open:rotate-180 transition-transform">
                    <BsChevronDown size={18} />
                  </div>
                </summary>
                <div className="px-8 pb-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 sm:px-16 md:px-24 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto bg-indigo-600 rounded-[3rem] p-10 sm:p-20 overflow-hidden relative shadow-[0_40px_100px_rgba(79,70,229,0.3)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex flex-col lg:flex-row gap-16 relative z-10">
            <div className="flex-1 space-y-8 text-white">
              <h4 className="font-black uppercase tracking-[0.3em] text-sm opacity-80">
                📩 Contact & Support
              </h4>
              <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">
                Need Help? We're Here for You
              </h2>
              <p className="text-xl text-indigo-100 font-medium">
                Fast support to resolve issues quickly. Our team is available
                24/7.
              </p>

              <div className="pt-8 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <BiSupport size={28} />
                  </div>
                  <div>
                    <p className="text-sm opacity-70 font-bold uppercase tracking-widest mb-1">
                      Customer Support
                    </p>
                    <p className="text-lg font-bold underline underline-offset-4">
                      support@vtuplatform.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-10">
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <BsTwitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <BsInstagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <BsWhatsapp size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <form className="bg-white p-8 sm:p-12 rounded-[2.5rem] space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                    Your Message
                  </label>
                  <textarea
                    placeholder="Type your message"
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 font-bold resize-none"
                  ></textarea>
                </div>
                <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-1">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 sm:px-16 md:px-24 text-center border-t border-slate-100 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-bold">
          &copy; 2025 VTU Platform. Fast & Reliable Services.
        </p>
      </footer>
    </div>
  )
}

export default VTUPage
