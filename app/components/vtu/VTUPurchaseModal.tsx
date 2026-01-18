'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'
import axios from 'axios'
import toast from 'react-hot-toast'

interface VTUPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  selectedService: string | null
  onSuccess: () => void
}

export function VTUPurchaseModal({
  isOpen,
  onClose,
  selectedService,
  onSuccess,
}: VTUPurchaseModalProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  const [activeTab, setActiveTab] = useState<string>(
    selectedService || 'airtime'
  )
  const [amount, setAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  // Update active tab when selected service changes
  useEffect(() => {
    if (selectedService) {
      // Map service IDs to tab names
      const serviceMap: { [key: string]: string } = {
        airtime: 'airtime',
        data: 'data',
        'cable-tv': 'cabletv',
        electricity: 'electricity',
        international: 'international',
      }
      setActiveTab(serviceMap[selectedService] || 'airtime')
    }
  }, [selectedService])

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simple validation
      if (!amount || !phone) {
        toast.error('Please fill all fields')
        setLoading(false)
        return
      }

      // For now, redirect to the old functional page with pre-filled data
      // In a full implementation, this would call the VTPass API
      toast.success('Redirecting to secure payment...')
      setTimeout(() => {
        window.location.href = `/vtu/old?service=${activeTab}&amount=${amount}&phone=${phone}`
      }, 1000)
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error('Failed to process purchase')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-lg rounded-2xl p-8 shadow-2xl ${isDarkMode ? 'bg-[#1C1E2E] border border-gray-800' : 'bg-white'}`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <h2
            className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Quick Purchase
          </h2>
          <p
            className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Complete your {activeTab} purchase
          </p>

          {/* Service Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'airtime', label: 'Airtime' },
              { id: 'data', label: 'Data' },
              { id: 'electricity', label: 'Electric' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${currentTheme.buttonGradient} text-white`
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
          <form onSubmit={handlePurchase} className="space-y-4">
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
                placeholder="08012345678"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-0 transition-all ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                min="50"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-0 transition-all ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 text-white focus:ring-orange-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500'
                }`}
                required
              />
            </div>

            {/* Action Buttons */}
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
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50 bg-gradient-to-r ${currentTheme.buttonGradient} hover:shadow-lg`}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>

          {/* Info Note */}
          <p
            className={`mt-4 text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
          >
            You&apos;ll be redirected to complete your secure payment
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
