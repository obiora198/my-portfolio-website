import dotenv from 'dotenv'
import { uploadImage } from '../lib/cloudinary'
import path from 'path'
import fs from 'fs'

dotenv.config()

const baseDir = 'C:/Users/emmanuel/Downloads/cta app screenshots'

const uploadAll = async () => {
  const results: string[] = []

  // Read all files in the directory
  const files = fs.readdirSync(baseDir)

  for (const img of files) {
    const filePath = path.join(baseDir, img)
    console.log(`Uploading ${img}...`)
    try {
      const url = await uploadImage(filePath, 'projects/cta')
      results.push(url)
      console.log(`Success: ${url}`)
    } catch (error) {
      console.error(`Failed to upload ${img}:`, error)
    }
  }

  console.log('\n--- Final Cloudinary URLs ---')
  console.log(JSON.stringify(results, null, 2))
}

uploadAll()
