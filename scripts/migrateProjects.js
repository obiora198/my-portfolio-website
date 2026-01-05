/**
 * Migration Script: Firebase to MongoDB Projects
 *
 * This script migrates projects from Firebase to MongoDB.
 * Run with: node scripts/migrateProjects.js
 */

const mongoose = require('mongoose')

// Sample projects based on your Firebase data structure
const sampleProjects = [
  {
    title: 'VTU Platform',
    description:
      'A modern virtual top-up platform for airtime, data, and bill payments with real-time transaction tracking',
    longDescription:
      'Full-featured VTU platform built with Next.js, featuring instant airtime and data purchases, electricity bill payments, and international top-ups. Includes transaction history, WhatsApp receipts, and admin dashboard.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/my-portfolio-website-436a8.appspot.com/o/images%2Ftree-736885_1280.jpg?alt=media&token=38b8d9b3-aa7c-4fe3-9f56-8c87ce59a83a',
    technologies: [
      'Next.js',
      'TypeScript',
      'MongoDB',
      'Tailwind CSS',
      'React Query',
    ],
    liveUrl: '/vtu',
    githubUrl: '',
    featured: true,
    category: 'fullstack',
    order: 1,
  },
  {
    title: 'Blog Platform',
    description:
      'Modern blog with markdown support, syntax highlighting, and comment system',
    longDescription:
      'Feature-rich blog platform with GitHub-flavored markdown, code syntax highlighting, tag filtering, search functionality, and moderated comment system.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/my-portfolio-website-436a8.appspot.com/o/images%2Ftree-736885_1280.jpg?alt=media&token=38b8d9b3-aa7c-4fe3-9f56-8c87ce59a83a',
    technologies: ['Next.js', 'MongoDB', 'React Markdown', 'Tailwind CSS'],
    liveUrl: '/blog',
    githubUrl: '',
    featured: true,
    category: 'fullstack',
    order: 2,
  },
  {
    title: 'Portfolio Website',
    description:
      'Personal portfolio showcasing projects, skills, and blog posts with modern UI/UX',
    longDescription:
      'Responsive portfolio website with dark mode, smooth animations, project showcase, skills section, and integrated blog. Built with performance and accessibility in mind.',
    image:
      'https://firebasestorage.googleapis.com/v0/b/my-portfolio-website-436a8.appspot.com/o/images%2Ftree-736885_1280.jpg?alt=media&token=38b8d9b3-aa7c-4fe3-9f56-8c87ce59a83a',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    liveUrl: '/',
    githubUrl: 'https://github.com/obiora198/my-portfolio-website',
    featured: true,
    category: 'frontend',
    order: 3,
  },
]

async function migrateProjects() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here'

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Define Project schema (same as in models/Project.ts)
    const ProjectSchema = new mongoose.Schema(
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        longDescription: String,
        image: { type: String, required: true },
        technologies: { type: [String], required: true },
        liveUrl: String,
        githubUrl: String,
        featured: { type: Boolean, default: false },
        category: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
      { timestamps: true }
    )

    const Project =
      mongoose.models.Project || mongoose.model('Project', ProjectSchema)

    // Clear existing projects (optional - comment out if you want to keep existing data)
    await Project.deleteMany({})
    console.log('🗑️  Cleared existing projects')

    // Insert sample projects
    const result = await Project.insertMany(sampleProjects)
    console.log(`✅ Migrated ${result.length} projects successfully!`)

    // Display migrated projects
    console.log('\n📦 Migrated Projects:')
    result.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category})`)
    })

    await mongoose.connection.close()
    console.log('\n✅ Migration complete! Database connection closed.')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateProjects()
