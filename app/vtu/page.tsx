'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
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

export default function VTUPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  // Show coming soon in production/local based on environment
  const isDevelopment = process.env.NODE_ENV === 'development'
  const showComingSoon = !isDevelopment

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

  const handleServiceClick = (service: string) => {
    setSelectedService(service)
    setIsPurchaseModalOpen(true)
  }

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
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0D17]' : 'bg-gray-50'}`}
    >
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
