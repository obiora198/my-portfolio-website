import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Comment from '@/models/Comment'
import Post from '@/models/Post'

// GET /api/blog/[slug]/comments - Get approved comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const { slug } = params

    // Find the post
    const post = await Post.findOne({ slug }).lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get approved comments
    const comments = await Comment.find({
      postId: post._id,
      approved: true,
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ comments })
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/blog/[slug]/comments - Submit new comment
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const { slug } = params
    const body = await request.json()
    const { author, email, content } = body

    // Validate required fields
    if (!author || !email || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the post
    const post = await Post.findOne({ slug }).lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create comment (pending moderation)
    const comment = await Comment.create({
      postId: post._id,
      author,
      email,
      content,
      approved: false, // Requires moderation
    })

    return NextResponse.json(
      {
        message: 'Comment submitted successfully and is pending moderation',
        comment,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to submit comment', message: error.message },
      { status: 500 }
    )
  }
}
