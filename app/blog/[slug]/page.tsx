import { getBlogBySlug } from '@/lib/blog'
import { Navigation } from '@/app/components/redesign/Navigation'
import { ThemeSwitcher } from '@/app/components/redesign/ThemeSwitcher'
import { notFound } from 'next/navigation'
import { ThemedBlogDetail } from '../components/ThemedBlogDetail'

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Convert post to plain object if needed, though Mongoose to JSON usually fine
  const plainPost = JSON.parse(JSON.stringify(post))

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navigation />
      <ThemeSwitcher />
      <ThemedBlogDetail post={plainPost} />
    </div>
  )
}
