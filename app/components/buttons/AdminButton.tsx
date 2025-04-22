'use client'
import React, { ChangeEvent, FormEvent, useState, useRef } from 'react'
import { useAuthContext } from '../../context/authContext'
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
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [githubLink, setGithubLink] = useState<string>('')
  const [link, setLink] = useState<string>('')
  const [image, setImage] = useState<File | null | undefined>(null)
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
    try {
      setLoading(true)
      const imageUrl = await uploadImage(image)

      const res = await addProject({
        title: title,
        link: link,
        githubLink: githubLink,
        image: imageUrl,
        createdAt: new Date().getTime(),
      })

      if (res.status === 201) {
        setLoading(false)
        setTitle('')
        setGithubLink('')
        setLink('')
        console.log(res.message)
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
      <div className="w-full p-4 flex flex-col items-center justify-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              color="primary"
              className="w-full sm:w-auto"
            >
              Create Project
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl h-[400px] w-full px-4 py-6 overflow-y-auto">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Upload a Project
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              Fill in the details of your project and submit the form to upload.
            </DialogDescription>
            <form
              className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
              onSubmit={handleFormSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Project title"
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Link
                  </label>
                  <input
                    id="link"
                    name="link"
                    type="text"
                    placeholder="Project link"
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="github-link"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    GitHub Link
                  </label>
                  <input
                    id="github-link"
                    name="github-link"
                    type="text"
                    placeholder="GitHub link"
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Photo
                  </label>
                  <div className="mt-2 flex items-center justify-center space-x-4">
                    {image ? (
                      <div className="relative">
                        <Image
                          alt="image preview"
                          width={200}
                          height={200}
                          className="rounded-xl object-cover"
                          src={URL.createObjectURL(image)}
                        />
                        <button
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                          onClick={deleteImage}
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="upload-image" className="w-full">
                        <div className="border-dashed border-2 border-gray-300 p-12 rounded-lg text-gray-500 text-center cursor-pointer">
                          <PlusIcon className="w-12 h-12 mx-auto" />
                          <p>Upload Image</p>
                        </div>
                      </label>
                    )}
                    <input
                      id="upload-image"
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      className="hidden"
                      ref={buttonRef}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <DialogClose asChild>
                  <Button variant="default" color="gray">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="default"
                  color="primary"
                  disabled={loading}
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
