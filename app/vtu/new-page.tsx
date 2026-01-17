'use client'

import { useState } from 'react'
import { VTUHero } from '../components/vtu/VTUHero'
import { ServicesGrid } from '../components/vtu/ServicesGrid'
import { HowItWorks } from '../components/vtu/HowItWorks'
import { RecentTransactions } from '../components/vtu/RecentTransactions'
import { WhyChooseUs } from '../components/vtu/WhyChooseUs'
import { VTUPurchaseModal } from '../components/vtu/VTUPurchaseModal'

export default function VTUPage() {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<
    'airtime' | 'data' | 'electricity' | 'cabletv' | 'education' | 'internet'
  >('airtime')

  const handleServiceClick = (service: typeof selectedService) => {
    setSelectedService(service)
    setIsPurchaseModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#1a1d29]">
      {/* Hero Section */}
      <VTUHero onGetStarted={() => setIsPurchaseModalOpen(true)} />

      {/* Services Grid */}
      <ServicesGrid onServiceClick={handleServiceClick} />

      {/* How It Works */}
      <HowItWorks />

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Purchase Modal */}
      <VTUPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        initialService={selectedService}
      />
    </div>
  )
}
