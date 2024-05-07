import { getUserSession } from './userSession'

const getUser = async () => {
  const res = await getUserSession()
  return res
}

export default async function deleteProject({ id }: { id: string }) {
  // console.log(body);
  try {
    const user = await getUser()
    const response = await fetch(
      `https://my-portfolio-api-1v51.onrender.com/api/v1/projects/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
    )

    // Handle response if necessary
    if (response.status === 200) {
      const data = await response.json()
      console.log(data)
      return { success: true }
    }
  } catch (error) {
    console.error(error)
  }
}
