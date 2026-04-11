import dbConnect from './lib/mongodb'
import Blog from './models/Blog'
import Project from './models/Project'

async function debug() {
  await dbConnect()
  console.log('Searching for CTA by title...')
  const blog = await Blog.findOne({ title: /Cox Teachers/i })
  if (blog) {
    console.log('Found blog:', blog.title)
    console.log('Slug:', blog.slug)
    console.log('ID:', blog._id)
  } else {
    console.log('Blog not found by title')
  }

  const project = await Project.findOne({ title: /Cox Teachers/i })
  if (project) {
    console.log('Found project:', project.title)
    console.log('BlogUrl:', project.blogUrl)
  } else {
    console.log('Project not found by title')
  }
  process.exit(0)
}

debug()
