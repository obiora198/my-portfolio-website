'use client'

import { motion } from 'framer-motion'
import { Copy, Check, ArrowRight, ExternalLink } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'

interface MobileTransactionCardProps {
  transaction: {
    _id: string
    serviceID: string // Changed from service to match Transaction model
    amount: number
    phone?: string
    status: string
    timestamp: string // Changed from createdAt to match Transaction model
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
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

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
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border backdrop-blur-sm transition-all duration-300 ${
        isDarkMode
          ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
          : 'bg-white border-gray-100 shadow-md hover:shadow-xl'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${currentTheme.buttonGradient} opacity-20`}>
            <ExternalLink className={`w-5 h-5 bg-gradient-to-br ${currentTheme.gradientText} bg-clip-text text-transparent`} />
          </div>
          <div>
            <h4 className="font-black text-base capitalize leading-tight">
              {transaction.serviceID.replace('-', ' ')}
            </h4>
            <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mt-1">
              {formatDate(transaction.timestamp)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(transaction.status)}`}>
          {transaction.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
          <div>
            <p className="text-[10px] opacity-40 font-bold uppercase mb-1">Amount</p>
            <p className="text-xl font-black">₦{transaction.amount.toLocaleString()}</p>
          </div>
          {transaction.phone && (
            <div className="text-right">
              <p className="text-[10px] opacity-40 font-bold uppercase mb-1">Recipient</p>
              <p className="text-sm font-bold tracking-tight">{transaction.phone}</p>
            </div>
          )}
        </div>

        {transaction.requestId && (
          <div className="flex items-center justify-between gap-4">
            <div className={`flex-1 flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
              <span className="text-[10px] font-mono opacity-50 truncate">
                ID: {transaction.requestId}
              </span>
            </div>
            <button
              onClick={() => onCopy?.(transaction.requestId!)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                isCopied
                  ? 'bg-green-500 text-white'
                  : isDarkMode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
