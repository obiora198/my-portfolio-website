'use client'

import { useState } from 'react'
import { MouseEvent } from 'react'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import EditDialog from '../dialogs/EditDialog'
import React from 'react'

export default function EditButton({ id }: { id: string }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget as HTMLButtonElement)
  }

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        size="small"
        onClick={handleClick}
        className="block lg:absolute right-0 "
      >
        <EditIcon />
      </Button>

      <EditDialog anchorEl={anchor} setAnchor={setAnchor} id={id} />
    </>
  )
}
