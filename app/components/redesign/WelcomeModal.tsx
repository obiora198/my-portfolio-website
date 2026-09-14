'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Zap, X, Sparkles, ArrowRight } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const STORAGE_KEY = 'obiora_welcomed'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, currentTheme } = useTheme()
  const router = useRouter()
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    // Only show on first visit — check after a short delay so the
    // hero section paints first and the modal feels intentional, not jarring.
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
              className={`relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl ${
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
              <div className="px-8 pt-8 pb-6 text-center">
                {/* Animated icon */}
                <motion.div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${currentTheme.iconBg} shadow-lg`}
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -6, 6, -3, 3, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <h2
                  id="welcome-title"
                  className={`text-2xl font-bold mb-2 ${
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
                    isDarkMode ? 'text-neutral-400' : 'text-gray-600'
                  }`}
                >
                  Thanks for stopping by! Our{' '}
                  <span
                    className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    VTU service is now live
                  </span>{' '}
                  — buy airtime, data bundles, pay electricity bills, and
                  subscribe to cable TV instantly, all in one place.
                </p>

                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    isDarkMode ? 'text-neutral-400' : 'text-gray-600'
                  }`}
                >
                  While you&apos;re here, try switching between{' '}
                  <span
                    className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    light &amp; dark mode
                  </span>{' '}
                  or change the site theme to match your vibe. If you like what
                  you see, have a suggestion, or want to work together — drop me
                  a message in the{' '}
                  <span
                    className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    contact form
                  </span>{' '}
                  at the bottom of the page!
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {['Instant Delivery', 'All Networks', 'Secure Payments'].map(
                    (tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          isDarkMode
                            ? 'bg-neutral-800/80 text-neutral-300'
                            : `bg-gradient-to-r ${currentTheme.badgeBg} ${currentTheme.badgeText} border ${currentTheme.badgeBorder}`
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div
                className={`px-8 pb-8 flex flex-col gap-3 ${
                  isDarkMode ? '' : ''
                }`}
              >
                <button
                  onClick={() => {
                    dismiss()
                    router.push('/vtu')
                  }}
                  className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]`}
                >
                  <Zap className="w-4 h-4" />
                  Check Out VTU service
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={dismiss}
                  className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                    isDarkMode
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
