import firebase_app from '../config'
import { getFirestore, addDoc, collection } from 'firebase/firestore'

export const db = getFirestore(firebase_app)

export default async function addProject(data) {

  try {
    const result = await addDoc(collection(db, 'projects'), data)
    return { status: 201, message: `Document written with ID: ${result.id}` }
  } catch (e) {
    return { status: 201, message: 'Error adding document' }
  }
}
