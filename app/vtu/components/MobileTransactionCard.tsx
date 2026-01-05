'use client'

import { motion } from 'framer-motion'

interface MobileTransactionCardProps {
  transaction: {
    _id: string
    service: string
    amount: number
    phone?: string
    status: string
    createdAt: string
    requestId?: string
  }
  onCopy?: (id: string) => void
  isCopied?: boolean
}

export const MobileTransactionCard = ({
  transaction,
  onCopy,
  isCopied,
}: MobileTransactionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'successful':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'pending':
      case 'processing':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'failed':
      case 'reversed':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white capitalize">
            {transaction.service}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
            transaction.status
          )}`}
        >
          {transaction.status}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Amount
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            ₦{transaction.amount.toLocaleString()}
          </span>
        </div>

        {transaction.phone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Phone
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {transaction.phone}
            </span>
          </div>
        )}

        {transaction.requestId && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ID: {transaction.requestId.slice(0, 12)}...
            </span>
            <button
              onClick={() => onCopy?.(transaction.requestId!)}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
