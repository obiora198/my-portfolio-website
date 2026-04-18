'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, ExternalLink, Clock } from 'lucide-react'
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

  const getStatusStyle = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (
      lowerStatus === 'delivered' ||
      lowerStatus === 'successful' ||
      lowerStatus === 'success'
    ) {
      return isDarkMode
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-green-50 text-green-700 border-green-200'
    } else if (
      lowerStatus === 'pending' ||
      lowerStatus === 'initiated' ||
      lowerStatus === 'processing'
    ) {
      return isDarkMode
        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        : 'bg-orange-50 text-orange-700 border-orange-200'
    } else {
      return isDarkMode
        ? 'bg-red-500/10 text-red-400 border-red-500/20'
        : 'bg-red-50 text-red-700 border-red-200'
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
      className={`py-24 px-6 sm:px-8 lg:px-12 transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#1C1E2E]' : 'bg-white'}`}
    >
      {/* Background accent */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-3xl bg-gradient-to-br ${currentTheme.buttonGradient}`} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className={`inline-block text-sm font-semibold tracking-widest uppercase mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Activity Log
            </span>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent{' '}
              <span className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}>
                Transactions
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium opacity-60">
            <Clock className="w-4 h-4" />
            <span>Updated in real-time</span>
          </div>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          className={`hidden lg:block rounded-3xl border overflow-hidden backdrop-blur-sm ${
            isDarkMode
              ? 'bg-white/[0.02] border-white/[0.06] shadow-2xl'
              : 'bg-white border-gray-100 shadow-xl'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider opacity-50">Transaction ID</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider opacity-50">Service</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider opacity-50">Amount</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider opacity-50">Status</th>
                <th className="px-8 py-6 text-xs font-bold uppercase tracking-wider opacity-50 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {displayTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.requestId}
                  className={`group transition-colors ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {transaction.requestId.slice(0, 12)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(transaction.requestId)}
                        className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                          copiedId === transaction.requestId
                            ? 'bg-green-500/20 text-green-400'
                            : isDarkMode
                              ? 'hover:bg-white/10 text-gray-500'
                              : 'hover:bg-gray-200 text-gray-400'
                        }`}
                        title="Copy transaction ID"
                      >
                        {copiedId === transaction.requestId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${currentTheme.buttonGradient} opacity-20`}>
                        <ExternalLink className={`w-4 h-4 bg-gradient-to-br ${currentTheme.gradientText} bg-clip-text text-transparent`} />
                      </div>
                      <span className="font-bold text-sm capitalize">{transaction.serviceID.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-lg">{formatAmount(transaction.amount)}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-right opacity-60 font-medium">{formatDate(transaction.timestamp)}</td>
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
              className={`rounded-2xl p-5 border backdrop-blur-sm ${
                isDarkMode
                  ? 'bg-white/[0.02] border-white/[0.06]'
                  : 'bg-white border-gray-100 shadow-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentTheme.buttonGradient} opacity-20`}>
                    <ExternalLink className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-black text-base capitalize leading-tight">{transaction.serviceID.replace('-', ' ')}</p>
                    <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-1">{formatDate(transaction.timestamp)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-white/[0.03]">
                <div>
                  <p className="text-[10px] opacity-40 font-bold uppercase mb-1">Amount</p>
                  <p className="text-xl font-black">{formatAmount(transaction.amount)}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(transaction.requestId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    copiedId === transaction.requestId
                      ? 'bg-green-500/20 text-green-400'
                      : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {copiedId === transaction.requestId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedId === transaction.requestId ? 'Copied' : 'ID: ' + transaction.requestId.slice(0, 6)}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
