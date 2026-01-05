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
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-indigo-600/10 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <BsSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={12}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-9 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500/30"
                  />
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-[10px] text-slate-400 font-bold">
                      Loading...
                    </p>
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-[10px] text-slate-400 font-bold">
                      No options found.
                    </p>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange(option.value)
                          setIsOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold ${
                          value === option.value
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {renderOption ? (
                          renderOption(option)
                        ) : (
                          <>
                            {option.image && (
                              <img
                                src={option.image}
                                className="w-5 h-5 rounded-full object-contain"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
