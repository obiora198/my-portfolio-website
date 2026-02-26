'use client'

import { useEffect } from 'react'

export default function ServiceWorkerCleaner() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Successfully unregistered stale Service Worker')
            }
          })
        }
      })
    }
  }, [])

  return null
}
