export default async function getProject({ id }: { id: string }) {
  try {
    const res = await fetch(
      `https://my-portfolio-api-1v51.onrender.com/api/v1/projects/${id}`, { next: { tags: ['project'] } }
    )
    const data = await res.json()
    return data.project
  } catch (error) {
    console.error(error)
  }
}
