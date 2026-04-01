import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

console.log('Cloudinary Config Check:', {
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? 'HIDDEN'
      : 'MISSING',
  api_key:
    process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
      ? 'HIDDEN'
      : 'MISSING',
  api_secret:
    process.env.CLOUDINARY_API_SECRET ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
      ? 'HIDDEN'
      : 'MISSING',
})

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret:
    process.env.CLOUDINARY_API_SECRET ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary

/**
 * Uploads an image to Cloudinary
 * @param filePath Path to the local file or a remote URL
 * @param folder Cloudinary folder name
 */
export const uploadImage = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `portfolio/${folder}`,
      resource_type: 'auto',
    })
    return result.secure_url
  } catch (error) {
    console.error(`Error uploading to Cloudinary (${filePath}):`, error)
    throw error
  }
}
