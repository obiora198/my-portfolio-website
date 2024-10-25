import firebase_app from '../config'
import { getFirestore, addDoc, collection } from 'firebase/firestore'

const db = getFirestore(firebase_app)
export default async function addProject(data) {
  let result = null
  let error = null

  try {
    const result = await addDoc(collection(db, 'projects'), data)
    console.log('Document written with ID: ', result.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }

  return { result, error }
}
