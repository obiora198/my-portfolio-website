'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
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
    </div>
  )
}
