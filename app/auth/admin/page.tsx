'use client'

import React from 'react'
import { ProjectType } from '../../configs/tsTypes' // Adjust the import path as necessary
import fetchProjects from '../../lib/fetchProjects'
import deleteProject from '../../../firebase/firestore/deleteProject'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/authContext' // Adjust the import path as necessary
import { useEffect, useState } from 'react'
import AdminButton from '../../components/buttons/AdminButton' // Optional: Custom button component
import UpdateButton from '../../components/buttons/UpdateButton' // Optional: Custom button component
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { TrashIcon } from '@heroicons/react/solid'
import logOut from '@/firebase/auth/logout'
import Loading from '@/app/components/Loading'
import {toast} from 'react-hot-toast'

export default function AdminPage() {
  const [projects, setProjects] = React.useState<ProjectType[]>([])
  const [loading, setLoading] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<ProjectType | null>(
    null
  )
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const start = async () => {
    let projectsArray = await fetchProjects()
    setProjects(projectsArray)
  }

  useEffect(() => {
    if (authLoading) return // wait until auth is resolved

    if (!user) {
      router.push('/auth/signin')
    } else {
      start()
    }
  }, [user, authLoading])

  const handleDelete = async (id: String) => {
    if (!user) {
      alert('not authorized')
      router.push('/auth/signin')
      return
    }
    if (projectToDelete && projectToDelete.id) {
      setLoading(true)
      const result = await deleteProject(id)

      if (result.status === 200) {
        toast.success(result.message)
        setProjectToDelete(null) 
        router.refresh()
      } else {
        toast.error(result.message)
      }

      setLoading(false)
    }
  }
  if (authLoading) {
    return <Loading dark={null} /> 
  }

  return (
    <div className="h-screen w-full bg-gray-50 relative">
      {/* Top Navbar */}
      <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-10 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-600 ">Admin Panel</h2>
        <div className="space-x-4">
          <a
            href="/"
            className="text-gray-600 hover:text-indigo-500 font-medium transition"
          >
            Home
          </a>
          <a
            href="/#projects"
            className="text-gray-600 hover:text-indigo-500 font-medium transition"
          >
            Projects
          </a>
          <button
            onClick={logOut}
            className="text-red-600 hover:text-red-500 border px-2 border-red-500 rounded font-medium transition"
          >
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </button>
        </div>
      </nav>

      <div className="container mx-auto pt-24 px-4">
        <h1 className="text-4xl font-bold text-indigo-500 text-center mb-8">
          Manage Projects
        </h1>

        <div className="flex justify-end mb-4">
          <AdminButton />
        </div>

        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 border-b transition"
                >
                  <td className="p-4 text-gray-800">{item.data.title}</td>
                  <td className="p-4 text-center">
                    <div className="inline-flex gap-2 items-center">
                      <UpdateButton existingProject={item} />

                      {/* Delete Button */}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<TrashIcon />}
                        onClick={() => setProjectToDelete(item)}
                        className="rounded-full capitalize"
                      >
                        Delete
                      </Button>

                      {/* Delete Confirmation Dialog */}
                      <Dialog
                        open={Boolean(projectToDelete)}
                        onClose={() => setProjectToDelete(null)}
                      >
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogContent>
                          <p>Are you sure you want to delete this project?</p>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setProjectToDelete(null)}
                            variant="outlined"
                            color="info"
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => projectToDelete && handleDelete(projectToDelete.id)}
                            variant="contained"
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
      </div>
    </div>
  )
}
