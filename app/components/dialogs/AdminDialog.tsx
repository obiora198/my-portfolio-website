'use client'

import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useAuthContext } from '@/app/context/authContext'
import logOut from "@/firebase/auth/logout"

interface Props {
  anchorEl: HTMLElement | null
  setAnchor: (anchor: HTMLElement | null) => void
}

export default function AdminDialog({ anchorEl, setAnchor }: Props) {
  const {user} = useAuthContext()
 
  const menuOpen = Boolean(anchorEl)
  const handleCloseMenu = () => setAnchor(null)
 

  return (
    <>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {user ? (
          <>
            <MenuItem className="mx-2">
              <button onClick={()=>logOut()} className='text-red-500'>Logout</button>
            </MenuItem>
            {/* <MenuItem className="mx-2">
              <a href="/auth/admin">New Project</a>
            </MenuItem> */}
          </>
        ) : (
          <MenuItem className="mx-2">
            <a href="/auth">Login</a>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
