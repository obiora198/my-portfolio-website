/**
 * Migration Script: Firebase to MongoDB Projects
 *
 * This script migrates projects from Firebase to MongoDB.
 * It imports real Firebase data from apires.js and transforms it to MongoDB schema.
 * Run with: node scripts/migrateProjects.js
 */

const mongoose = require('mongoose')
require('dotenv').config()

// Import real Firebase data
const firebaseData = require('./apires.js')

/**
 * Transform Firebase project data to MongoDB schema format
 * @param {Object} firebaseProject - Firebase project with id and data fields
 * @param {Number} index - Project index for ordering
 * @returns {Object} MongoDB-compatible project object
 */
function transformFirebaseToMongo(firebaseProject, index) {
  const { data } = firebaseProject

  return {
    title: data.title,
    description: data.description,
    longDescription: data.description, // Use description as longDescription if not provided
    image: data.image,
    // Transform pipe-separated stack string to technologies array
    technologies: data.stack
      ? data.stack.split('|').map((tech) => tech.trim())
      : [],
    liveUrl: data.link || '',
    githubUrl: data.githubLink || '',
    featured: true, // Mark all imported projects as featured
    category: 'fullstack', // Default category, can be customized per project
    order: index + 1,
    // Preserve original timestamps if available
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
  }
}

// Additional projects to include
const additionalProjects = [
  {
    title: 'VTU Platform',
    description:
      'A modern virtual top-up platform for airtime, data, and bill payments with real-time transaction tracking',
    longDescription:
      'Full-featured VTU platform built with Next.js, featuring instant airtime and data purchases, electricity bill payments, and international top-ups. Includes transaction history, WhatsApp receipts, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    technologies: [
      'Next.js',
      'TypeScript',
      'MongoDB',
      'TailwindCSS',
      'React Query',
    ],
    liveUrl: '/vtu',
    githubUrl: '',
    featured: true,
    category: 'fullstack',
    order: 100, // Will be adjusted after Firebase projects
  },
  {
    title: 'Blog Platform',
    description:
      'Modern blog with markdown support, syntax highlighting, and comment system',
    longDescription:
      'Feature-rich blog platform with GitHub-flavored markdown, code syntax highlighting, tag filtering, search functionality, and moderated comment system.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    technologies: ['Next.js', 'MongoDB', 'React Markdown', 'TailwindCSS'],
    liveUrl: '/blog',
    githubUrl: '',
    featured: true,
    category: 'fullstack',
    order: 101,
  },
  {
    title: 'Alorpedia - Cultural Heritage Platform',
    description:
      'A comprehensive digital platform for preserving and celebrating Alor cultural heritage. Features include a living archive for biographies and articles, village dialogue forums, interactive family tree visualization (Osisi Ndụ), global directory of community members, private messaging, and a notification system.',
    longDescription:
      'Alorpedia is a full-featured cultural heritage platform built to preserve and celebrate the rich traditions of Alor. It includes a living archive system for documenting biographies and historical articles, village-based dialogue forums for community engagement, an interactive family tree visualization tool called Osisi Ndụ, a comprehensive global directory of community members, secure private messaging, and a real-time notification system. Built with modern technologies for scalability and performance.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    technologies: [
      'Next.js',
      'React.js',
      'TypeScript',
      'TailwindCSS',
      'Prisma ORM',
      'PostgreSQL',
      'NextAuth.js',
      'Cloudinary',
      'Supabase',
    ],
    liveUrl: '',
    githubUrl: 'https://github.com/obiora198/alorpedia',
    featured: true,
    category: 'fullstack',
    order: 102,
  },
]

async function migrateProjects() {
  try {
    console.log('🚀 Starting MongoDB Migration...\n')

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI not found in .env file')
    }

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

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

    // Clear existing projects
    await Project.deleteMany({})
    console.log('🗑️  Cleared existing projects\n')

    // Transform Firebase data
    console.log('🔄 Transforming Firebase data...')
    const transformedFirebaseProjects = firebaseData.data.map(
      (project, index) => transformFirebaseToMongo(project, index)
    )
    console.log(
      `   ✓ Transformed ${transformedFirebaseProjects.length} Firebase projects\n`
    )

    // Adjust order for additional projects
    const firebaseProjectCount = transformedFirebaseProjects.length
    const adjustedAdditionalProjects = additionalProjects.map(
      (project, index) => ({
        ...project,
        order: firebaseProjectCount + index + 1,
      })
    )

    // Combine all projects
    const allProjects = [
      ...transformedFirebaseProjects,
      ...adjustedAdditionalProjects,
    ]

    // Insert all projects
    console.log('💾 Inserting projects into MongoDB...')
    const result = await Project.insertMany(allProjects)
    console.log(`✅ Successfully migrated ${result.length} projects!\n`)

    // Display migrated projects
    console.log('📦 Migrated Projects:')
    console.log('─'.repeat(70))
    result.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Category: ${project.category}`)
      console.log(`   Technologies: ${project.technologies.join(', ')}`)
      console.log(`   Live URL: ${project.liveUrl || 'N/A'}`)
      console.log(`   GitHub: ${project.githubUrl || 'N/A'}`)
      console.log('─'.repeat(70))
    })

    await mongoose.connection.close()
    console.log('\n✅ Migration complete! Database connection closed.')
    console.log('\n🎉 You can now view your projects at http://localhost:3000')
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run migration
migrateProjects()
