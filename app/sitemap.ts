import { getBlogPosts } from 'app/stuff/utils'

export const baseUrl = 'https://phaserush.info'

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/stuff/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/stuff'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
