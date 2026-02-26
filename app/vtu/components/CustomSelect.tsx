'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BsChevronDown, BsSearch } from 'react-icons/bs'

interface CustomSelectProps {
  label?: string
  options: any[]
  value: any
  onChange: (val: any) => void
  placeholder?: string
  isLoading?: boolean
  searchPlaceholder?: string
  renderOption?: (option: any) => React.ReactNode
  renderValue?: (option: any) => React.ReactNode
  className?: string
}

export const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  isLoading = false,
  searchPlaceholder = 'Search...',
  renderOption,
  renderValue,
  className = '',
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((o) => o.value === value)

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`space-y-3 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-bold flex items-center justify-between gap-3 text-left ${
            !selectedOption
              ? 'text-slate-400'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            {selectedOption ? (
              renderValue ? (
                renderValue(selectedOption)
              ) : (
                <>
                  {selectedOption.image && (
                    <img
                      src={selectedOption.image}
                      className="w-5 h-5 rounded-full object-contain"
                      alt=""
                    />
                  )}
                  <span className="truncate">{selectedOption.label}</span>
                </>
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <BsChevronDown
            size={14}
            className={`transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Search Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="relative">
                    <BsSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={14}
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  {isLoading ? (
                    <div className="py-12 text-center">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-xs text-slate-500 font-medium">
                        Loading options...
                      </p>
                    </div>
                  ) : filteredOptions.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-slate-500 font-medium">
                        No results found for &quot;{search}&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onChange(option.value)
                            setIsOpen(false)
                            setSearch('')
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            value === option.value
                              ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-1'
                          }`}
                        >
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <>
                              {option.image && (
                                <img
                                  src={option.image}
                                  className="w-6 h-6 rounded-full object-contain bg-white p-0.5"
                                  alt=""
                                />
                              )}
                              <span className="truncate">{option.label}</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer / Close Info */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Tap backdrop or here to close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
