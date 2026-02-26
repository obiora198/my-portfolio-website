import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Project from '../models/Project'
import Blog from '../models/Blog'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env')
  process.exit(1)
}

const data = {
  project: {
    title: 'Thrivhe',
    description:
      'Led a full frontend transformation of Thrivhe.com, evolving it from a static marketing site into a dynamic healthcare platform featuring organizational dashboards, onboarding systems, consultation workflows, and backend-integrated job and FAQ modules.',
    longDescription: `When I joined Thrivhe, the website was a basic 4–5 page static marketing site with minimal interactivity and a simple UI. My role was to modernize the entire frontend experience and expand it into a scalable healthcare platform aligned with newly provided product designs.

I began with a full site-wide redesign, rebuilding the homepage and core pages using a structured component architecture and a more scalable Tailwind-based design system. Beyond visual improvements, I introduced new product-facing pages for Individuals, Dieticians, and Organizations, transforming the platform from informational to operational.

A major milestone was engineering the Organization Dashboard — a mission-critical interface supporting:
- Multi-step organization onboarding flows
- Dietician invitation and onboarding systems
- Patient assignment workflows
- Consultation management logic

I implemented a multi-email tagging invite component with real-time validation and integrated backend-driven onboarding flows to streamline professional collaboration within organizations.

I also built and refined consultation booking systems, ensuring smooth multi-step scheduling, reliable state management, and secure API integrations. Given the healthcare context, performance and reliability were critical — every flow was built to minimize friction and maximize clarity.

In addition, I integrated backend-managed FAQs and job postings into the public platform. The content is created through a separate Service Provider Admin Dashboard (a related system I also contributed to), and dynamically consumed on the main site. This required designing resilient frontend data-fetching patterns and handling pagination, search, and file uploads for job applications.

Across the platform, I focused on:
- Structured data fetching with TanStack Query
- Centralized Axios service architecture
- Lightweight state management with Zustand
- Robust form validation using Formik and Yup
- Performance-conscious animations using GSAP
- Scalable, consistent UI patterns with Tailwind CSS

The result was a complete evolution of Thrivhe.com from a static website into a functional healthcare management ecosystem supporting real-world professional workflows.`,
    image:
      'https://placehold.co/1200x630/2563eb/ffffff?text=Thrivhe+Health+Platform',
    images: [
      'https://placehold.co/800x600/3b82f6/ffffff?text=Organization+Dashboard',
      'https://placehold.co/800x600/60a5fa/ffffff?text=Careers+and+Job+Board',
      'https://placehold.co/800x600/93c5fd/ffffff?text=Advanced+Analytics+SVG',
    ],
    technologies: [
      'React',
      'Tailwind CSS',
      'TanStack Query',
      'Zustand',
      'GSAP',
      'Axios',
      'Vite',
      'Lucide React',
      'Formik',
      'Yup',
    ],
    category: 'fullstack', // Matches the enum in Project model (fullstack is one of the allowed values)
    featured: true,
    liveUrl: 'https://www.thrivhe.com',
    githubUrl: '', // Privately Managed Repository
    blogUrl: '/blog/transforming-thrivhe-into-a-healthcare-platform',
    order: 0,
  },
  blog: {
    title: 'Transforming Thrivhe into a Healthcare Platform',
    slug: 'transforming-thrivhe-into-a-healthcare-platform',
    excerpt:
      'Deep dive into the architecture and product thinking behind Thrivhe, evolving from a static site to a production-grade healthcare ecosystem.',
    content: `## The Journey of Modernizing Thrivhe

When I joined Thrivhe, the website was a basic 4–5 page static marketing site with minimal interactivity and a simple UI. My role was to modernize the entire frontend experience and expand it into a scalable healthcare platform aligned with newly provided product designs.

### Core Challenges & Solutions

I began with a full site-wide redesign, rebuilding the homepage and core pages using a structured component architecture and a more scalable Tailwind-based design system. Beyond visual improvements, I introduced new product-facing pages for Individuals, Dieticians, and Organizations, transforming the platform from informational to operational.

### Engineering the Organization Dashboard

A major milestone was engineering the Organization Dashboard — a mission-critical interface supporting professional workflows. I implemented a multi-email tagging invite component with real-time validation and integrated backend-driven onboarding flows to streamline professional collaboration.

#### Key Features Built:
- **Multi-step organization onboarding flows**
- **Dietician invitation systems**
- **Patient assignment workflows**
- **Consultation management logic**

### Technical Decisions

Given the healthcare context, performance and reliability were critical. Every flow was built to minimize friction and maximize clarity.

- **TanStack Query & Axios**: For structured, resilient data fetching and centralized API communication.
- **Zustand**: For lightweight and predictable state management across complex flows.
- **Formik & Yup**: To handle robust form validation, especially crucial for medical scheduling and onboarding.
- **GSAP**: For performance-conscious animations that enhance the user experience without sacrificing speed.

### Integration with Admin Ecosystems

I also integrated backend-managed FAQs and job postings into the public platform. The content is created through a separate Service Provider Admin Dashboard and dynamically consumed on the main site. This required designing resilient frontend data-fetching patterns and handling pagination and search.

### Final Thoughts

The result was a complete evolution of Thrivhe.com into a functional healthcare management ecosystem. This project demonstrates my ability to modernize legacy systems, implement complex frontend architecture, and build production-grade interfaces that balance visual quality with operational reliability.`,
    coverImage:
      'https://placehold.co/1200x630/2563eb/ffffff?text=Thrivhe+Health+Platform',
    author: 'Emmanuel Obi',
    tags: ['React', 'Healthcare', 'Frontend Architecture', 'Redesign'],
    views: 0,
  },
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Create Blog Entry
    const existingBlog = await Blog.findOne({ slug: data.blog.slug })
    if (existingBlog) {
      console.log('Blog post already exists. Updating...')
      await Blog.findByIdAndUpdate(existingBlog._id, data.blog)
    } else {
      await Blog.create(data.blog)
      console.log('Blog post created')
    }

    // 2. Create Project Entry
    const existingProject = await Project.findOne({ title: data.project.title })
    if (existingProject) {
      console.log('Project already exists. Updating...')
      await Project.findByIdAndUpdate(existingProject._id, data.project)
    } else {
      await Project.create(data.project)
      console.log('Project created')
    }

    console.log('Seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  }
}

seed()
