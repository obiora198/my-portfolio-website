import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

interface Theme {
  dark: true | null
}

export default function Loading({ dark }: Theme) {
  return (
    <div className="w-full h-screen opacity-75 flex items-center justify-center animate-pulse rounded-lg z-50">
      <div className="relative">
        <div className="w-28 h-28 border-4 border-white rounded-full animate-spin border-t-indigo-600 inline-block"></div>
        <img src="/hero-img.png" alt="Loading" className="absolute top-0" />
      </div>
    </div>
  )
}
