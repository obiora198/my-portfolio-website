'use client'

import React from 'react'
import { ProjectType } from '../../configs/tsTypes' // Adjust the import path as necessary
import fetchProjects from '../../lib/fetchProjects'
import deleteProject from '../../../firebase/firestore/deleteProject'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button' // Optional: Custom button component
import AdminButton from '../../components/buttons/AdminButton' // Optional: Custom button component
import UpdateButton from '../../components/buttons/UpdateButton' // Optional: Custom button component
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { TrashIcon } from '@heroicons/react/solid'

export default function AdminPage() {
  const [projects, setProjects] = React.useState<ProjectType[]>([])
  const [loading, setLoading] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const router = useRouter()

  const start = async () => {
    let projectsArray = await fetchProjects()
    setProjects(projectsArray)
  }

  useEffect(() => {
    start()
  }, [])

  const handleDelete = async (id: String) => {
    setLoading(true)
    const result = await deleteProject(id)

    if (result.status === 200) {
      alert(result.message)
      setOpenDeleteDialog(false) // Close the delete confirmation dialog
      // Optionally, navigate or refresh the page after deletion
      router.push("/auth/admin")
    } else {
      alert(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="container h-screen mx-auto p-4 pt-4">
      <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 mt-8 mb-4">
        Admin Panel
      </h1>

      

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left">Projects</th>
            <th className="p-2">
              <AdminButton />
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((item) => (
            <tr key={item.id} className="group hover:bg-gray-100">
              <td className="p-2">{item.data.title}</td>
              <td className="p-2 relative">
                <div className="group-hover:flex hidden absolute right-2 top-1/2 transform -translate-y-1/2 space-x-2">
                  <UpdateButton existingProject={item} />
                  <div className="flex gap-2">
                    {/* Delete button */}
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<TrashIcon />}
                      onClick={() => setOpenDeleteDialog(true)}
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Delete Confirmation Dialog */}
                  <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                  >
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogContent>
                      <p>Are you sure you want to delete this project?</p>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        variant='outlined'
                        onClick={() => setOpenDeleteDialog(false)}
                        color="info"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant='contained'
                        color="error"
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
