import { MongoProjectType } from '../configs/tsTypes'

export default async function addProject(
  projectData: Partial<MongoProjectType>
) {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        status: response.status,
        message: data.error || 'Failed to add project',
      }
    }

    return {
      status: 201,
      message: 'Project created successfully',
      data: data.data,
    }
  } catch (error: any) {
    console.error('Add project error:', error)
    return {
      status: 500,
      message: error.message || 'Internal server error',
    }
  }
}
