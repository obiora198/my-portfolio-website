export default async function deleteProject(id: string) {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        message: data.error || 'Failed to delete project',
      }
    }

    return {
      status: 200,
      message: data.message || 'Project deleted successfully',
    }
  } catch (error: any) {
    console.error('Delete project error:', error)
    return {
      status: 500,
      message: error.message || 'Internal server error',
    }
  }
}
