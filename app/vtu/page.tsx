'use client'

import { useEffect, useState } from 'react'
import AxiosInstance from '../utils/axiosInstance'
import Nav from '../components/nav/Nav'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'react-icons/md'
import { BiSupport } from 'react-icons/bi'

const VTUPage = () => {
  const [activeTab, setActiveTab] = useState('airtime')

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
  ]

  const [services, setServices] = useState<any[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const fetchServices = async (identifier: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await AxiosInstance.get(
        `/services?identifier=${identifier}`
      )
      setServices(response.data.content)
      // Remove auto-selection to force user TO select a network
    } catch (err) {
      console.error('Error fetching services:', err)
      setError('Failed to load services. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const identifierMap: { [key: string]: string } = {
      airtime: 'airtime',
      data: 'data',
      electricity: 'electricity-bill',
    }
    fetchServices(identifierMap[activeTab])
    setError('')
    setSuccess('')
    setAmount('')
    setPhone('')
  }, [activeTab])

  const checkTransactionStatus = async (requestId: string) => {
    try {
      const response = await AxiosInstance.post('/requery', {
        request_id: requestId,
      })

      if (response.data.code === '000') {
        const status = response.data.content.transactions.status
        if (status === 'delivered' || status === 'successful') {
          setSuccess('Transaction was successful!')
          return true
        } else if (status === 'pending' || status === 'processing') {
          setError(
            'Transaction is still pending. Please check back in a moment.'
          )
          return false
        } else {
          setError(`Transaction failed: ${status}`)
          return false
        }
      } else {
        setError(response.data.response_description || 'Requery failed.')
        return false
      }
    } catch (err: any) {
      console.error('Requery error:', err)
      setError('Failed to check transaction status.')
      return false
    }
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const requestId = generateRequestId()
      const payload = {
        request_id: requestId,
        serviceID: selectedServiceId,
        amount: Number(amount),
        phone: phone,
      }

      const response = await AxiosInstance.post('/pay', payload)

      if (response.data.code === '000') {
        setSuccess(
          'Transaction successful! You will receive your service shortly.'
        )
        setAmount('')
        setPhone('')
      } else if (response.data.code === '099') {
        // Processing/Pending
        setSuccess('Transaction is being processed. Checking status...')
        // Wait a few seconds then check status
        setTimeout(() => checkTransactionStatus(requestId), 3000)
      } else {
        setError(
          response.data.response_description ||
            'Transaction failed. Please try again.'
        )
      }
    } catch (err: any) {
      console.error('Purchase error:', err)
      setError(
        err.response?.data?.response_description ||
          'An unexpected error occurred.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 min-h-screen font-sans">
      <Nav />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 sm:px-16 md:px-24 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-lg"
            >
              Get Started Now
            </Link>
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

            {/* Feedback Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl font-bold text-center"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-600 dark:text-green-400 rounded-2xl font-bold text-center"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {loading && services.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'airtime' && (
                    <motion.form
                      key="airtime"
                      onSubmit={handlePurchase}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                          Select Network
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {services.map((service) => (
                            <button
                              key={service.serviceID}
                              type="button"
                              onClick={() =>
                                setSelectedServiceId(service.serviceID)
                              }
                              className={`py-4 border rounded-2xl transition-all font-bold group flex flex-col items-center gap-2 ${
                                selectedServiceId === service.serviceID
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                              }`}
                            >
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-8 h-8 rounded-full object-contain"
                              />
                              <span className="text-xs">
                                {service.name.split(' ')[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <AnimatePresence>
                        {selectedServiceId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-8 overflow-hidden"
                          >
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="08011111111 (Sandbox Success)"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-bold"
                                required
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Amount
                              </label>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                                  ₦
                                </span>
                                <input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  placeholder="Enter Amount"
                                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 pl-12 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-bold"
                                  required
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black text-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                            >
                              {loading && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                              {loading ? 'Processing...' : 'Buy Now'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>
                  )}

                  {activeTab === 'data' && (
                    <motion.form
                      key="data"
                      onSubmit={handlePurchase}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                          Select Network
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {services.map((service) => (
                            <button
                              key={service.serviceID}
                              type="button"
                              onClick={() =>
                                setSelectedServiceId(service.serviceID)
                              }
                              className={`py-4 border rounded-2xl transition-all font-bold group flex flex-col items-center gap-2 ${
                                selectedServiceId === service.serviceID
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                              }`}
                            >
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-8 h-8 rounded-full object-contain"
                              />
                              <span className="text-xs">
                                {service.name.replace('Data', '').trim()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <AnimatePresence>
                        {selectedServiceId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-8 overflow-hidden"
                          >
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter Phone Number"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-bold"
                                required
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Select Data Plan
                              </label>
                              <div className="relative">
                                <select
                                  className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between text-slate-900 dark:text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/50"
                                  onChange={(e) => setAmount(e.target.value)}
                                  required
                                >
                                  <option value="">Choose a plan</option>
                                  <option value="500">1GB - ₦500</option>
                                  <option value="1200">2.5GB - ₦1200</option>
                                  <option value="2500">5GB - ₦2500</option>
                                </select>
                                <BsChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black text-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                            >
                              {loading && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                              {loading ? 'Processing...' : 'Buy Now'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>
                  )}

                  {activeTab === 'electricity' && (
                    <motion.form
                      key="electricity"
                      onSubmit={handlePurchase}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                          Select Provider
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {services.slice(0, 4).map((service) => (
                            <button
                              key={service.serviceID}
                              type="button"
                              onClick={() =>
                                setSelectedServiceId(service.serviceID)
                              }
                              className={`py-4 px-2 border rounded-2xl transition-all font-bold group flex flex-col items-center gap-2 text-center ${
                                selectedServiceId === service.serviceID
                                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                              }`}
                            >
                              <img
                                src={service.image}
                                alt={service.name}
                                className="w-8 h-8 rounded-full object-contain"
                              />
                              <span className="text-[10px] leading-tight">
                                {service.name
                                  .replace('Electricity Payment', '')
                                  .trim()}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <AnimatePresence>
                        {selectedServiceId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-8 overflow-hidden"
                          >
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Meter Number
                              </label>
                              <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter Meter Number"
                                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 px-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-bold"
                                required
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Amount
                              </label>
                              <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                                  ₦
                                </span>
                                <input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  placeholder="Enter Amount"
                                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 pl-12 pr-6 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xl font-bold"
                                  required
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-black text-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3"
                            >
                              {loading && (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                              {loading ? 'Processing...' : 'Buy Now'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.form>
                  )}
                </AnimatePresence>
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
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
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
              <h4 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.3em] text-sm mb-4">
                🎯 Benefits
              </h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
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
          <h4 className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.3em] text-sm mb-4">
            ⚙️ How It Works
          </h4>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">
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
