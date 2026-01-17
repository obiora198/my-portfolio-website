import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'

// GET /api/blog - List all blog posts with pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

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
    const posts = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Blog.countDocuments(query)

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
    const { title, slug, content, excerpt, coverImage, author, tags } = body

    // Validate required fields
    if (!title || !slug || !content || !excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug })
    if (existingBlog) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      )
    }

    const newBlog = new Blog({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      author: author || 'Emmanuel Obiora', // Default author if not provided
      tags: tags || [], // Default to empty array if not provided
      published: false, // Default to unpublished
    })

    await newBlog.save()

    return NextResponse.json(
      { message: 'Blog post created successfully', post: newBlog },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post', message: error.message },
      { status: 500 }
    )
  }
}
