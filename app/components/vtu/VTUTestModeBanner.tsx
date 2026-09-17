'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../ThemeContext'

interface VTUTestModeBannerProps {
  onOpenGuide?: () => void
}

export function VTUTestModeBanner({ onOpenGuide }: VTUTestModeBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

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
            Zero financial risk. Safe test sandbox — no real money will be charged.
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-[11px] underline font-semibold text-amber-500 hover:text-amber-400 px-1 py-0.5 cursor-pointer"
            >
              Guide
            </button>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
