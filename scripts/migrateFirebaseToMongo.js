/**
 * Firebase to MongoDB Migration Script
 *
 * This script fetches projects from Firebase and migrates them to MongoDB
 *
 * Usage:
 * 1. Make sure your .env file has MONGODB_URI set
 * 2. Run: node scripts/migrateFirebaseToMongo.js
 */

const mongoose = require('mongoose')
const admin = require('firebase-admin')
const path = require('path')

// Initialize Firebase Admin (adjust path to your service account key if needed)
// If you don't have a service account key, you can export data manually from Firebase console
let firebaseApp
try {
  const serviceAccount = require('../firebase-service-account.json')
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
} catch (error) {
  console.log(
    '⚠️  Firebase service account not found. Will use sample data instead.'
  )
  console.log(
    '   To migrate real Firebase data, add firebase-service-account.json to project root'
  )
}

// MongoDB Project Schema
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

async function migrateFromFirebase() {
  try {
    console.log('🚀 Starting Firebase to MongoDB migration...\n')

    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables')
    }

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    const Project =
      mongoose.models.Project || mongoose.model('Project', ProjectSchema)

    let projectsToMigrate = []

    if (firebaseApp) {
      // Fetch from Firebase
      console.log('📥 Fetching projects from Firebase...')
      const db = admin.firestore()
      const snapshot = await db.collection('projects').get()

      if (snapshot.empty) {
        console.log('⚠️  No projects found in Firebase')
      } else {
        snapshot.forEach((doc) => {
          const data = doc.data()
          projectsToMigrate.push({
            title: data.title || 'Untitled Project',
            description: data.description || '',
            longDescription: data.longDescription || data.description,
            image: data.image || '',
            technologies: data.stack
              ? data.stack.split(',').map((t) => t.trim())
              : data.technologies || [],
            liveUrl: data.link || data.liveUrl || '',
            githubUrl: data.githubLink || data.githubUrl || '',
            featured: data.featured || false,
            category: data.category || 'web',
            order: data.order || 0,
          })
        })
        console.log(
          `✅ Found ${projectsToMigrate.length} projects in Firebase\n`
        )
      }
    }

    // If no Firebase data, use sample data
    if (projectsToMigrate.length === 0) {
      console.log('📦 Using sample projects data...\n')
      projectsToMigrate = [
        {
          title: 'VTU Platform',
          description:
            'A modern virtual top-up platform for airtime, data, and bill payments with real-time transaction tracking',
          longDescription:
            'Full-featured VTU platform built with Next.js, featuring instant airtime and data purchases, electricity bill payments, and international top-ups. Includes transaction history, WhatsApp receipts, and admin dashboard.',
          image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
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
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
          technologies: [
            'Next.js',
            'MongoDB',
            'React Markdown',
            'Tailwind CSS',
          ],
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
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          technologies: [
            'Next.js',
            'TypeScript',
            'Framer Motion',
            'Tailwind CSS',
          ],
          liveUrl: '/',
          githubUrl: 'https://github.com/obiora198/my-portfolio-website',
          featured: true,
          category: 'frontend',
          order: 3,
        },
      ]
    }

    // Clear existing projects (optional)
    console.log('🗑️  Clearing existing MongoDB projects...')
    await Project.deleteMany({})
    console.log('✅ Cleared\n')

    // Insert projects into MongoDB
    console.log('💾 Inserting projects into MongoDB...')
    const result = await Project.insertMany(projectsToMigrate)
    console.log(`✅ Successfully migrated ${result.length} projects!\n`)

    // Display migrated projects
    console.log('📋 Migrated Projects:')
    console.log('─'.repeat(60))
    result.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Category: ${project.category}`)
      console.log(`   Technologies: ${project.technologies.join(', ')}`)
      console.log(`   Featured: ${project.featured ? 'Yes' : 'No'}`)
      console.log('─'.repeat(60))
    })

    // Close connections
    await mongoose.connection.close()
    if (firebaseApp) {
      await firebaseApp.delete()
    }

    console.log('\n✅ Migration complete! Database connections closed.')
    console.log('\n🎯 Next steps:')
    console.log('   1. Update your Projects component to use /api/projects')
    console.log('   2. Test the new API endpoints')
    console.log('   3. Remove Firebase dependencies if no longer needed')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
migrateFromFirebase()
