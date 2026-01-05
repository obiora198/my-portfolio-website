import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

// GET /api/projects - Get all projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '0')

    // Build query
    const query: any = {}
    if (category) query.category = category
    if (featured === 'true') query.featured = true

    // Fetch projects with sorting
    let projectsQuery = Project.find(query).sort({ order: 1, createdAt: -1 })

    if (limit > 0) {
      projectsQuery = projectsQuery.limit(limit)
    }

    const projects = await projectsQuery.lean()

    return NextResponse.json({
      success: true,
      count: projects.length,
      data: projects,
      status: 200,
    })
  } catch (error: any) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        message: error.message,
        status: 500,
      },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Validate required fields
    const { title, description, image, technologies, category } = body

    if (!title || !description || !image || !technologies || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          status: 400,
        },
        { status: 400 }
      )
    }

    // Create project
    const project = await Project.create(body)

    return NextResponse.json(
      {
        success: true,
        data: project,
        status: 201,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create project error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
        message: error.message,
        status: 500,
      },
      { status: 500 }
    )
  }
}
