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

const staffroomData = {
  project: {
    title: "Cox Teachers App (CTA): The Professional Educator's Network",
    description:
      'I designed and built CTA (Cox Teachers App), a mobile-first professional network for educators that combines a localized social feed with a full-featured marketplace. The platform connects teachers across schools and LGAs while providing a secure, high-performance ecosystem for collaboration and resource exchange.',
    longDescription: `Cox Teachers App (CTA): Engineering a Digital Staffroom for Educators

When I began building CTA (Cox Teachers App), the vision was clear: create a digital staffroom where teachers across different schools could connect, collaborate, and exchange resources — without being limited by geography.

In many regions, educators operate in silos. Professional collaboration often ends at the school gate. I wanted to design a platform that removed that barrier while still respecting privacy, locality, and trust.

But this wasn’t just a social platform. It needed to feel intentional, secure, and fast.

### Designing for Real-World Usage
From day one, I approached CTA as a mobile-first Progressive Web App, knowing that most teachers primarily access the internet through their phones.

The interface had to be:
- Fast even on mid-range Android devices
- Clean and distraction-free
- Easy to navigate with one hand
- Low in data consumption

Using Next.js 16 (App Router) and React 19, I focused heavily on performance and server rendering strategies to ensure fast initial loads. Tailwind CSS 4 allowed me to craft a clean, modern UI while maintaining consistency and scalability.

### Building the Intelligent Localized Feed
One of the most interesting architectural challenges was designing the feed system.

The platform needed to:
- Prioritize updates within a teacher’s LGA
- Allow school-based visibility controls
- Maintain privacy boundaries between institutions
- Scale efficiently as the user base grows

To achieve this, I designed a structured relational schema using Prisma 7 with PostgreSQL, carefully modeling relationships between users, posts, schools, LGAs, and engagement metrics.

### Engineering the Marketplace Layer
I extended CTA beyond networking by building a fully integrated educational marketplace.

Teachers can:
- List classroom materials
- Browse and filter listings by location
- Contact sellers directly
- Manage conversations within the platform

This required architecting a robust database design that supports user-to-listing relationships, conversation threads, and notification tracking.

### System Design & Security
Security was non-negotiable. I implemented custom authentication flows using Jose, ensuring secure token handling. Supabase was integrated for backend services where appropriate, while PostgreSQL handles relational consistency.`,
    image:
      'https://placehold.co/1200x630/4f46e5/ffffff?text=Staffroom+Main+Preview',
    images: [
      'https://placehold.co/800x600/6366f1/ffffff?text=Dashboard+View',
      'https://placehold.co/800x600/818cf8/ffffff?text=Marketplace+Listings',
      'https://placehold.co/800x600/a5b4fc/ffffff?text=Profile+Settings',
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
    blogUrl: '/blog/staffroom-development-journey',
    category: 'fullstack',
    featured: true,
    order: 2,
  },
  blog: {
    title: "Cox Teachers' App (CTA): Engineering a Digital Home for Educators",
    slug: 'CTA-development-journey',
    excerpt:
      'Deep dive into the architecture and product thinking behind CTA, a localized professional network and marketplace for educators.',
    content: `## The Vision
When I began building CTA (Cox Teachers App), the vision was clear: create a digital staffroom where teachers across different schools could connect, collaborate, and exchange resources — without being limited by geography.

### Designing for Performance
From day one, I approached CTA as a mobile-first Progressive Web App. Using Next.js 16 (App Router) and React 19, I focused heavily on performance and server rendering strategies to ensure fast initial loads even on mid-range devices.

### Relational Complexity
To handle the localized feed and school-based visibility, I designed a structured relational schema using Prisma 7 with PostgreSQL. This allowed for granular control over post visibility and user relationships.

### The Marketplace
The integrated educational marketplace supports classroom material listings, location-based filtering, and direct messaging between sellers and buyers.

### Security
I implemented secure authentication using Jose for token handling, ensuring that professional boundaries and institution privacy are maintained.`,
    author: 'Emmanuel Obiora',
    tags: ['Fullstack', 'Next.js', 'Prisma', 'PostgreSQL', 'Product Design'],
    coverImage:
      'https://placehold.co/1200x630/4f46e5/ffffff?text=Staffroom+Development+Journey',
  },
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Create Blog Post
    const existingBlog = await Blog.findOne({ slug: staffroomData.blog.slug })
    if (existingBlog) {
      console.log('Blog post already exists, updating...')
      await Blog.updateOne(
        { slug: staffroomData.blog.slug },
        staffroomData.blog
      )
    } else {
      await Blog.create(staffroomData.blog)
      console.log('Blog post created')
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
