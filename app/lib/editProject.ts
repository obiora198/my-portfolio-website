import { getUserSession } from './userSession'

type ProjectProps = {
  [key: string]: any
  title: string
  description: string
  image: string
  link: string
  id: string
}

export default async function editProject(props: ProjectProps) {
  const { title, description, image, link, id } = props


  try {
    const user = await getUserSession()
    
    const body: any = {}
    Object.keys(props).forEach((key) => {
      if (key !== 'id' && key !== 'image') {
        const str = props[key]
        if (str.replace(/\s+/g, '').length !== 0) {
          body[key] = str
        }
      }
    })
    const response = await fetch(
      `https://my-portfolio-api-1v51.onrender.com/api/v1/projects/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      }
    )
    // Handle response if necessary
    if (response.status === 200) {
      const data = await response.json()
      console.log(data)
      return { success: true }
    } else {
      await fetch(
        'https://my-portfolio-api-1v51.onrender.com/api/v1/projects/delete-image',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            images: [image],
          }),
        }
      )
    }
  } catch (error) {
    console.error(error)
  }
}
