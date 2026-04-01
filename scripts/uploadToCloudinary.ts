import dotenv from 'dotenv'
import { uploadImage } from '../lib/cloudinary'

dotenv.config()

/**
 * Usage: npx tsx scripts/uploadToCloudinary.ts <filePath> <folder>
 * Example: npx tsx scripts/uploadToCloudinary.ts ./public/hero.jpg projects
 */

const main = async () => {
  const filePath = process.argv[2]
  const folder = process.argv[3] || 'general'

  if (!filePath) {
    console.error(
      'Usage: npx tsx scripts/uploadToCloudinary.ts <filePath> [folder]'
    )
    process.exit(1)
  }

  try {
    console.log(
      `Uploading ${filePath} to Cloudinary folder: portfolio/${folder}...`
    )
    const url = await uploadImage(filePath, folder)
    console.log('\nSuccess! Cloudinary URL:')
    console.log(url)
  } catch (error) {
    console.error('Upload failed.')
    process.exit(1)
  }
}

main()
