import { getFirestore, doc, updateDoc } from 'firebase/firestore'
import firebase_app from '../config'

export const db = getFirestore(firebase_app)

export default async function updateProject(id, data) {
  try {
    const projectRef = doc(db, 'projects', id)
    await updateDoc(projectRef, data)

    return { status: 200, message: `Document with ID: ${id} updated successfully` }
  } catch (e) {
    console.error('Error updating document:', e)
    return { status: 500, message: 'Error updating document' }
  }
}
