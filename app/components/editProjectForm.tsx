'use client'

import React from 'react'
import { TextField, Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { CldUploadWidget } from 'next-cloudinary'
import Head from 'next/head'
import Loading from './Loading'
import editProject from '../lib/editProject'

type ProjectProps = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

type ImageProps = {
  public_id: string
  original_filename: string
  [propName: string]: any
}

const defaultImage: ImageProps = {
  public_id: '',
  original_filename: '',
}

export default function EditprojectForm() {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [image, setImage] = React.useState<ImageProps>(defaultImage)
  const [url, setUrl] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setImage(defaultImage)
    setUrl('')
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    await editProject({
      title: title,
      description: description,
      image: image.public_id,
      link: url,
      id: 'id',
    })
    clearForm()
    setLoading(false)
  }

  return <></>
}
