import { MongoProjectType } from '../configs/tsTypes'

export default async function updateProject(
  id: string,
  projectData: Partial<MongoProjectType>
) {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        message: data.error || 'Failed to update project',
      }
    }

    return {
      status: 200,
      message: 'Project updated successfully',
      data: data.data,
    }
  } catch (error: any) {
    console.error('Update project error:', error)
    return {
      status: 500,
      message: error.message || 'Internal server error',
    }
  }
}
