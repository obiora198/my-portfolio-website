'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { VTUHero } from '../components/vtu/VTUHero'
import { ServicesGrid } from '../components/vtu/ServicesGrid'
import { HowItWorks } from '../components/vtu/HowItWorks'
import { RecentTransactions } from '../components/vtu/RecentTransactions'
import { WhyChooseUs } from '../components/vtu/WhyChooseUs'

export default function VTUPage() {
  // Fetch transaction history from MongoDB
  const { data: transactionHistory = [] } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await axios.get('/api/vtu/history')
      return response.data
    },
    enabled: true,
    refetchInterval: 30000,
  })

  const handleServiceClick = (service: string) => {
    // Redirect to the old functional page with service pre-selected
    window.location.href = `/vtu/old?service=${service}`
  }

  const handleGetStarted = () => {
    // Redirect to the functional purchase page
    window.location.href = '/vtu/old'
  }

  return (
    <div className="min-h-screen bg-[#1a1d29]">
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
    </div>
  )
}
