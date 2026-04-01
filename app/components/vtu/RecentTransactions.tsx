'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'
import toast from 'react-hot-toast'

interface Transaction {
  requestId: string
  serviceID: string
  amount: number
  status: string
  timestamp: string
  phone?: string
  billersCode?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({
  transactions = [],
}: RecentTransactionsProps) {
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(text)
      toast.success('Transaction ID copied!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (
      lowerStatus === 'delivered' ||
      lowerStatus === 'successful' ||
      lowerStatus === 'success'
    ) {
      return isDarkMode
        ? 'bg-green-500/20 text-green-400 border-green-500/30'
        : 'bg-green-100 text-green-700 border-green-300'
    } else if (
      lowerStatus === 'pending' ||
      lowerStatus === 'initiated' ||
      lowerStatus === 'processing'
    ) {
      return isDarkMode
        ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        : 'bg-orange-100 text-orange-700 border-orange-300'
    } else {
      return isDarkMode
        ? 'bg-red-500/20 text-red-400 border-red-500/30'
        : 'bg-red-100 text-red-700 border-red-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const displayTransactions = transactions.slice(0, 5)

  if (displayTransactions.length === 0) {
    return null
  }

  return (
    <section
      className={`py-20 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#1C1E2E]' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Recent{' '}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
            >
              Transactions
            </span>
          </h2>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          className={`hidden lg:block rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#252836] border-gray-700' : 'bg-white border-gray-200 shadow-lg'}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <th
                  className={`text-left px-6 py-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Transaction ID
                </th>
                <th
                  className={`text-left px-6 py-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Service
                </th>
                <th
                  className={`text-left px-6 py-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Amount
                </th>
                <th
                  className={`text-left px-6 py-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Status
                </th>
                <th
                  className={`text-left px-6 py-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.requestId}
                  className={`border-b last:border-b-0 transition-colors ${
                    isDarkMode
                      ? 'border-gray-700/50 hover:bg-gray-700/20'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td
                    className={`px-6 py-4 font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{transaction.requestId.slice(0, 12)}...</span>
                      <button
                        onClick={() => copyToClipboard(transaction.requestId)}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedId === transaction.requestId
                            ? 'bg-green-100 text-green-600'
                            : isDarkMode
                              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                        }`}
                        title="Copy transaction ID"
                      >
                        {copiedId === transaction.requestId ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {transaction.serviceID}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {formatDate(transaction.timestamp)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {displayTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.requestId}
              className={`rounded-xl p-4 border ${isDarkMode ? 'bg-[#252836] border-gray-700' : 'bg-white border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p
                    className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {transaction.serviceID}
                  </p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      {transaction.requestId.slice(0, 12)}...
                    </p>
                    <button
                      onClick={() => copyToClipboard(transaction.requestId)}
                      className={`p-1 rounded transition-all ${
                        copiedId === transaction.requestId
                          ? 'bg-green-100 text-green-600'
                          : isDarkMode
                            ? 'hover:bg-gray-700 text-gray-500 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      {copiedId === transaction.requestId ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {formatAmount(transaction.amount)}
                </span>
                <span
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {formatDate(transaction.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
