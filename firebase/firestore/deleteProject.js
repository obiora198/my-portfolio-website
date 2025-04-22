import { getFirestore, doc, deleteDoc } from 'firebase/firestore'
import firebase_app from '../config'

export const db = getFirestore(firebase_app)

export default async function deleteProject(id) {
  try {
    const projectRef = doc(db, 'projects', id)
    await deleteDoc(projectRef)

    return { status: 200, message: `Document with ID: ${id} deleted successfully` }
  } catch (e) {
    console.error('Error deleting document:', e)
    return { status: 500, message: 'Error deleting document' }
  }
}
