'use client'
import React, { ChangeEvent, FormEvent } from 'react'
import { useAuthContext } from '../../context/authContext'
import { useRouter } from 'next/navigation'
import addProject from '../../../firebase/firestore/addProject'
import { PlusIcon, TrashIcon } from '@heroicons/react/solid'
import Image from 'next/image'
import { useRef, useState } from 'react'
import uploadImage from '../../../firebase/firestore/uploadImage'
import AdminButton from '@/app/components/buttons/AdminButton'
import Button from '@mui/material/Button'

export default function Page() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [loading, setLoading] = React.useState<boolean>(false)

  const [title, setTitle] = React.useState<string>('')
  const [githubLink, setGithubLink] = React.useState<string>('')
  const [link, setLink] = React.useState<string>('')

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
        // description: description,
        link: link,
        githubLink: githubLink,
        image: imageUrl,
        createdAt: new Date().getTime(),
      })

      if (res.status == 201) {
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
      <div className="w-full px-4 pt-4 pb-4 flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 mt-4 mb-4">
          Upload a project
        </h1>
        <form
          className="bg-white border-2 w-[400px] mx-auto p-8 mb-8 rounded-[32px]"
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Upload a project
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="project title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    About
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Write something about this project.
                  </p>
                </div> */}
                <div className="sm:col-span-4">
                  <label
                    htmlFor="link"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    link
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="link"
                        name="link"
                        type="text"
                        placeholder="project link"
                        onChange={(e) => setLink(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="github-link"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    github link
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        id="github-link"
                        name="github-link"
                        type="text"
                        placeholder="project github-link"
                        onChange={(e) => setGithubLink(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Photo
                  </label>
                  <div className="flex gap-2">
                    {image ? (
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <Image
                            alt="image preview"
                            width={280}
                            height={200}
                            className="rounded-xl w-[200px] h-[200px] object-cover"
                            src={URL.createObjectURL(image)}
                          />

                          <button
                            className="absolute top-2 right-2 bg-red-200/10 p-2 rounded-lg text-red-400"
                            onClick={deleteImage}
                          >
                            <TrashIcon className="w-6 h-6" />
                          </button>
                        </div>

                        <button className="bg-white text-black py-2 rounded-lg font-bold">
                          Upload
                        </button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="upload-image">
                          <button
                            type="button"
                            className="border-dashed border-2 border-slate-400 p-20 text-slate-400 rounded-2xl"
                            onClick={() => {
                              buttonRef.current?.click()
                            }}
                          >
                            <PlusIcon className="w-10 h-10" />
                          </button>
                        </label>

                        <input
                          id="upload-image"
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                          className="hidden"
                          ref={buttonRef}
                          onChange={handleChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <Button
              variant="contained"
              disabled={loading}
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-indigo-600 inline-block"></div>
              ) : (
                ''
              )}
              Submit
            </Button>
          </div>
        </form>

        <AdminButton />
      </div>
    </>
  )
}
