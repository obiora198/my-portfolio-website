'use client'

import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import deleteProject from '../../lib/deleteProject'
import { DialogPropsType } from '../../configs/tsTypes'
import DeleteDialog from './deleteDialog'
import UpdateDialog from './updateDialog'
import revalidate from '../../lib/revalidateFetch'

export default function EditDialog({
  anchorEl,
  id,
  setAnchor,
}: DialogPropsType) {
  //MENU CONTROL >>>> START
  const menuOpen = Boolean(anchorEl)
  const handleCloseMenu = () => setAnchor(null)
  //MENU CONTROL >>>> END

  //DELETE DIALOG CONTROL >>>> START
  const [deleteLoading, setDeleteLoading] = React.useState(false)
  const [deleteDialogOpen, setdeleteDialogOpen] = React.useState(false)
  const handleDeleteDialogOpen = () => setdeleteDialogOpen(true)
  const handleCloseDeleteDialog = () => {
    setdeleteDialogOpen(false)
    handleCloseMenu()
  }

  const handleDeleteProject = async () => {
    setDeleteLoading(true)
    const res = await deleteProject({ id: id })
    revalidate('projects')
    if (res?.success) {
      handleCloseDeleteDialog()
    }
    setDeleteLoading(false)
  }
  //DELETE DIALOG CONTROL >>>> END

  //UPDATE DIALOG CONTROL >>>> START
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false)
  const handleOpenUpdateDialog = () => setUpdateDialogOpen(true)
  const handleCloseupdateDialog = () => {
    setUpdateDialogOpen(false)
    handleCloseMenu()
  }
  //UPDATE DIALOG CONTROL >>>> END

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
        <MenuItem onClick={handleOpenUpdateDialog}>Update</MenuItem>
        <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
      </Menu>

      {/* edit dialog  */}
      <UpdateDialog
        id={id}
        open={updateDialogOpen}
        onClose={handleCloseupdateDialog}
      />
      {/* edit dialog end  */}

      {/* delete dialog  */}
      <DeleteDialog
        open={deleteDialogOpen}
        loading={deleteLoading}
        onClose={handleCloseDeleteDialog}
        onClickYes={handleDeleteProject}
        onClickNo={handleCloseDeleteDialog}
      />
      {/* delete dialog end */}
    </>
  )
}
