import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

// GET /api/blog - List all published posts with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build query
    const query: any = { published: true }

    if (tag) {
      query.tags = tag
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]
    }

    // Get posts with pagination
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content') // Exclude full content for list view
      .lean()

    // Get total count for pagination
    const total = await Post.countDocuments(query)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author,
      tags,
      published,
    } = body

    // Validate required fields
    if (!title || !slug || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug })
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }

    // Create new post
    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author: author || 'Emmanuel Obiora',
      tags: tags || [],
      published: published || false,
    })

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post', message: error.message },
      { status: 500 }
    )
  }
}
