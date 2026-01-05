import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Project from '@/models/Project'

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const project = await Project.findById(params.id).lean()

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
          status: 404,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
      status: 200,
    })
  } catch (error: any) {
    console.error('Get project error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch project',
        message: error.message,
        status: 500,
      },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const body = await request.json()

    const project = await Project.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
          status: 404,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
      status: 200,
    })
  } catch (error: any) {
    console.error('Update project error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update project',
        message: error.message,
        status: 500,
      },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const project = await Project.findByIdAndDelete(params.id)

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
          status: 404,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
      status: 200,
    })
  } catch (error: any) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete project',
        message: error.message,
        status: 500,
      },
      { status: 500 }
    )
  }
}
