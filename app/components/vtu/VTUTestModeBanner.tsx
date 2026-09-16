'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CreditCard, Copy, Check, X, Info } from 'lucide-react'
import { useTheme } from '../ThemeContext'

interface VTUTestModeBannerProps {
  onOpenGuide?: () => void
}

export function VTUTestModeBanner({ onOpenGuide }: VTUTestModeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const copyTestCard = () => {
    navigator.clipboard.writeText('4084084084084084')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isVisible) return null

  return (
    <div
      className={`relative z-30 w-full px-4 py-2.5 transition-colors border-b text-xs ${
        isDarkMode
          ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-900'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left info */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-500/20 text-amber-500 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            🧪 SANDBOX TEST MODE
          </span>
          <span className="hidden sm:inline text-neutral-400">|</span>
          <span className="font-medium text-[11px] sm:text-xs">
            Zero financial risk. Test with Paystack test cards — no real money will be charged.
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyTestCard}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-colors ${
              isDarkMode
                ? 'bg-neutral-800 text-amber-300 hover:bg-neutral-700'
                : 'bg-white text-amber-900 hover:bg-amber-100 shadow-xs'
            }`}
            title="Click to copy Paystack test card number"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" /> Copied Card
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-amber-500" /> Test Card: 4084..4084
              </>
            )}
          </button>

          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-[11px] underline font-semibold text-amber-500 hover:text-amber-400 px-1 py-0.5"
            >
              Guide
            </button>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
