import React, { useState } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import updateProject from '../../../firebase/firestore/updateProject'
import { ProjectType } from '@/app/configs/tsTypes'
import { FaTrash } from "react-icons/fa";
import Image from 'next/image'
import { useAuth } from '@/app/context/authContext'
import { useRouter } from 'next/navigation'


interface ExistingProject {
  id?: string
  data: ProjectType['data']
}

export default function ProjectUpdate({
  existingProject,
}: {
  existingProject: ExistingProject
}) {
  // State for form fields
  const [title, setTitle] = useState(existingProject?.data.title || '')
  const [link, setLink] = useState(existingProject?.data.link || '')
  const [githubLink, setGithubLink] = useState(
    existingProject?.data.githubLink || ''
  )
  const [stack, setStack] = useState(existingProject?.data.stack || '')
  const [description, setDescription] = useState(
    existingProject?.data.description || ''
  )
  const [image, setImage] = useState<File | null | undefined>(null) // State for image file
  const [imageUrl, setImageUrl] = useState(existingProject?.data.image || '') // State for image URL
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false) // State for dialog visibility
  const { user } = useAuth() // Get user from context
  const router = useRouter() // Get router from Next.js

  // Handle form submission

  interface UpdateResult {
    status: number
    message: string
  }

  const handleImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string) // Set the image URL for preview
      }
      reader.readAsDataURL(file)
    }
  }

  function deleteImage() {
    setImage(null)
  }

  // Handle form submission

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      alert('not authorized')
      router.push('/auth/signin')
      return
    }
    setLoading(true)

    const projectData: ProjectType['data'] = {
      title: title,
      link: link,
      githubLink: githubLink,
      description: description,
      stack: stack,
      image: imageUrl, // Use the image URL for the project
      updatedAt: new Date().getTime(), // Set the current timestamp
    }

    try {
      // Call the update function passing the project ID and data
      const result: UpdateResult = await updateProject(
        existingProject.id,
        projectData
      )
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
      <Button
        onClick={() => setOpenDialog(true)}
        variant="outlined"
        color="secondary"
        size="small"
        className="flex items-center gap-2"
      >
        Update
      </Button>

      {/* Dialog for updating the project */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-indigo-600 font-bold text-2xl text-center">
          Update Project
        </DialogTitle>

        <form onSubmit={handleFormSubmit}>
          <DialogContent dividers className="flex flex-col gap-4 p-6">
            {/* Title Field */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />

            {/* Live Demo Link Field */}
            <TextField
              label="Live Demo Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />

            {/* GitHub Link Field */}
            <TextField
              label="GitHub Repository Link"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />

            {/* Stack Field */}
            <TextField
              label="Tech Stack (separate with '|')"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />

            {/* Description Field */}
            <TextField
              label="Short Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
            />

            {/* Optional: Image Upload for Updating Screenshot */}
            <div className="mt-4 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Project Screenshot (optional)
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpdate}
                className="text-sm"
              />
              <div className="flex flex-col items-center justify-center gap-4">
                {image && (
                  <div className="relative">
                    <Image
                      alt="Selected Project Image"
                      width={300}
                      height={200}
                      src={URL.createObjectURL(image)}
                      className="rounded-xl object-cover shadow-md"
                    />
                    <button
                      onClick={deleteImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>

          <DialogActions className="p-4">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              color="warning"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              size="medium"
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
