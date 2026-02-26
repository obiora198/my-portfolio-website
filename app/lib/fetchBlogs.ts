export default async function fetchBlogs(limit: number = 6) {
  try {
    const response = await fetch(`/api/blog?limit=${limit}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Failed to fetch blogs:', response.status)
      return { posts: [], pagination: {} }
    }

    const data = await response.json()

    if (data && Array.isArray(data.posts)) {
      return data
    }

    console.error('Invalid data format from API:', data)
    return { posts: [], pagination: {} }
  } catch (e) {
    console.error('Error fetching blogs:', e)
    return { posts: [], pagination: {} }
  }
}
