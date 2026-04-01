import dbConnect from '../lib/mongodb'
import Project from '../models/Project'

async function listProjects() {
  try {
    await dbConnect()
    console.log('Connected to database...')
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean()
    console.log(`Found ${projects.length} projects:`)
    projects.forEach((p: any) => {
      console.log(`- [${p._id}] ${p.title}`)
      console.log(`  BlogUrl: ${p.blogUrl}`)
      console.log(`  Slug: ${p.slug}`)
    })
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

listProjects()
