import React, { useState, useEffect } from 'react'
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import updateProject from '../../../firebase/firestore/updateProject'

interface ProjectData {
  id?: string
  title?: string
  link?: string
  githubLink?: string
}

interface ExistingProject {
    id?: string
    data: ProjectData
  }

export default function ProjectUpdate({ existingProject }: { existingProject: ExistingProject }) {

  // State for form fields
  const [title, setTitle] = useState(existingProject?.data.title || '')
  const [link, setLink] = useState(existingProject?.data.link || '')
  const [githubLink, setGithubLink] = useState(existingProject?.data.githubLink || '')
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false) // State for dialog visibility

  const isUpdate = Boolean(existingProject?.id) // Check if it's an update operation

  // Handle form submission

interface UpdateResult {
    status: number
    message: string
}

const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const projectData: ProjectData = {
        title,
        link,
        githubLink,
    }

    try {
        // Call the update function passing the project ID and data
        const result: UpdateResult = await updateProject(existingProject.id, projectData)
        if (result.status === 200) {
            alert(result.message)
            setOpenDialog(false) // Close the dialog after update
        }
    } catch (error) {
        console.error('Error submitting form:', error)
        alert('Error processing the request')
    } finally {
        setLoading(false)
    }
}

  return (
    <>
      {/* Trigger button to open the dialog */}
      <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
        Update
      </Button>

      {/* Dialog for updating the project */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Project</DialogTitle>
        <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Project Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="GitHub Link"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="warning">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Update'}
              </Button>
            </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
