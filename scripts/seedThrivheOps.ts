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
    title: 'Thrivhe Dietician & Admin Operations Platform',
    description:
      'Expanded and architected a multi-role healthcare operations platform, implementing hierarchical admin systems, secure service provider onboarding, payment verification flows, backend-driven content management, and a scalable dual-context dashboard architecture.',
    longDescription: `The Thrivhe Dietician & Admin Platform powers the operational backbone behind Thrivhe’s healthcare ecosystem. My contributions evolved across multiple phases — from deep backend integrations to architectural system improvements.

This was not just UI development. It involved role-based permissions, verification systems, security enhancements, financial workflow integrations, and eventually, structural dashboard evolution.

### Phase 1: Admin Dashboard Integration & Role Hierarchy
The system supported Super Admin, Admin, and Verification Admin roles with distinct permission boundaries. I integrated APIs to fetch and manage service providers, including status filtering (Pending, Verified, Flagged) and verification actions. Super Admin functionality ensured proper privilege restrictions and conditional UI rendering.

### Phase 2: Service Provider Dashboard Enhancements
I implemented security and financial enablement features, including Two-Factor Authentication (2FA) and profile/payment verification systems. This included profile image uploads and Flutterwave integration for payout validation, requiring structured form validation and error-resilient API handling.

### Phase 3: Admin Content Management
Implemented backend integrations allowing admins to manage FAQs and Job Posts, which are dynamically consumed by the public Thrivhe website. This bridged the Admin Dashboard and the Public Website through reliable data-fetching patterns.

### Phase 4: Dual-Context Dashboard Architecture
My most significant architectural contribution was implementing a Dual-Context Architecture (Individual vs. Organization) across both dashboards. Using Zustand with persistent middleware, I engineered a shared architecture that ensured seamless switching, session persistence, and reduced code duplication.`,
    image:
      'https://placehold.co/1200x630/2c3e50/ffffff?text=Thrivhe+Operations+Dashboard',
    images: [
      'https://placehold.co/800x600/34495e/ffffff?text=Admin+Account+Management',
      'https://placehold.co/800x600/2980b9/ffffff?text=Dietician+Dashboard+Context+Switch',
      'https://placehold.co/800x600/27ae60/ffffff?text=Content+Management+System',
    ],
    technologies: [
      'React 19',
      'Vite',
      'Tailwind CSS',
      'Material UI (MUI)',
      'Zustand',
      'TanStack Query',
      'Recharts',
      'JsPDF',
      'Axios',
      'Socket.io',
    ],
    category: 'fullstack',
    featured: true,
    liveUrl: '', // Private / Internal Platform
    githubUrl: '', // Privately Managed Repository
    blogUrl: '/blog/engineering-thrivhe-admin-and-dietician-platform',
    order: 0,
  },
  blog: {
    title: 'Engineering Thrivhe’s Admin & Dietician Platform',
    slug: 'engineering-thrivhe-admin-and-dietician-platform',
    excerpt:
      'An in-depth look at architecting a multi-role healthcare operations platform with hierarchical permissions, secure financial workflows, and a dual-context dashboard system.',
    content: `## Building the Operational Backbone of Thrivhe

The Thrivhe Dietician & Admin Platform powers the operational backbone behind Thrivhe’s healthcare ecosystem. My contributions evolved across multiple phases — from deep backend integrations to architectural system improvements.

### Hierarchical Admin System and Role Management

One of the first challenges was implementing a robust hierarchical admin system. Supporting Super Admin, Admin, and Verification Admin roles, I ensured that each had distinct permission boundaries. This involved:
- **API Integration**: Fetching and managing service providers based on status (Pending, Verified, Flagged).
- **Conditional UI Rendering**: Ensuring the interface aligned strictly with backend permission logic to prevent privilege escalation.

### Security and Financial Enablement

In the Service Provider (Dietician) Dashboard, I focused on security and financial workflows:
- **Two-Factor Authentication (2FA)**: Implementing frontend flows to enhance account security.
- **Payment Verification**: Integrating Flutterwave for payout validation and profile verification systems.
- **Resilient API Handling**: Ensuring that financial state transitions were handled with high reliability and clear user feedback.

### Bridging Systems: Admin Content Management

I implemented a CMS within the Admin Dashboard that bridged the gap between internal operations and the public platform. Admins can now manage FAQs and Job Posts that are dynamically consumed by the direct-to-consumer Thrivhe website.

### Architectural Evolution: Dual-Context Dashboard

My most significant contribution was the engineering of a **Dual-Context Architecture**. This allows users to switch between **Individual** and **Organization** contexts seamlessly.
- **Zustand with Persistence**: Managed global state and session persistence across reloads.
- **Shared Architecture**: Prevented code duplication by creating a scalable structure that supports both contexts within the same dashboard framework.

### The Impact

The platform has matured into a structured healthcare operations system supporting multi-level administrative control, secure provider onboarding, and real-time dashboard updates. This project demonstrates the balance between complex frontend architecture and mission-critical operational reliability.`,
    coverImage:
      'https://placehold.co/1200x630/2c3e50/ffffff?text=Thrivhe+Operations+Dashboard',
    author: 'Emmanuel Obi',
    tags: ['React', 'Architecture', 'Healthcare', 'Zustand', 'Admin Panel'],
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
