import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

// GET /api/blog/[slug] - Get single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const { slug } = params

    const post = await Post.findOne({ slug, published: true }).lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    return NextResponse.json({ post })
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

    const post = await Post.findOne({ slug })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { ...body },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      message: 'Post updated successfully',
      post: updatedPost,
    })
  } catch (error: any) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post', message: error.message },
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

    const post = await Post.findOne({ slug })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await Post.findByIdAndDelete(post._id)

    return NextResponse.json({
      message: 'Post deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post', message: error.message },
      { status: 500 }
    )
  }
}
