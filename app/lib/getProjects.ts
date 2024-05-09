export default async function getProjects() {
  try {
    const response = await fetch(
      'https://my-portfolio-api-1v51.onrender.com/api/v1/projects',
      { next: { tags: ['projects'] } }
    )
    const responseObj = await response.json()
    const { data } = responseObj
    return data
  } catch (error) {
    console.error(error)
  }
}
