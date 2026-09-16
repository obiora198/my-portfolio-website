'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, X, Clock } from 'lucide-react'
import AxiosInstance from '../utils/axiosInstance'
import { Navigation } from '../components/redesign/Navigation'
import { ThemeSwitcher } from '../components/redesign/ThemeSwitcher'
import { useTheme } from '../components/ThemeContext'
import { VTUHero } from '../components/vtu/VTUHero'
import { ServicesGrid } from '../components/vtu/ServicesGrid'
import { HowItWorks } from '../components/vtu/HowItWorks'
import { RecentTransactions } from '../components/vtu/RecentTransactions'
import { WhyChooseUs } from '../components/vtu/WhyChooseUs'
import { VTUPurchaseModal } from '../components/vtu/VTUPurchaseModal'
import { VTUTestModeIntroModal } from '../components/vtu/VTUTestModeIntroModal'
import { VTUTestModeBanner } from '../components/vtu/VTUTestModeBanner'
import VTUComingSoon from '../components/vtu/VTUComingSoon'

function VTUQueryParamsListener({
  onSelectService,
}: {
  onSelectService: (service: string) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const service = searchParams.get('service')
    if (service) {
      onSelectService(service)
    }
  }, [searchParams, onSelectService])

  return null
}

export default function VTUPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const queryClient = useQueryClient()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [isWalletComingSoonOpen, setIsWalletComingSoonOpen] = useState(false)
  const [isTestGuideOpen, setIsTestGuideOpen] = useState(false)

  // Prewarm services and common variations in the background so modal and plans load instantly
  useEffect(() => {
    const prewarmData = () => {
      const identifiers: Record<string, string> = {
        airtime: 'airtime',
        data: 'data',
        tv: 'tv-subscription',
        electricity: 'electricity-bill',
      }

      // Prefetch services into React Query cache
      Object.entries(identifiers).forEach(([tabKey, identifier]) => {
        queryClient.prefetchQuery({
          queryKey: ['services', tabKey],
          queryFn: async () => {
            const response = await AxiosInstance.get(
              `/services?identifier=${identifier}`
            )
            return response.data.content
              .filter((service: any) => service.serviceID !== 'foreign-airtime')
              .map((service: any) => ({
                ...service,
                image: service.image.replace('-VTU', ''),
              }))
          },
          staleTime: 1000 * 60 * 30,
        })
      })

      // Prefetch top data providers' variations into React Query cache
      const topProviders = [
        'mtn-data',
        'airtel-data',
        'glo-data',
        'glo-sme-data',
        'etisalat-data',
      ]
      topProviders.forEach((serviceID) => {
        queryClient.prefetchQuery({
          queryKey: ['variations', serviceID, '', null],
          queryFn: async () => {
            const response = await AxiosInstance.get(
              `/service-variations?serviceID=${serviceID}`
            )
            const list =
              response.data.content?.variations ||
              response.data.content?.varations ||
              []
            return [...list].sort((a: any, b: any) => {
              const priceA = parseFloat(String(a.variation_amount ?? a.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
              const priceB = parseFloat(String(b.variation_amount ?? b.amount ?? '0').replace(/[^0-9.]/g, '')) || 0
              return priceA - priceB
            })
          },
          staleTime: 1000 * 60 * 30,
        })
      })
    }

    const timer = setTimeout(prewarmData, 250)
    return () => clearTimeout(timer)
  }, [queryClient])

  // Show coming soon unless VTU is explicitly enabled via env var.
  // Set NEXT_PUBLIC_VTU_ENABLED=true in Vercel (dev branch) or .env to unlock.
  const vtuEnabled =
    process.env.NEXT_PUBLIC_VTU_ENABLED === 'true' ||
    process.env.NODE_ENV === 'development'
  const showComingSoon = !vtuEnabled

  // Fetch transaction history from MongoDB
  const { data: transactionHistory = [], refetch: refetchHistory } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await axios.get('/api/vtu/history')
      return response.data
    },
    enabled: true,
    refetchInterval: 30000,
  })

  const handleServiceClick = useCallback((service: string) => {
    if (service === 'wallet') {
      setIsWalletComingSoonOpen(true)
      return
    }
    setSelectedService(service)
    setIsPurchaseModalOpen(true)
  }, [])

  const handleGetStarted = () => {
    setIsPurchaseModalOpen(true)
  }

  const handleModalClose = () => {
    setIsPurchaseModalOpen(false)
    setSelectedService(null)
  }

  const handleTransactionSuccess = () => {
    refetchHistory()
  }

  if (showComingSoon) {
    return <VTUComingSoon />
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-[#000000] ${isDarkMode ? 'bg-[#000000]' : 'bg-gray-50'}`}
    >
      <Suspense fallback={null}>
        <VTUQueryParamsListener onSelectService={handleServiceClick} />
      </Suspense>
      <Navigation />
      <ThemeSwitcher />

      {/* Top Test Mode Banner */}
      <div className="pt-20">
        <VTUTestModeBanner onOpenGuide={() => setIsTestGuideOpen(true)} />
      </div>

      {/* Test Mode Intro Modal */}
      <VTUTestModeIntroModal
        onStartTesting={handleGetStarted}
        isOpen={isTestGuideOpen ? true : undefined}
        onClose={() => setIsTestGuideOpen(false)}
      />

      {/* Beautiful Figma Design Hero */}
      <VTUHero onGetStarted={handleGetStarted} />

      {/* Beautiful Figma Design Services Grid */}
      <ServicesGrid onServiceClick={handleServiceClick} />

      {/* Beautiful Figma Design How It Works */}
      <HowItWorks />

      {/* Real Transaction History from MongoDB */}
      <RecentTransactions transactions={transactionHistory} />

      {/* Beautiful Figma Design Why Choose Us */}
      <WhyChooseUs />

      {/* Purchase Modal */}
      <VTUPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={handleModalClose}
        selectedService={selectedService}
        onSuccess={handleTransactionSuccess}
      />

      {/* Wallet Coming Soon Modal */}
      <AnimatePresence>
        {isWalletComingSoonOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsWalletComingSoonOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className={`relative w-full max-w-sm rounded-3xl border p-8 text-center shadow-2xl ${
                isDarkMode
                  ? 'bg-[#111111] border-neutral-800'
                  : 'bg-white border-gray-200'
              }`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsWalletComingSoonOpen(false)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Wallet className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3
                className={`text-xl font-extrabold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Wallet Coming Soon
              </h3>

              {/* Description */}
              <p
                className={`text-sm leading-relaxed mb-6 ${
                  isDarkMode ? 'text-neutral-400' : 'text-gray-500'
                }`}
              >
                We&apos;re building a seamless wallet experience so you can fund
                your account and enjoy faster transactions. Stay tuned!
              </p>

              {/* Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                  isDarkMode
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Under Development
              </div>

              {/* CTA */}
              <button
                onClick={() => setIsWalletComingSoonOpen(false)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  isDarkMode
                    ? 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

