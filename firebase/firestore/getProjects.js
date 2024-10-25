import { collection, getDocs, getFirestore } from 'firebase/firestore'
import firebase_app from '../config'

const db = getFirestore(firebase_app)

export default async function getProjects() {
  const projects = []
  const querySnapshot = await getDocs(collection(db, 'projects'))
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, data: doc.data() })
  })
  return projects
}
