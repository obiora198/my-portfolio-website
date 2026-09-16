'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Zap, X, Sparkles, ArrowRight } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const STORAGE_KEY = 'obiora_welcomed_vtu_beta'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, currentTheme } = useTheme()
  const router = useRouter()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    // Check after a short delay so hero paints first
    const timer = setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setIsOpen(true)
        }
      } catch {
        // Private browsing or storage full — skip gracefully
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setIsOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString())
    } catch {
      // Silently ignore storage errors
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${
                isDarkMode
                  ? 'bg-[#121212] border border-neutral-800/80'
                  : 'bg-white border border-gray-100'
              }`}
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={dismiss}
                className={`absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors ${
                  isDarkMode
                    ? 'text-neutral-500 hover:text-white hover:bg-neutral-800'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Close welcome dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Gradient header strip */}
              <div
                className={`h-2 w-full bg-gradient-to-r ${currentTheme.gradient}`}
              />

              {/* Content */}
              <div className="px-6 sm:px-8 pt-7 pb-5 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  🧪 VTU Live · Beta Testing Mode
                </div>

                <h2
                  id="welcome-title"
                  className={`text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Welcome to{' '}
                  <span
                    className={`bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent`}
                  >
                    Obiora&apos;s Hub
                  </span>
                </h2>

                <p
                  className={`text-sm leading-relaxed mb-4 ${
                    isDarkMode ? 'text-neutral-300' : 'text-gray-700'
                  }`}
                >
                  Our{' '}
                  <span className="font-semibold text-amber-500">
                    VTU service is now live in Sandbox Testing Mode!
                  </span>{' '}
                  You can test recharging airtime, buying data bundles, paying
                  electricity bills, and subscribing to cable TV —{' '}
                  <strong>without spending real money</strong>.
                </p>

                {/* Sandbox Info Card */}
                <div
                  className={`text-left p-3.5 rounded-2xl mb-4 text-xs space-y-1.5 border ${
                    isDarkMode
                      ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
                      : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-amber-500">
                    <Sparkles className="w-4 h-4" />
                    How to help us test:
                  </div>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] sm:text-xs leading-normal">
                    <li>Try any provider (MTN, Airtel, GLO, 9mobile, DStv, Discos).</li>
                    <li>Paystack test cards &amp; simulated payment are active.</li>
                    <li>
                      Tell us what you think! Drop suggestions via the contact form.
                    </li>
                  </ul>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {['Zero Risk', 'Paystack Test Cards', 'Instant Simulation'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          isDarkMode
                            ? 'bg-neutral-800/80 text-neutral-300'
                            : `bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.badgeBorder}`
                        }`}
                      >
                        <Zap className="w-3 h-3 text-amber-500" />
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 sm:px-8 pb-7 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    dismiss()
                    router.push('/vtu')
                  }}
                  className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01]`}
                >
                  <Zap className="w-4 h-4" />
                  Try VTU In Test Mode
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={dismiss}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isDarkMode
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Continue to Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
