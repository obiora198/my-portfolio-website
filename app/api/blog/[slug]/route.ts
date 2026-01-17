import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const blog = await Blog.findOne({ slug: params.slug }).lean()

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Increment views
    await Blog.findOneAndUpdate({ slug: params.slug }, { $inc: { views: 1 } })

    return NextResponse.json(blog)
  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post', message: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/blog/[slug] - Update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const { slug } = params
    const body = await request.json()

    const blog = await Blog.findOne({ slug })

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      { ...body },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      message: 'Blog post updated successfully',
      post: updatedBlog,
    })
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[slug] - Delete post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const { slug } = params

    const blog = await Blog.findOne({ slug })

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    await Blog.findByIdAndDelete(blog._id)

    return NextResponse.json({
      message: 'Blog post deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post', message: error.message },
      { status: 500 }
    )
  }
}
