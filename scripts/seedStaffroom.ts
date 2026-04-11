import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Project from '../models/Project'
import Post from '../models/Post'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env')
  process.exit(1)
}

const staffroomData = {
  project: {
    title: "Cox Teachers App (CTA): The Professional Educator's Network",
    description:
      'I designed and built CTA (Cox Teachers App), a mobile-first professional network for educators that combines a localized social feed with a full-featured marketplace. The platform connects teachers across schools and LGAs while providing a secure, high-performance ecosystem for collaboration and resource exchange.',
    longDescription: `Cox Teachers App (CTA): Building a Digital Staffroom for Educators

CTA (Cox Teachers App) started from a simple idea — teachers shouldn’t be limited to collaboration within just their school.

In many places, once you leave your school environment, professional interaction with other educators becomes almost nonexistent. I wanted to explore what it would look like to create a shared digital space — something like a modern staffroom — where teachers could connect, share ideas, and even exchange resources within their local communities.

### A Practical, Product-First Approach

Rather than over-engineering things from the start, I focused on building something that works well in the real world.

I chose to build CTA using Next.js with the App Router so I could keep everything in a single, cohesive codebase — frontend and backend logic together. Instead of spinning up a separate backend, I leaned on Supabase for authentication and database needs. It allowed me to move faster, simplify infrastructure, and focus more on the product experience.

This decision wasn’t just about convenience — it was about reducing complexity while still building something scalable and reliable.

### Designing for Mobile First

From the beginning, I knew most users would access CTA on their phones, so I approached it as a mobile-first Progressive Web App.

The goal was to make it feel close to a native app:
- Smooth navigation
- Fast load times
- Minimal data usage
- A clean, focused interface

Every UI decision was made with that in mind — simple layouts, clear actions, and an experience that works well even on mid-range devices.

### Making the Feed Feel Relevant

One of the key ideas behind CTA is locality.

Instead of a generic global feed, I wanted users to feel like they were interacting with people within their actual environment — their school, their area, their local network.

So I structured the feed to prioritize relevance:
- Content closer to your location shows up first
- Visibility is controlled at the school and local level
- Interactions feel more intentional, not noisy

It’s less about volume and more about meaningful connection.

### Extending Into a Marketplace

As the idea evolved, it made sense to go beyond just conversations.

Teachers often share or sell materials — lesson notes, resources, tools — so I built a simple marketplace into the platform.

Users can:
- List items
- Discover resources nearby
- Reach out and have conversations directly

Keeping this within the same platform makes the experience feel unified instead of fragmented.

### How I Build

This project reflects how I like to work as a developer.

I don’t always start by trying to design the most complex system possible. Instead, I focus on:
- Choosing tools that reduce friction
- Leveraging modern frameworks like Next.js to their full potential
- Using AI as part of my workflow to move faster and explore ideas quickly
- Iterating based on how the product actually feels to use

CTA is less about showcasing deep technical complexity, and more about building something thoughtful, usable, and grounded in real-world needs.`,
    image:
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862359/portfolio/projects/cta/syjy72glhacnkz9uxerh.jpg',
    images: [
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862359/portfolio/projects/cta/syjy72glhacnkz9uxerh.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862360/portfolio/projects/cta/pwd3qyurcmpp5of17pmv.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862361/portfolio/projects/cta/vvayooj1ths45aryg9gt.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862362/portfolio/projects/cta/chcvl2zadl8dotnl4w34.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862363/portfolio/projects/cta/fed05kgyrqndqxzjvzu2.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862363/portfolio/projects/cta/l8spubwi1xh46dd0oovh.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862364/portfolio/projects/cta/zddselisuy08elodcxyr.jpg',
    ],
    technologies: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'Prisma 7',
      'PostgreSQL',
      'Supabase',
      'Lucide React',
    ],
    liveUrl: 'https://coxteachersapp.netlify.app/',
    githubUrl: '', // Update if available
    blogUrl: '/blog/CTA-development-journey',
    category: 'fullstack',
    featured: true,
    order: 2,
  },
  blog: {
    title: "Cox Teachers' App (CTA): Engineering a Digital Home for Educators",
    slug: 'CTA-development-journey',
    excerpt:
      'Deep dive into the architecture and product thinking behind CTA, a localized professional network and marketplace for educators.',
    content: `Cox Teachers App (CTA): Building a Digital Staffroom for Educators

CTA (Cox Teachers App) started from a simple idea — teachers shouldn’t be limited to collaboration within just their school.

In many places, once you leave your school environment, professional interaction with other educators becomes almost nonexistent. I wanted to explore what it would look like to create a shared digital space — something like a modern staffroom — where teachers could connect, share ideas, and even exchange resources within their local communities.

### A Practical, Product-First Approach

Rather than over-engineering things from the start, I focused on building something that works well in the real world.

I chose to build CTA using Next.js with the App Router so I could keep everything in a single, cohesive codebase — frontend and backend logic together. Instead of spinning up a separate backend, I leaned on Supabase for authentication and database needs. It allowed me to move faster, simplify infrastructure, and focus more on the product experience.

This decision wasn’t just about convenience — it was about reducing complexity while still building something scalable and reliable.

### Designing for Mobile First

From the beginning, I knew most users would access CTA on their phones, so I approached it as a mobile-first Progressive Web App.

The goal was to make it feel close to a native app:
- Smooth navigation
- Fast load times
- Minimal data usage
- A clean, focused interface

Every UI decision was made with that in mind — simple layouts, clear actions, and an experience that works well even on mid-range devices.

### Making the Feed Feel Relevant

One of the key ideas behind CTA is locality.

Instead of a generic global feed, I wanted users to feel like they were interacting with people within their actual environment — their school, their area, their local network.

So I structured the feed to prioritize relevance:
- Content closer to your location shows up first
- Visibility is controlled at the school and local level
- Interactions feel more intentional, not noisy

It’s less about volume and more about meaningful connection.

### Extending Into a Marketplace

As the idea evolved, it made sense to go beyond just conversations.

Teachers often share or sell materials — lesson notes, resources, tools — so I built a simple marketplace into the platform.

Users can:
- List items
- Discover resources nearby
- Reach out and have conversations directly

Keeping this within the same platform makes the experience feel unified instead of fragmented.

### How I Build

This project reflects how I like to work as a developer.

I don’t always start by trying to design the most complex system possible. Instead, I focus on:
- Choosing tools that reduce friction
- Leveraging modern frameworks like Next.js to their full potential
- Using AI as part of my workflow to move faster and explore ideas quickly
- Iterating based on how the product actually feels to use

CTA is less about showcasing deep technical complexity, and more about building something thoughtful, usable, and grounded in real-world needs.`,
    author: 'Emmanuel Obiora',
    tags: ['Fullstack', 'Next.js', 'Prisma', 'PostgreSQL', 'Product Design'],
    liveUrl: 'https://coxteachersapp.netlify.app/',
    coverImage:
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862359/portfolio/projects/cta/syjy72glhacnkz9uxerh.jpg',
    images: [
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862359/portfolio/projects/cta/syjy72glhacnkz9uxerh.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862360/portfolio/projects/cta/pwd3qyurcmpp5of17pmv.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862361/portfolio/projects/cta/vvayooj1ths45aryg9gt.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862362/portfolio/projects/cta/chcvl2zadl8dotnl4w34.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862363/portfolio/projects/cta/fed05kgyrqndqxzjvzu2.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862363/portfolio/projects/cta/l8spubwi1xh46dd0oovh.jpg',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775862364/portfolio/projects/cta/zddselisuy08elodcxyr.jpg',
    ],
    published: true,
  },
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Create Blog Post using Post model
    const existingBlog = await Post.findOne({ slug: staffroomData.blog.slug })
    if (existingBlog) {
      console.log('Blog post already exists (Post model), updating...')
      await Post.updateOne(
        { slug: staffroomData.blog.slug },
        staffroomData.blog
      )
    } else {
      await Post.create(staffroomData.blog)
      console.log('Blog post created (Post model)')
    }

    // 2. Create Project
    const existingProject = await Project.findOne({
      title: staffroomData.project.title,
    })
    if (existingProject) {
      console.log('Project already exists, updating...')
      await Project.updateOne(
        { title: staffroomData.project.title },
        staffroomData.project
      )
    } else {
      await Project.create(staffroomData.project)
      console.log('Project created')
    }

    console.log('Seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

seed()
