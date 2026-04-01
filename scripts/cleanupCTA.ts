import dbConnect from '../lib/mongodb'
import Project from '../models/Project'
import Blog from '../models/Blog'

async function cleanup() {
  try {
    await dbConnect()
    console.log('Connected to MongoDB via dbConnect')

    // 1. Delete the specific blog by slug
    const blogSlugToDelete = 'staffroom-development-journey'
    const deletedBlog = await Blog.findOneAndDelete({ slug: blogSlugToDelete })
    if (deletedBlog) {
      console.log(`Deleted blog: ${deletedBlog.title} (${blogSlugToDelete})`)
    }

    // 2. Delete the specific "Staffroom" project by ID
    const staffroomProjectId = '699b3450e5c5568f04418c7f'
    const deletedStaffroomProject =
      await Project.findByIdAndDelete(staffroomProjectId)
    if (deletedStaffroomProject) {
      console.log(`Deleted project: ${deletedStaffroomProject.title}`)
    }

    // 3. Update the "Cox Teachers App (CTA)" project by ID to the correct blog URL
    const ctaProjectId = '699c0033379ad919f6602a06'
    const correctBlogUrl = '/blog/CTA-development-journey'
    const updatedCTAProject = await Project.findByIdAndUpdate(
      ctaProjectId,
      {
        blogUrl: correctBlogUrl,
      },
      { new: true }
    )
    if (updatedCTAProject) {
      console.log(
        `Updated project: ${updatedCTAProject.title} to link to ${correctBlogUrl}`
      )
    }

    // 4. Delete the duplicate "Alorpedia" project with no blogUrl
    const duplicateAlorpediaId = '6963f667df76f3c86e0e05b9'
    const deletedDuplicateAlorpedia =
      await Project.findByIdAndDelete(duplicateAlorpediaId)
    if (deletedDuplicateAlorpedia) {
      console.log(
        `Deleted duplicate project: ${deletedDuplicateAlorpedia.title} (no blog)`
      )
    }

    // 5. List remaining to verify
    const remainingBlogs = await Blog.find({}, 'title slug').lean()
    console.log('\nRemaining Blogs:')
    remainingBlogs.forEach((b) => console.log(`- ${b.title} (${b.slug})`))

    const remainingProjects = await Project.find({}, 'title blogUrl').lean()
    console.log('\nRemaining Projects:')
    remainingProjects.forEach((p) => console.log(`- ${p.title} (${p.blogUrl})`))

    console.log('\nCleanup completed')
    process.exit(0)
  } catch (error) {
    console.error('Error during cleanup:', error)
    process.exit(1)
  }
}

cleanup()
