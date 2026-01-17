import { config } from 'dotenv'
config() // Load .env file

import dbConnect from '@/lib/mongodb'
import Blog from '@/models/Blog'

const sampleBlogs = [
  {
    title: 'Building Scalable React Applications',
    slug: 'building-scalable-react-applications',
    excerpt:
      'Learn best practices for architecting large-scale React applications with maintainable code structure and optimal performance.',
    coverImage: '/blog-placeholder.jpg',
    author: 'Emmanuel Obiora',
    tags: ['React', 'Architecture', 'Best Practices'],
    views: 0,
    content: `
# Building Scalable React Applications

In this comprehensive guide, we'll explore the essential patterns and practices for building scalable React applications.

## Component Architecture

A well-structured component architecture is the foundation of any scalable React application. Here are some key principles:

- **Atomic Design**: Break down UI into atoms, molecules, organisms, templates, and pages
- **Container/Presentational Pattern**: Separate logic from presentation
- **Composition over Inheritance**: Use component composition for reusability

## State Management

For large applications, proper state management is crucial. Consider these approaches:

1. **Context API**: For app-level state that doesn't change frequently
2. **Redux/Zustand**: For complex state with many interconnected pieces
3. **React Query**: For server state management

## Performance Optimization

- Use React.memo for expensive component renders
- Implement code splitting with React.lazy
- Optimize bundle size  with tree shaking

By following these patterns, you'll be able to build React applications that scale gracefully as your project grows.
    `,
  },
  {
    title: 'TypeScript Tips for Better Code',
    slug: 'typescript-tips-for-better-code',
    excerpt:
      'Discover advanced TypeScript patterns that will help you write more type-safe and maintainable code in your projects.',
    coverImage: '/blog-placeholder.jpg',
    author: 'Emmanuel Obiora',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    views: 0,
    content: `
# TypeScript Tips for Better Code

TypeScript has become an essential tool for modern web development. Here are some advanced tips to level up your TypeScript game.

## Utility Types

TypeScript provides powerful utility types that can save you time:

\`\`\`typescript
type Partial<T> = { [P in keyof T]?: T[P] }
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
\`\`\`

## Discriminated Unions

Use discriminated unions for type-safe state management:

\`\`\`typescript
type State = 
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error }
\`\`\`

## Generic Constraints

Make your generic types more specific:

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

These patterns will help you catch bugs early and write more maintainable code.
    `,
  },
  {
    title: 'Modern CSS Techniques in 2026',
    slug: 'modern-css-techniques-2026',
    excerpt:
      'Explore the latest CSS features and techniques that are revolutionizing web design and development workflows.',
    coverImage: '/blog-placeholder.jpg',
    author: 'Emmanuel Obiora',
    tags: ['CSS', 'Web Design', 'Frontend'],
    views: 0,
    content: `
# Modern CSS Techniques in 2026

CSS has evolved significantly. Let's explore the modern features you should be using today.

## Container Queries

Container queries allow components to respond to their container's size:

\`\`\`css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
\`\`\`

## CSS Grid Level 2

Subgrid makes nested grids easier:

\`\`\`css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-template-columns: subgrid;
}
\`\`\`

## CSS Variables with calc()

Create dynamic, maintainable designs:

\`\`\`css
:root {
  --spacing-unit: 8px;
}

.component {
  padding: calc(var(--spacing-unit) * 2);
  margin: calc(var(--spacing-unit) * 4);
}
\`\`\`

These modern CSS techniques will help you build more flexible and maintainable stylesheets.
    `,
  },
]

async function seedBlogs() {
  try {
    await dbConnect()

    // Clear existing blogs
    await Blog.deleteMany({})

    // Insert sample blogs
    await Blog.insertMany(sampleBlogs)

    console.log('✅ Successfully seeded blog database with sample posts')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding blogs:', error)
    process.exit(1)
  }
}

seedBlogs()
