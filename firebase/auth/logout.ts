import firebase_app from '../config'
import { getAuth, signOut } from 'firebase/auth'

const auth = getAuth(firebase_app)

export default function logOut() {
  signOut(auth)
    .then(() => {
      console.log('Log out successful')
    })
    .catch((error) => {
      console.log(error)
    })
}
