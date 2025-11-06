"use client"

import {useEffect, useState} from 'react'
import AxiosInstance from '../utils/axiosInstance'
import Nav from '../components/nav/Nav'
import Loading from '../components/Loading'

const VTUPage = () => {
    const [serviceCategories, setServiceCategories] = useState<any[]>([])
    console.log('VTUPage loaded')
    const getServiceCategories = async () => {
        try {
            const response = await AxiosInstance.get('/service-categories')
            setServiceCategories(response.data.content)
            console.log('Service Categories:', response.data)
        } catch (error) {
            console.error('Error fetching service categories:', error)
        }
    }

    useEffect(() => {
        getServiceCategories()
    }, [])

    if (serviceCategories.length === 0) {
        return (
            <Loading />
        )
    }
  return (
    <div className=" bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <Nav />
      <div className='pt-20 min-h-screen max-w-6xl grid grid-cols-2 sm:grid-cols-4 gap-4 mx-auto'>
        {serviceCategories.map((category) => (
          <div key={category.id} className='bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col items-center'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VTUPage