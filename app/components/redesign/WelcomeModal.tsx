'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Zap, X, Palette, FolderGit2, MessageSquare } from 'lucide-react'
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
              <div className="px-6 sm:px-8 pt-7 pb-4 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  ⚡ Portfolio Redesign &amp; VTU Active
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
                  Our <span className="font-semibold text-amber-500">VTU service is now active</span> for live testing! Feel free to test out the dynamic theme changer or browse through my projects. If you like what you see, have a suggestion for improvement, or want to work together, leave me a message in the contact form at the bottom of the page.
                </p>

                {/* Highlights Card */}
                <div
                  className={`text-left p-3.5 sm:p-4 rounded-2xl mb-4 text-xs space-y-2 border ${
                    isDarkMode
                      ? 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
                      : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Palette className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>Theme Switcher:</strong> Customize the accent color and dark/light modes anytime using the floating palette.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <FolderGit2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>Featured Projects &amp; VTU:</strong> Explore web applications and test the active VTU sandbox services.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>Contact Form:</strong> Scroll to the bottom anytime to share your feedback or discuss new opportunities.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 sm:px-8 pb-7 flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      dismiss()
                      router.push('/vtu')
                    }}
                    className={`group flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r ${currentTheme.buttonGradient} text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer`}
                  >
                    <Zap className="w-4 h-4" />
                    Test VTU Services
                  </button>

                  <button
                    onClick={() => {
                      dismiss()
                      const projectsEl = document.getElementById('projects')
                      if (projectsEl) {
                        projectsEl.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
                      isDarkMode
                        ? 'bg-neutral-800/80 border-neutral-700 text-white hover:bg-neutral-700'
                        : 'bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Browse Projects
                  </button>
                </div>

                <button
                  onClick={() => {
                    dismiss()
                    setTimeout(() => {
                      const contactEl =
                        document.getElementById('contact') ||
                        document.getElementById('contact-form')
                      if (contactEl) {
                        contactEl.scrollIntoView({ behavior: 'smooth' })
                        const nameInput =
                          (document.getElementById('name') as HTMLInputElement | null) ||
                          (document.getElementById('message') as HTMLTextAreaElement | null)
                        if (nameInput) nameInput.focus()
                      }
                    }, 150)
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDarkMode
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Leave me a message in the contact form
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
