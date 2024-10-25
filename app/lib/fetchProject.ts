export default async function fetchProjects() {
  try {
    const response = await fetch('/api/projects')
    const data = await response.json()
    return data.data
    // console.log(data.data)
  } catch (e) {
    console.log(e)
  }
}
