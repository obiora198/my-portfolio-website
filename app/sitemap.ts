// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://emmanuel-obiora.vercel.app'

  const routes = [
    '', // homepage
  ]

  return routes.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }))
}
