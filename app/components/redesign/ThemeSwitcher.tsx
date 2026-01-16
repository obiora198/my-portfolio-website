'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, Check } from 'lucide-react'
import { useTheme } from '../ThemeContext'

// Define the themes to match ThemeContext
const themeOptions = {
  sunset: {
    name: 'Sunset Glow',
    description: 'Warm and creative',
    preview: 'bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600',
  },
  sky: {
    name: 'Sky Blue',
    description: 'Calm and professional',
    preview: 'bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600',
  },
  emerald: {
    name: 'Emerald Fresh',
    description: 'Fresh and vibrant',
    preview: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600',
  },
  minimal: {
    name: 'Minimalist',
    description: 'Clean and modern',
    preview: 'bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700',
  },
}

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTheme, setTheme, themeName } = useTheme()

  return (
    <>
      {/* Floating Button - Responsive sizing */}
      <motion.button
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-3 sm:p-4 rounded-full bg-gradient-to-r ${currentTheme.buttonGradient} text-white shadow-lg hover:shadow-2xl transition-shadow duration-300`}
        style={{ zIndex: 50 }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: 9998 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel - Mobile responsive */}
            <motion.div
              className="fixed left-4 right-4 bottom-20 sm:left-auto sm:right-8 sm:bottom-28 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 w-auto sm:w-80 max-h-[70vh] sm:max-h-[600px] overflow-y-auto"
              style={{ zIndex: 9999 }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Choose Theme
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select your preferred color palette
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Theme Options */}
              <div className="space-y-3">
                {Object.entries(themeOptions).map(([key, themeOption]) => (
                  <motion.button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      themeName === key
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-700'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Preview */}
                      <div
                        className={`w-12 h-12 rounded-lg ${themeOption.preview} flex-shrink-0`}
                      />

                      {/* Theme Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {themeOption.name}
                          </h4>
                          {themeName === key && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {themeOption.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Your theme preference is saved automatically
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
