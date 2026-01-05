import mongoose, { Schema, models, Model } from 'mongoose'

export interface IPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  published: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      default: 'Emmanuel Obiora',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
PostSchema.index({ published: 1, createdAt: -1 })
PostSchema.index({ tags: 1, published: 1 })
PostSchema.index({ slug: 1 }, { unique: true })

const Post: Model<IPost> =
  models.Post || mongoose.model<IPost>('Post', PostSchema)

export default Post
