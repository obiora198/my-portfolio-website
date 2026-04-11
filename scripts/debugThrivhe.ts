import dbConnect from '../lib/mongodb'
import Project from '../models/Project'
import Post from '../models/Post'
import dotenv from 'dotenv'

dotenv.config()

async function debug() {
  await dbConnect()
  const project = await Project.findOne({ title: /Thrivhe Dietician/i }).lean()
  const post = await Post.findOne({ slug: 'thrivhe-dietician-admin-ops' }).lean()
  
  console.log('--- PROJECT ---')
  console.log(JSON.stringify(project, null, 2))
  console.log('\n--- BLOG POST ---')
  console.log(JSON.stringify(post, null, 2))
  process.exit(0)
}

debug()
