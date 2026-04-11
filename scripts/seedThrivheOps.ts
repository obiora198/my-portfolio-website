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

const data = {
  project: {
    title: 'Thrivhe Dietician & Admin Operations Platform',
    description:
      'Expanded and architected a multi-role healthcare operations platform, implementing hierarchical admin systems, secure service provider onboarding, payment verification flows, backend-driven content management, and a scalable dual-context dashboard architecture.',
    longDescription: `The Thrivhe Dietician & Admin Platform powers the operational backbone behind Thrivhe’s healthcare ecosystem. My contributions evolved across multiple phases — from deep backend integrations to complex frontend state management.

### Engineering Strategic Dashboards
At the heart of the system is a permission-based admin dashboard that manages dietician profiles, service verification, and secure onboarding. I built the hierarchical role system, allowing super-admins to oversee regional managers and direct providers.

### Secure Onboarding & Verification
I designed the service provider onboarding flow, integrating secure file uploads for credentials, identity verification steps, and automated notification triggers. This ensured that only verified professionals could access the clinical tools.

### Payment & Subscription Flow
I architected the subscription management and payment verification flows, ensuring seamless integration between the provider’s business profile and the core payment gateway.

### System Scalability
Using React and Zustand for state management, and Tailwind CSS for a scalable design language, I ensured the platform remains fast and maintainable even as more features were added across different phases.`,
    image:
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356289/portfolio/projects/thrivhe-ops/fpqzcir9atdotycebi5t.png',
    images: [
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356288/portfolio/projects/thrivhe-ops/ud8zrph93gh65qigtivo.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356289/portfolio/projects/thrivhe-ops/fpqzcir9atdotycebi5t.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356290/portfolio/projects/thrivhe-ops/ox01nch3i9zkyhg0aqoa.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356292/portfolio/projects/thrivhe-ops/oxbq5z2ucoyw6glofeqm.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356293/portfolio/projects/thrivhe-ops/zepcno6280lyjx5zsjwc.png',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'Node.js',
      'Express',
      'MongoDB',
    ],
    category: 'fullstack',
    featured: true,
    liveUrl: 'https://services.thrivhe.com/',
    githubUrl: '', // Privately Managed Repository
    blogUrl: '/blog/engineering-thrivhe-admin-and-dietician-platform',
    order: 1,
  },
  blog: {
    title: 'Engineering the Thrivhe Dietician & Admin Platform',
    slug: 'engineering-thrivhe-admin-and-dietician-platform',
    excerpt:
      'A deep dive into building the operational backbone of a healthcare ecosystem, from role-based access to payment verification.',
    content: `## Bridging the Gap Between Care and Operations

The Thrivhe Dietician & Admin Platform was a complex engineering challenge that required balancing high-security requirements with a seamless user experience for healthcare professionals.

### Architecting Permission-Based Access
Managing multiple user roles (Super Admin, Dietician, Service Provider) required a robust authentication and authorization strategy. I implemented a hierarchical role system that ensures data privacy and operational efficiency.

### Streamlining Onboarding
One of the core features was the service provider verification flow. I built a multi-step onboarding system that handles document uploads, profile verification, and automated status updates.

### Technical Stack & Decisions
Given the sensitive nature of healthcare data, I chose a stack that prioritizes performance and reliability.
- **React & TypeScript**: For type-safe frontend development.
- **Zustand**: For lightweight and scalable state management.
- **Tailwind CSS**: For a cohesive and maintainable design system.
- **MongoDB**: For flexible data modeling across different project phases.`,
    author: 'Emmanuel Obi',
    tags: ['React', 'Architecture', 'Healthcare', 'Zustand', 'Admin Panel'],
    coverImage:
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356288/portfolio/projects/thrivhe-ops/ud8zrph93gh65qigtivo.png',
    images: [
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356288/portfolio/projects/thrivhe-ops/ud8zrph93gh65qigtivo.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356289/portfolio/projects/thrivhe-ops/fpqzcir9atdotycebi5t.png',
      'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772356290/portfolio/projects/thrivhe-ops/ox01nch3i9zkyhg0aqoa.png',
    ],
    liveUrl: 'https://services.thrivhe.com/',
    published: true,
    views: 0,
  },
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Create Blog Post using Post model
    const existingBlog = await Post.findOne({ slug: data.blog.slug })
    if (existingBlog) {
      console.log('Blog post already exists. Updating...')
      await Post.findByIdAndUpdate(existingBlog._id, data.blog)
    } else {
      await Post.create(data.blog)
      console.log('Blog post created')
    }

    // 2. Create Project
    const existingProject = await Project.findOne({
      title: data.project.title,
    })
    if (existingProject) {
      console.log('Project already exists, updating...')
      await Project.updateOne({ title: data.project.title }, data.project)
    } else {
      await Project.create(data.project)
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
