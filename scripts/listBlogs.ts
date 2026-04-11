import dbConnect from '../lib/mongodb'
import Post from '../models/Post'

async function listBlogs() {
  try {
    await dbConnect()
    console.log('Connected to database...')
    const blogs = await Post.find({}).sort({ createdAt: -1 }).lean()
    console.log(`Found ${blogs.length} blogs:`)
    blogs.forEach((b: any) => {
      console.log(`- [${b._id}] ${b.title}`)
      console.log(`  Slug: ${b.slug}`)
      console.log(`  Created: ${b.createdAt}`)
      console.log(`  Updated: ${b.updatedAt}`)
    })
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

listBlogs()
