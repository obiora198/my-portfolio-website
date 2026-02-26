import connectDB from './mongodb'
import Blog from '@/models/Blog'

export async function getBlogBySlug(slug: string) {
  await connectDB()
  const blog = await Blog.findOne({ slug }).lean()
  if (blog) {
    // Increment views in background
    Blog.findOneAndUpdate({ slug }, { $inc: { views: 1 } })
      .exec()
      .catch((err) => console.error('Error incrementing views:', err))
  }
  return JSON.parse(JSON.stringify(blog))
}

export async function getBlogs({
  page = 1,
  limit = 6,
  tag = '',
  search = '',
}: {
  page?: number
  limit?: number
  tag?: string
  search?: string
} = {}) {
  await connectDB()

  const skip = (page - 1) * limit
  const query: any = {}

  if (tag && tag !== 'All') {
    query.tags = tag
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]
  }

  const posts = await Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Blog.countDocuments(query)

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}
