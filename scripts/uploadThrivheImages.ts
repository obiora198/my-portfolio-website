import dotenv from 'dotenv'
import { uploadImage } from '../lib/cloudinary'
import path from 'path'

dotenv.config()

const images = [
  'features (organisation).png',
  'landing page.png',
  'org dashboard.png',
  'thrivhenet.png',
]

const baseDir = 'C:/Users/emmanuel/Downloads/thrivheweb imagges'

const uploadAll = async () => {
  const results: Record<string, string> = {}

  for (const img of images) {
    const filePath = path.join(baseDir, img)
    console.log(`Uploading ${img}...`)
    try {
      const url = await uploadImage(filePath, 'projects/thrivhe')
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
