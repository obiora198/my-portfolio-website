'use client'

import { useEffect, useState } from 'react'
import AxiosInstance from '../utils/axiosInstance'
import Nav from '../components/nav/Nav'
import Loading from '../components/Loading'
import Link from 'next/link'

const VTUPage = () => {
  const [serviceCategories, setServiceCategories] = useState<any[]>([])

  const getServiceCategories = async () => {
    try {
      const response = await AxiosInstance.get('/service-categories')
      setServiceCategories(response.data.content)
    } catch (error) {
      console.error('Error fetching service categories:', error)
    }
  }

  useEffect(() => {
    getServiceCategories()
  }, [])

  if (serviceCategories.length === 0) {
    return <Loading />
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300 min-h-screen">
      <Nav />

      {/* Main Section */}
      <div className="pt-28 px-6 sm:px-16 md:px-24 lg:px-32 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left side */}
        <div className="flex flex-col items-start justify-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
            What do you want to <br />{' '}
            <span className="text-indigo-500">buy today?</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-medium">
            Airtel 1GB ={' '}
            <span className="text-indigo-500 font-semibold">₦8</span>
          </p>
          <Link
            href="/auth/login"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            Login / Register
          </Link>
        </div>

        {/* Right side */}
        <div className="columns-3 gap-4 space-y-4">
          {serviceCategories.map((category, index) => {
            const isMiddleColumn = index % 3 === 1 // 2nd, 5th, 8th, etc.
            const isSeventhItem = index === 6 // 7th item

            return (
              <div
                key={category.id}
                className={`
          bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg 
          transition-all duration-300 flex flex-col items-center justify-center p-6 
          border border-gray-100 dark:border-slate-700
          ${isMiddleColumn ? 'h-32' : 'h-40'}
        `}
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-20 h-20 object-contain mb-3"
                  />
                )}
                <h3 className="text-center text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base">
                  {category.name}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VTUPage
