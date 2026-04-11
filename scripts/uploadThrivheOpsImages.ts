import dotenv from 'dotenv'
import { uploadImage } from '../lib/cloudinary'
import path from 'path'

dotenv.config()

const images = [
  'landing page.png',
  'dietician landing page.png',
  'admin page.png',
  'schedulig page.png',
  'Screenshot 2025-11-19 134319.png',
  'Screenshot 2026-03-01 095247.png',
]

const baseDir = 'C:/Users/emmanuel/Downloads/thrivheops images'

const uploadAll = async () => {
  const results: Record<string, string> = {}

  for (const img of images) {
    const filePath = path.join(baseDir, img)
    console.log(`Uploading ${img}...`)
    try {
      const url = await uploadImage(filePath, 'projects/thrivhe-ops')
      results[img] = url
      console.log(`Success: ${url}`)
    } catch (error) {
      console.error(`Failed to upload ${img}:`, error)
    }
  }

  console.log('\n--- Final Cloudinary URLs ---')
  console.log(JSON.stringify(results, null, 2))
}

uploadAll()
