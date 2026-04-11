import dotenv from 'dotenv'
import { uploadImage } from '../lib/cloudinary'
import path from 'path'

dotenv.config()

const images = [
  'archive directory.png',
  'dialogue page mobile.png',
  'landing page mobile.png',
  'landing page.png',
  'profile desktop.png',
  'profile page mobile.png',
]

const baseDir = 'C:/Users/emmanuel/Downloads/alorpedia images'

const uploadAll = async () => {
  const results: Record<string, string> = {}

  for (const img of images) {
    const filePath = path.join(baseDir, img)
    console.log(`Uploading ${img}...`)
    try {
      const url = await uploadImage(filePath, 'projects/alorpedia')
      results[img] = url
      console.log(`Success: ${url}`)
    } catch (error) {
      console.error(`Failed to upload ${img}`)
    }
  }

  console.log('\n--- Final Cloudinary URLs ---')
  console.log(JSON.stringify(results, null, 2))
}

uploadAll()
