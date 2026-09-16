'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BsChevronDown, BsSearch } from 'react-icons/bs'
import Image from 'next/image'
import { useTheme } from '@/app/components/ThemeContext'

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
  const { theme, themeName, currentTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const themeRing =
    themeName === 'sky'
      ? 'focus:ring-sky-500/40'
      : themeName === 'emerald'
        ? 'focus:ring-emerald-500/40'
        : themeName === 'minimal'
          ? 'focus:ring-neutral-500/40'
          : 'focus:ring-orange-500/40'

  const selectedClass =
    themeName === 'sky'
      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 font-bold'
      : themeName === 'emerald'
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-bold'
        : themeName === 'minimal'
          ? 'bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600 font-bold'
          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 font-bold'

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
          className={`w-full bg-slate-50 dark:bg-[#0c0c0c] border border-slate-200 dark:border-neutral-800 rounded-xl py-4 px-5 outline-none focus:ring-2 ${themeRing} text-sm font-bold flex items-center justify-between gap-3 text-left ${
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
                    <div className="w-5 h-5 rounded-full overflow-hidden relative">
                      <Image
                        src={selectedOption.image}
                        fill
                        className="object-contain"
                        alt=""
                        unoptimized
                      />
                    </div>
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
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Search Header */}
                <div className="p-4 border-b border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-[#0c0c0c]">
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
                      className={`w-full bg-white dark:bg-[#080808] border border-slate-200 dark:border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 ${themeRing} text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 transition-all`}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  {isLoading ? (
                    <div className="space-y-2 p-1">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-100/70 dark:bg-neutral-800/40 border border-slate-200/40 dark:border-neutral-800/60 animate-pulse"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-700/80 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                              <div className="w-2/5 h-3.5 bg-slate-200 dark:bg-neutral-700/80 rounded" />
                              <div className="w-1/4 h-2.5 bg-slate-200/60 dark:bg-neutral-800 rounded" />
                            </div>
                            <div className="w-14 h-4 bg-slate-200 dark:bg-neutral-700/80 rounded shrink-0" />
                          </div>
                        </div>
                      ))}
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
                              ? selectedClass
                              : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800/60 hover:translate-x-1'
                          }`}
                        >
                          {renderOption ? (
                            renderOption(option)
                          ) : (
                            <>
                              {option.image && (
                                <div className="w-6 h-6 rounded-full overflow-hidden relative bg-white p-0.5">
                                  <Image
                                    src={option.image}
                                    fill
                                    className="object-contain"
                                    alt=""
                                    unoptimized
                                  />
                                </div>
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
