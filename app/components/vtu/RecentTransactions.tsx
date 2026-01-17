'use client'

import { motion } from 'framer-motion'

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
  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (
      lowerStatus === 'delivered' ||
      lowerStatus === 'successful' ||
      lowerStatus === 'success'
    ) {
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    } else if (
      lowerStatus === 'pending' ||
      lowerStatus === 'initiated' ||
      lowerStatus === 'processing'
    ) {
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    } else {
      return 'bg-red-500/20 text-red-400 border-red-500/30'
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
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-[#1a1d29]">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
            Recent Transactions
          </h2>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          className="hidden lg:block bg-[#252836] rounded-2xl border border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-6 py-4 text-gray-400 font-medium">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {displayTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.requestId}
                  className="border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/20 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                    {transaction.requestId.slice(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {transaction.serviceID}
                  </td>
                  <td className="px-6 py-4 text-white font-bold">
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
                  <td className="px-6 py-4 text-gray-400 text-sm">
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
              className="bg-[#252836] rounded-xl p-4 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-bold mb-1">
                    {transaction.serviceID}
                  </p>
                  <p className="text-gray-400 text-sm font-mono">
                    {transaction.requestId.slice(0, 12)}...
                  </p>
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
                <span className="text-xl font-bold text-white">
                  {formatAmount(transaction.amount)}
                </span>
                <span className="text-gray-400 text-sm">
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
