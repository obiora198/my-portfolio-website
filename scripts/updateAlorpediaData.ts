import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Project from '../models/Project'
import Post from '../models/Post'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env')
  process.exit(1)
}

const images = {
  primary:
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142027/portfolio/projects/alorpedia/vgxqozip8hxtym5rftvx.png',
  gallery: [
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142013/portfolio/projects/alorpedia/c1njgeuklo9r1qyjdl1v.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142014/portfolio/projects/alorpedia/qffftohdofuq1j0kwjno.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142017/portfolio/projects/alorpedia/q1smcrwaviv5rugryflx.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142028/portfolio/projects/alorpedia/zy1boukiexaqs3hii4jh.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142029/portfolio/projects/alorpedia/ue9q0sz8ay0snk9tdj9j.png',
  ],
}

async function update() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Update Project
    const project = await Project.findOneAndUpdate(
      { title: 'Alorpedia' },
      {
        image: images.primary,
        images: images.gallery,
      },
      { new: true }
    )
    if (project) {
      console.log(`Updated Alorpedia project images.`)
    } else {
      console.log('Alorpedia project not found.')
    }

    // 2. Update Post
    const post = await Post.findOneAndUpdate(
      { slug: 'alorpedia-preserving-culture-and-roots' },
      {
        coverImage: images.primary,
        images: images.gallery,
        liveUrl: 'https://alorpedia.com',
      },
      { new: true }
    )
    if (post) {
      console.log(`Updated Alorpedia blog cover image.`)
    } else {
      console.log('Alorpedia blog post not found.')
    }

    console.log('Update completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error during update:', error)
    process.exit(1)
  }
}

update()
