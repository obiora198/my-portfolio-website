'use client'
import React, { ChangeEvent, FormEvent, useState, useRef } from 'react'
import { useAuth } from '../../context/authContext'
import { useRouter } from 'next/navigation'
import addProject from '../../../firebase/firestore/addProject'
import { PlusIcon, TrashIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import uploadImage from '../../../firebase/firestore/uploadImage'
import { Button } from '../../../components/ui/button' // Assuming you have a Button component in the Shadcn UI library
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../../components/ui/dialog' // Assuming these are part of Shadcn UI

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [githubLink, setGithubLink] = useState<string>('')
  const [link, setLink] = useState<string>('')
  const [image, setImage] = useState<File | null | undefined>(null)
  const [description, setDescription] = useState<string>('')
  const [stack, setStack] = useState<string>('')
  const buttonRef = useRef<HTMLInputElement | null>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const image: File | null | undefined = e?.target?.files?.[0]
    setImage(image)
  }

  function deleteImage() {
    setImage(null)
  }

  React.useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [])

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) {
      alert('You must be logged in to upload a project')
      return
    }
    try {
      setLoading(true)
      const imageUrl = await uploadImage(image)

      const res = await addProject({
        title: title,
        link: link,
        githubLink: githubLink,
        image: imageUrl,
        description: description,
        stack: stack,
        createdAt: new Date().getTime(),
      })

      if (res.status === 201) {
        setLoading(false)
        setTitle('')
        setGithubLink('')
        setLink('')
        alert(res.message)
        router.push('/#projects')
      }
    } catch (e) {
      setLoading(false)
      console.log(e)
      alert('Error uploading project')
    }
  }

  return (
    <>
      <div className="w-full p-4 flex flex-col items-center justify-center gap-6">
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="default"
        className="w-full sm:w-auto rounded-full px-8 py-3 font-semibold bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300"
      >
        Create Project
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-2xl w-full px-6 py-8 bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
      <DialogTitle className="text-2xl font-bold text-center text-indigo-600 mb-2">
        Upload a New Project
      </DialogTitle>
      <DialogDescription className="text-center text-gray-500 mb-6">
        Fill out all details to showcase your project properly.
      </DialogDescription>

      <form
        onSubmit={handleFormSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title */}
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Portfolio Website"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Live Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
              Live Demo Link
            </label>
            <input
              id="link"
              name="link"
              type="url"
              placeholder="https://your-live-demo-link.com"
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* GitHub Link */}
          <div>
            <label htmlFor="github-link" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository Link
            </label>
            <input
              id="github-link"
              name="github-link"
              type="url"
              placeholder="https://github.com/your-repo"
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Tech Stack */}
          <div className="sm:col-span-2">
            <label htmlFor="stack" className="block text-sm font-medium text-gray-700 mb-1">
              Tech Stack (separate with "|")
            </label>
            <input
              id="stack"
              name="stack"
              type="text"
              placeholder="React.js | Next.js | TailwindCSS"
              onChange={(e) => setStack(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Project Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Short Project Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="A responsive personal portfolio website with admin authentication and CRUD for projects."
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Project Screenshot */}
          <div className="sm:col-span-2">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Project Screenshot
            </label>
            <div className="flex flex-col items-center justify-center gap-4">
              {image ? (
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
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="upload-image"
                  className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-400 rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition"
                >
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Upload Screenshot</p>
                </label>
              )}
              <input
                id="upload-image"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                ref={buttonRef}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 border-2 border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 transition"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="rounded-full px-8 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {loading ? 'Uploading...' : 'Submit'}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</div>

    </>
  )
}
