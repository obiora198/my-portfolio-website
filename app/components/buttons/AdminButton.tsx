'use client'

import { useState, MouseEvent } from 'react'
import Button from '@mui/material/Button'
import { Avatar } from '@mui/material'
import React from 'react'
import AdminDialog from '../dialogs/AdminDialog'

export default function AdminButton() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget as HTMLButtonElement)
  }

  return (
    <>
      <Button
        variant="text"
        color="inherit"
        size="small"
        onClick={handleClick}
      >
        <Avatar src="" className="bg-amber-200 text-gray-900" />
      </Button>

      <AdminDialog anchorEl={anchor} setAnchor={setAnchor} />
    </>
  )
}
