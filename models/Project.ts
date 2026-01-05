import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    longDescription: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Project image is required'],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0
        },
        message: 'At least one technology must be specified',
      },
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['web', 'mobile', 'fullstack', 'backend', 'frontend', 'other'],
      default: 'web',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for better query performance
ProjectSchema.index({ featured: 1, order: 1 })
ProjectSchema.index({ category: 1 })
ProjectSchema.index({ createdAt: -1 })

// Prevent model recompilation in development
const Project =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema)

export default Project
