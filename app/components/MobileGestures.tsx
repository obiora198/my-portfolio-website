'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileGesturesProps {
  onRefresh?: () => void | Promise<void>
  children: React.ReactNode
  refreshThreshold?: number
}

export const MobileGestures = ({
  onRefresh,
  children,
  refreshThreshold = 80,
}: MobileGesturesProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop === 0) {
      setIsPulling(true)
      setStartY(e.touches[0].clientY)
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      if (scrollTop === 0) {
        const currentY = e.touches[0].clientY
        const distance = Math.max(0, currentY - startY)
        setPullDistance(Math.min(distance, refreshThreshold * 1.5))
      } else {
        setIsPulling(false)
        setPullDistance(0)
      }
    },
    [isPulling, isRefreshing, startY, refreshThreshold]
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    if (pullDistance >= refreshThreshold && onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh error:', error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
  }, [isPulling, pullDistance, refreshThreshold, onRefresh])

  useEffect(() => {
    if (typeof window === 'undefined') return

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const progress = Math.min(pullDistance / refreshThreshold, 1)
  const rotation = progress * 360

  return (
    <div className="relative">
      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-4"
            style={{
              transform: `translateY(${pullDistance}px)`,
            }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-full p-3 shadow-lg border border-slate-200 dark:border-slate-800">
              {isRefreshing ? (
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div
                  className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}

// Touch Feedback Component
export const TouchFeedback = ({
  children,
  onTap,
  className = '',
}: {
  children: React.ReactNode
  onTap?: () => void
  className?: string
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      onClick={onTap}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  )
}
