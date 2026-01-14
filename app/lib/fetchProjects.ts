export default async function fetchProjects() {
  try {
    const response = await fetch('/api/projects')

    if (!response.ok) {
      console.error('Failed to fetch projects:', response.status)
      return []
    }

    const data = await response.json()

    // Ensure we always return an array
    if (data && data.data && Array.isArray(data.data)) {
      return data.data
    }

    console.error('Invalid data format from API:', data)
    return []
  } catch (e) {
    console.error('Error fetching projects:', e)
    return [] // Always return empty array on error
  }
}
