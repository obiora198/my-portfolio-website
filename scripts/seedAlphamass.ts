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

const alphaMassData = {
  project: {
    title: 'Alpha Mass Limited — Corporate Website & BOI Loan Portal',
    description:
      'I designed and built the full corporate website for Alpha Mass Limited, a Nigerian engineering and technology company. The project covers a multi-page marketing site, a live project tracking system, and a self-contained BOI Loan Facilitation Portal — all shipped as a unified Next.js monorepo.',
    longDescription: `Alpha Mass Limited — Rebuilding a Corporate Website into a Working Platform

The original Alpha Mass Limited website was built with WordPress using a free theme.

It did the job — it looked clean, professional, and gave the company an online presence. But over time, it started to feel limiting. As the company began handling more projects, especially operational ones, it became clear that the website needed to do more than just present information.

It needed to actually support the business.

### Why I Decided to Rebuild It

The turning point was when Alpha Mass started working as a Business Development Service Provider (BDSP) for Bank of Industry loan applications.

This wasn’t just something to “announce” on a website — it required:
- Explaining the program clearly
- Helping users understand eligibility
- Guiding them through a process
- Providing a way to track progress

At that point, a typical WordPress setup with plugins didn’t feel like the right tool anymore.

So I decided to rebuild the entire platform using Next.js.

### A Simpler, More Flexible Approach

Instead of separating things into different systems, I wanted everything to live in one place.

Using Next.js (App Router), I built both:
- The corporate website
- The BOI loan portal

…inside a single, unified application.

For data handling and forms, I leaned on Supabase. It allowed me to avoid setting up a full custom backend while still having a reliable way to handle user input and enquiries.

The goal was to keep the architecture simple, flexible, and easy to extend as new projects come in.

### Designing Around Real Use Cases

This wasn’t just about redesigning pages — it was about making the website actually useful.

So I focused on a few key things:

- A **project system** that makes it easy to showcase ongoing, upcoming, and completed work without rewriting pages every time
- A **dedicated BOI portal** where users can actually interact with the process instead of just reading about it
- Clear, structured content that helps users understand what Alpha Mass does across different sectors

Everything is built to scale with the company’s activities, not just sit as static content.

### The BOI Loan Portal

The most important part of this project is the BOI portal.

Instead of treating it like a simple landing page, I approached it more like a lightweight product experience.

Users can:
- Learn about the different loan categories
- Check if they’re eligible
- Understand the requirements
- Follow a structured application process

The idea was to reduce confusion and make the process feel guided rather than overwhelming.

### Design Direction

Visually, I wanted the platform to feel strong and premium — something that reflects an engineering-focused company.

The design leans on:
- Dark backgrounds
- Deep red accents
- Clean, structured layouts

I also created reusable UI patterns so the entire site stays consistent as it grows.

### How I Build

This project reflects how I approach real-world builds.

I’m less focused on stacking as many technologies as possible, and more focused on:
- Choosing tools that reduce friction (like Next.js + Supabase)
- Keeping everything in one cohesive system
- Using AI as part of my workflow to move faster and refine ideas
- Building features that actually serve a purpose, not just fill space

In the end, this isn’t just a company website anymore — it’s a platform the business can actively use as it grows.`,
    image:
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867783/portfolio/projects/alphamass/mvtskvd73ywrvrl37tlp.png',
    images: [
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867783/portfolio/projects/alphamass/mvtskvd73ywrvrl37tlp.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867820/portfolio/projects/alphamass/mngwdls2qeyhny3bbhfi.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867809/portfolio/projects/alphamass/rq0y7jxqx3p8i8659gel.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867831/portfolio/projects/alphamass/t8biczia9w081kuhl2co.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867845/portfolio/projects/alphamass/w5fjwqamzshtll2dbi66.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867797/portfolio/projects/alphamass/w1cdjmvkllcrbrsliuvm.png',
    ],
    technologies: [
      'Next.js 14',
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Resend',
      'Lucide React',
    ],
    liveUrl: 'https://alphamass.netlify.app',
    githubUrl: '', // Update if available
    blogUrl: '/blog/alphamass-website-build',
    category: 'fullstack',
    featured: true,
    order: 3,
  },
  blog: {
    title: 'Building the Alpha Mass Limited Corporate Platform',
    slug: 'alphamass-website-build',
    excerpt:
      'How I designed and shipped a multi-purpose corporate website and operational BOI Loan Portal for an engineering company — all in a single Next.js 14 application.',
    content: `Alpha Mass Limited — Rebuilding a Corporate Website into a Working Platform

The original Alpha Mass Limited website was built with WordPress using a free theme.

It did the job — it looked clean, professional, and gave the company an online presence. But over time, it started to feel limiting. As the company began handling more projects, especially operational ones, it became clear that the website needed to do more than just present information.

It needed to actually support the business.

### Why I Decided to Rebuild It

The turning point was when Alpha Mass started working as a Business Development Service Provider (BDSP) for Bank of Industry loan applications.

This wasn’t just something to “announce” on a website — it required:
- Explaining the program clearly
- Helping users understand eligibility
- Guiding them through a process
- Providing a way to track progress

At that point, a typical WordPress setup with plugins didn’t feel like the right tool anymore.

So I decided to rebuild the entire platform using Next.js.

### A Simpler, More Flexible Approach

Instead of separating things into different systems, I wanted everything to live in one place.

Using Next.js (App Router), I built both:
- The corporate website
- The BOI loan portal

…inside a single, unified application.

For data handling and forms, I leaned on Supabase. It allowed me to avoid setting up a full custom backend while still having a reliable way to handle user input and enquiries.

The goal was to keep the architecture simple, flexible, and easy to extend as new projects come in.

### Designing Around Real Use Cases

This wasn’t just about redesigning pages — it was about making the website actually useful.

So I focused on a few key things:

- A **project system** that makes it easy to showcase ongoing, upcoming, and completed work without rewriting pages every time
- A **dedicated BOI portal** where users can actually interact with the process instead of just reading about it
- Clear, structured content that helps users understand what Alpha Mass does across different sectors

Everything is built to scale with the company’s activities, not just sit as static content.

### The BOI Loan Portal

The most important part of this project is the BOI portal.

Instead of treating it like a simple landing page, I approached it more like a lightweight product experience.

Users can:
- Learn about the different loan categories
- Check if they’re eligible
- Understand the requirements
- Follow a structured application process

The idea was to reduce confusion and make the process feel guided rather than overwhelming.

### Design Direction

Visually, I wanted the platform to feel strong and premium — something that reflects an engineering-focused company.

The design leans on:
- Dark backgrounds
- Deep red accents
- Clean, structured layouts

I also created reusable UI patterns so the entire site stays consistent as it grows.

### How I Build

This project reflects how I approach real-world builds.

I’m less focused on stacking as many technologies as possible, and more focused on:
- Choosing tools that reduce friction (like Next.js + Supabase)
- Keeping everything in one cohesive system
- Using AI as part of my workflow to move faster and refine ideas
- Building features that actually serve a purpose, not just fill space

In the end, this isn’t just a company website anymore — it’s a platform the business can actively use as it grows.`,
    author: 'Emmanuel Obiora',
    tags: ['Fullstack', 'Next.js', 'Supabase', 'Tailwind CSS', 'TypeScript', 'Product Design'],
    liveUrl: 'https://alphamass.netlify.app',
    coverImage:
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867783/portfolio/projects/alphamass/mvtskvd73ywrvrl37tlp.png',
    images: [
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867783/portfolio/projects/alphamass/mvtskvd73ywrvrl37tlp.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867820/portfolio/projects/alphamass/mngwdls2qeyhny3bbhfi.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867809/portfolio/projects/alphamass/rq0y7jxqx3p8i8659gel.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867831/portfolio/projects/alphamass/t8biczia9w081kuhl2co.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867845/portfolio/projects/alphamass/w5fjwqamzshtll2dbi66.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1775867797/portfolio/projects/alphamass/w1cdjmvkllcrbrsliuvm.png',
    ],
    published: true,
  },
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Create Blog Post using Post model
    const existingBlog = await Post.findOne({ slug: alphaMassData.blog.slug })
    if (existingBlog) {
      console.log('Blog post already exists (Post model), updating...')
      await Post.updateOne(
        { slug: alphaMassData.blog.slug },
        alphaMassData.blog
      )
    } else {
      await Post.create(alphaMassData.blog)
      console.log('Blog post created (Post model)')
    }

    // 2. Create Project
    const existingProject = await Project.findOne({
      title: alphaMassData.project.title,
    })
    if (existingProject) {
      console.log('Project already exists, updating...')
      await Project.updateOne(
        { title: alphaMassData.project.title },
        alphaMassData.project
      )
    } else {
      await Project.create(alphaMassData.project)
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
