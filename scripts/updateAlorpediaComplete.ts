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

const images = {
  primary:
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142027/portfolio/projects/alorpedia/vgxqozip8hxtym5rftvx.png',
  gallery: [
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142013/portfolio/projects/alorpedia/c1njgeuklo9r1qyjdl1v.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142014/portfolio/projects/alorpedia/qffftohdofuq1j0kwjno.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142017/portfolio/projects/alorpedia/q1smcrwaviv5rugryflx.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142028/portfolio/projects/alorpedia/zy1boukiexaqs3hii4jh.png',
    'https://res.cloudinary.com/dgd3z5vbo/image/upload/v1772142029/portfolio/projects/alorpedia/ue9q0sz8ay0snk9tdj9j.png',
  ],
}

const projectData = {
  title: 'Alorpedia',
  description:
    'Designed and built a full-stack web platform that models cultural identity, community interaction, and genealogy through a scalable relational system for a global diaspora.',
  longDescription: `Alorpedia was an opportunity to translate a deeply cultural concept into a functional digital system. The goal was to build a web-based platform that could represent identity, lineage, and community interaction in a way that felt natural to users while remaining technically structured and scalable.

I approached this as a full-stack system design problem. The core challenge was modeling real-world social structures — villages, kindreds, age grades, and family lineage — into a relational database without losing their meaning or flexibility.

I started by breaking the product into foundational modules: identity and onboarding, a cultural content archive, and a community interaction layer. Using PostgreSQL allowed me to enforce the strict relational integrity required for complex family trees and community hierarchies, while the Node.js/Express backend ensured the system could handle concurrent operations as the user base grew.

On the frontend, I used React and Redux to manage complex application states, particularly around the dynamic rendering of multi-generational lineage trees (my approach to 'Digital Genealogy'). The UI was designed with a focus on accessibility and cultural resonance, ensuring that users across all demographics could navigate their digital heritage with ease.

This project was more than just a coding exercise; it was an exercise in digital anthropology, requiring constant iteration between technical requirements and the nuances of cultural identity.`,
  technologies: [
    'React',
    'Node.js',
    'MongoDB',
    'PostgreSQL',
    'Redux',
    'Express',
    'TailwindCSS',
  ],
  image: images.primary,
  images: images.gallery,
  liveUrl: 'https://alorpedia.com',
  githubUrl: 'https://github.com/obiora198',
  blogUrl: '/blog/alorpedia-preserving-culture-and-roots',
}

const blogData = {
  title: 'Engineering Alorpedia: Building a Digital Community Platform',
  slug: 'alorpedia-preserving-culture-and-roots',
  excerpt:
    'Engineering a cultural identity and community platform that models lineage and heritage through scalable systems.',
  content: `### Engineering Alorpedia: Building a Digital Community Platform

Alorpedia is a full-stack web application designed to preserve and celebrate cultural heritage. Building it was a journey through complex relational modeling, intuitive UI design, and scalable backend architecture.

---

### The Vision
The objective was clear: create a digital home for a global community where identity, lineage, and interaction aren't just features, but foundational pillars. I wanted to build a system that could accurately represent the multifaceted nature of cultural structures in a digital format.

---

### Core Technical Pillars

#### 1. Relational Identity Modeling
Modeling family lineage and community structures required a robust database design. Using PostgreSQL, I implemented recursive relational structures to handle:
- **Village and Kindred Hierarchies**: Ensuring every user and piece of content is anchored to their specific cultural origin.
- **Multigenerational Lineage**: Building query patterns that can trace ancestry across several generations without performance bottlenecks.

#### 2. Full-Stack Scalability
The backend was built with **Node.js** and **Express**, providing a lightweight yet powerful environment for handling API requests. I integrated **Redux** on the frontend to maintain a "source of truth" for the application's state, specifically for managing nested community data and user identities.

#### 3. Human-Centric UI/UX
Culture is personal. The design focuses on:
- **Accessibility**: A clean, responsive interface using **TailwindCSS**.
- **Visual Storytelling**: Using a dark, premium aesthetic that allows cultural imagery and content to stand out.

---

### Key Lessons
Building Alorpedia taught me that software engineering is as much about understanding the "human requirement" as it is about the technical one. Translating oral traditions and community norms into lines of code required deep empathy and dozens of iterations.

---

### Future Roadmap
I am currently working on implementing **Real-Time Notification Systems** and an **AI-Assisted Genealogy Tool** to help users discover connections they might have missed.

---

*Alorpedia is a testament to the power of technology in preserving what makes us unique.*`,
  author: 'Emmanuel Obiora',
  date: new Date().toISOString(),
  readTime: '6 min read',
  tags: ['Full Stack', 'Case Study', 'Cultural Identity', 'System Design'],
  category: 'Engineering',
  coverImage: images.primary,
  images: images.gallery,
  isPublished: true,
}

async function update() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('Connected to MongoDB')

    // 1. Update Project
    const project = await Project.findOneAndUpdate(
      { title: 'Alorpedia' },
      projectData,
      { new: true, upsert: true }
    )
    console.log(`Updated Alorpedia project: ${project.title}`)

    // 2. Update/Create Blog Post
    const post = await Post.findOneAndUpdate(
      { slug: blogData.slug },
      blogData,
      { new: true, upsert: true }
    )
    console.log(`Updated Alorpedia blog post: ${post.title}`)

    console.log('Migration completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error during migration:', error)
    process.exit(1)
  }
}

update()
