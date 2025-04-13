'use client'

import { useState, MouseEvent } from 'react'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout';
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
        <LogoutIcon className=" text-red-600 text-5xl" />
      </Button>

      <AdminDialog anchorEl={anchor} setAnchor={setAnchor} />
    </>
  )
}
