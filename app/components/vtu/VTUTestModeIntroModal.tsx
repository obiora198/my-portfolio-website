'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  CreditCard,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useTheme } from '../ThemeContext'

const STORAGE_KEY = 'obiora_vtu_sandbox_modal_seen_v1'

interface VTUTestModeIntroModalProps {
  onStartTesting?: () => void
  isOpen?: boolean
  onClose?: () => void
}

export function VTUTestModeIntroModal({
  onStartTesting,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: VTUTestModeIntroModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const [copied, setCopied] = useState(false)
  const { theme, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    if (isControlled) return
    const timer = setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setInternalIsOpen(true)
        }
      } catch {
        // Fallback for private browsing
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [isControlled])

  const dismiss = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose()
    } else {
      setInternalIsOpen(false)
    }
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // Ignore
    }
  }

  const handleStart = () => {
    dismiss()
    if (onStartTesting) {
      onStartTesting()
    }
  }

  const copyTestCard = () => {
    navigator.clipboard.writeText('4084084084084084')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="test-mode-title"
            className="fixed inset-0 z-[111] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${
                isDarkMode
                  ? 'bg-[#0f0f0f] border border-neutral-800'
                  : 'bg-white border border-gray-200'
              }`}
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={dismiss}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
                  isDarkMode
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Glowing header bar */}
              <div
                className={`h-2.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400`}
              />

              <div className="p-6 sm:p-8">
                {/* Header Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    🧪 Sandbox Beta Testing
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isDarkMode ? 'text-neutral-400' : 'text-gray-500'
                    }`}
                  >
                    No Real Charges
                  </span>
                </div>

                <h2
                  id="test-mode-title"
                  className={`text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Help Us Test Our{' '}
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    VTU Platform
                  </span>
                </h2>

                <p
                  className={`text-sm leading-relaxed mb-5 ${
                    isDarkMode ? 'text-neutral-300' : 'text-gray-600'
                  }`}
                >
                  Our digital utility hub is currently connected to{' '}
                  <strong>Paystack Test Gateway</strong> and{' '}
                  <strong>VTpass Sandbox</strong>. You can test the complete
                  purchase flow without spending real funds.
                </p>

                {/* Key Points */}
                <div className="space-y-2.5 mb-5">
                  <div
                    className={`flex items-start gap-3 p-3 rounded-2xl border ${
                      isDarkMode
                        ? 'bg-neutral-900/80 border-neutral-800'
                        : 'bg-gray-50/80 border-gray-100'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 mt-0.5 flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p
                        className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        100% Risk-Free Simulation
                      </p>
                      <p
                        className={
                          isDarkMode ? 'text-neutral-400' : 'text-gray-500'
                        }
                      >
                        Transactions simulate real network fulfillment. No bank
                        account or phone balance will be debited.
                      </p>
                    </div>
                  </div>

                  {/* Paystack Test Card Box */}
                  <div
                    className={`p-3.5 rounded-2xl border ${
                      isDarkMode
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-amber-50/80 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                        <CreditCard className="w-3.5 h-3.5" />
                        Paystack Test Card:
                      </span>
                      <button
                        onClick={copyTestCard}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                          copied
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : isDarkMode
                              ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
                              : 'bg-white text-amber-800 hover:bg-amber-100 shadow-xs'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-xs tracking-wider font-semibold text-amber-600 dark:text-amber-300">
                      4084 · 0840 · 8408 · 4084
                    </div>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-400/70 mt-1">
                      Expiry: <span className="font-mono">Any future date</span> ·
                      CVV: <span className="font-mono">123</span> · OTP:{' '}
                      <span className="font-mono">123456</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleStart}
                    className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01]`}
                  >
                    <Zap className="w-4 h-4" />
                    Start Testing Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <a
                      href="/#contact"
                      onClick={dismiss}
                      className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                        isDarkMode
                          ? 'text-neutral-400 hover:text-white'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Give Feedback / Suggestion
                    </a>

                    <button
                      onClick={dismiss}
                      className={`text-xs font-medium transition-colors ${
                        isDarkMode
                          ? 'text-neutral-500 hover:text-neutral-300'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Got it, dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
