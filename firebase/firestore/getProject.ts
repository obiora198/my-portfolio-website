import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firestore/addProject'

export default async function getProject(id: string) {
 const docRef = doc(db, 'projects', id)
 const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data())
    return docSnap.data()
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!')
  }
}




