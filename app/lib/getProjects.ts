export default async function getProjects() {
  try {
    const response = await fetch(
      'https://my-portfolio-api-1v51.onrender.com/api/v1/projects'
    )
    const responseObj = await response.json()
    return responseObj.data
  } catch (error) {
    console.error(error)
  }
}
