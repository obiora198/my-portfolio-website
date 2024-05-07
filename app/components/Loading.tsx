import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

interface Theme {
  dark: true | null
}

export default function Loading({ dark }: Theme) {
  return (
    <div
      className={`${dark ? 'bg-black' : 'bg-white'} w-full h-full opacity-75 flex items-center justify-center rounded-lg z-50`}
    >
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  )
}
