import { getStorage } from 'firebase/storage'
import firebase_app from '../config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const storage = getStorage(firebase_app)

export default async function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`) // Create a reference to the file in Firebase Storage
  try {
    await uploadBytes(storageRef, file) // Upload the file to Firebase Storage
    const url = await getDownloadURL(storageRef) // Get the download URL of the uploaded file
    console.log('File Uploaded Successfully')
    return url
  } catch (error) {
    console.error('Error uploading the file', error)
  }
}
