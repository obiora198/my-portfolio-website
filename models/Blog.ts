import mongoose, { Schema, model, models } from 'mongoose'

export interface IBlog {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  tags: string[]
  views: number
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

const Blog = models.Blog || model<IBlog>('Blog', BlogSchema)

export default Blog
