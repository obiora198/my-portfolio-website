'use client'

import React, { useState, useEffect } from 'react'
import { ProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'
import deleteProject from '../../../firebase/firestore/deleteProject'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/authContext'
import AdminButton from '../../components/buttons/AdminButton'
import UpdateButton from '../../components/buttons/UpdateButton'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { FaSignOutAlt, FaFolderOpen, FaTrash } from 'react-icons/fa'
import logOut from '@/firebase/auth/logout'
import Loading from '@/app/components/Loading'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

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
    if (authLoading) return

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
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="w-full bg-white dark:bg-slate-800 shadow-md fixed top-0 left-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
        >
          Admin Panel
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <a
            href="/"
            className="text-gray-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="/#projects-section"
            className="text-gray-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition-colors duration-300"
          >
            Projects
          </a>
          <button
            onClick={logOut}
            className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 border border-red-500 dark:border-red-400 px-3 py-1 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
          >
            <FaSignOutAlt className="text-base" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </motion.div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto pt-24 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            Manage Projects
          </h1>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Add, edit, or remove projects from your portfolio
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end mb-6"
        >
          <AdminButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="overflow-x-auto rounded-2xl shadow-lg"
        >
          <table className="min-w-full table-auto border-collapse bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-left">
              <tr>
                <th className="p-4 font-semibold">Project Title</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {projects.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 transition-colors duration-300"
                  >
                    <td className="p-4 text-gray-800 dark:text-slate-200 font-medium">
                      {item.data.title}
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex gap-3 items-center">
                        <UpdateButton existingProject={item} />

                        {/* Delete Button */}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<FaTrash className="w-4 h-4" />}
                          onClick={() => setProjectToDelete(item)}
                          className="rounded-full capitalize font-medium"
                          sx={{
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            '&:hover': {
                              borderColor: '#dc2626',
                              backgroundColor: 'rgba(239, 68, 68, 0.04)',
                            },
                          }}
                        >
                          Delete
                        </Button>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                          open={Boolean(projectToDelete)}
                          onClose={() => setProjectToDelete(null)}
                          PaperProps={{
                            sx: {
                              borderRadius: '16px',
                            },
                          }}
                        >
                          <DialogTitle className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent font-bold">
                            Delete Project
                          </DialogTitle>
                          <DialogContent>
                            <p className="text-gray-700 dark:text-slate-300 py-4">
                              Are you sure you want to delete &quot;
                              {projectToDelete?.data.title}&quot;? This action
                              cannot be undone.
                            </p>
                          </DialogContent>
                          <DialogActions className="gap-2 p-4">
                            <Button
                              onClick={() => setProjectToDelete(null)}
                              variant="outlined"
                              color="primary"
                              disabled={loading}
                              sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() =>
                                projectToDelete &&
                                handleDelete(projectToDelete.id)
                              }
                              variant="contained"
                              color="error"
                              disabled={loading}
                              sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                              }}
                            >
                              {loading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                                  Deleting...
                                </div>
                              ) : (
                                'Delete Project'
                              )}
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500 dark:text-slate-400"
            >
              <FaFolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No projects found</p>
              <p className="text-sm mt-2">
                Add your first project to get started
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
