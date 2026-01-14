/**
 * Simple MongoDB Projects Seeder
 *
 * This adds sample projects to MongoDB so you can see the site working
 * Then you can update with real data later
 *
 * Run with: node scripts/seedProjects.js
 */

const mongoose = require('mongoose')
require('dotenv').config()

// Sample projects - REPLACE THESE with your actual project data
const projects = [
  {
    title: 'VTU Platform',
    description: 'Virtual top-up platform for airtime, data, and bill payments',
    longDescription:
      'Full-featured VTU platform with instant purchases, transaction history, and WhatsApp receipts.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    liveUrl: '/vtu',
    githubUrl: 'https://github.com/obiora198/my-portfolio-website',
    featured: true,
    category: 'fullstack',
    order: 1,
  },
  {
    title: 'Blog Platform',
    description: 'Modern blog with markdown support and comment system',
    longDescription:
      'Feature-rich blog with syntax highlighting, tag filtering, and moderation.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    technologies: ['Next.js', 'MongoDB', 'React Markdown'],
    liveUrl: '/blog',
    githubUrl: 'https://github.com/obiora198/my-portfolio-website',
    featured: true,
    category: 'fullstack',
    order: 2,
  },
  {
    title: 'Portfolio Website',
    description: 'Personal portfolio with modern UI/UX',
    longDescription:
      'Responsive portfolio with dark mode, animations, and integrated blog.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion'],
    liveUrl: '/',
    githubUrl: 'https://github.com/obiora198/my-portfolio-website',
    featured: true,
    category: 'frontend',
    order: 3,
  },
]

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

async function seedProjects() {
  try {
    console.log('🌱 Seeding MongoDB with projects...\n')

    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI not found in .env file')
    }

    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    const Project =
      mongoose.models.Project || mongoose.model('Project', ProjectSchema)

    // Clear existing
    await Project.deleteMany({})
    console.log('🗑️  Cleared existing projects\n')

    // Insert new
    const result = await Project.insertMany(projects)
    console.log(`✅ Added ${result.length} projects!\n`)

    result.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   ${project.technologies.join(', ')}`)
      console.log('─'.repeat(50))
    })

    await mongoose.connection.close()
    console.log('\n✅ Done! Visit your site to see the projects.')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

seedProjects()
